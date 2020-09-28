import CursorBuffer from '../common/CursorBuffer';

import {TypeInterface, RegisterTypeInterface} from "./interfaces";
const XRegExp = require('xregexp')

function isFunction(functionToCheck: any): boolean {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function isTypeInterface(target: any): boolean {
  return isFunction(target.code) && isFunction(target.decode)
}

class LCS {
  private static types: Map<string, TypeInterface> = new Map<string, TypeInterface>();

  public static registerType(name: string, definition: RegisterTypeInterface | TypeInterface): void {
    const typeResolver: TypeInterface = this._resolveType(definition);

    this.types.set(name, typeResolver)
  }

  private static _resolveType(payload: string | TypeInterface | RegisterTypeInterface): TypeInterface {
    if(isTypeInterface(payload)) {
      return payload as TypeInterface
    } else if(typeof payload !== 'string') {
      const defIsComposed: RegisterTypeInterface = payload as RegisterTypeInterface;
      const keys: string[] = Object.keys(defIsComposed);
      const resolvedProps: {
        [key: string]: TypeInterface
      } = {};

      for(const key of keys) {
        resolvedProps[key] = this._resolveType(defIsComposed[key])
      }

      return {
        code(cursor: CursorBuffer, value: any, options?: any): any {
          const keys: string[] = Object.keys(resolvedProps);
          const result: any = {};

          for(const key of keys) {
            result[key] = resolvedProps[key].code(cursor, value[key] || undefined, options)
          }

          return result;
        },
        decode: (cursor: CursorBuffer, options?: any) => {
          const keys: string[] = Object.keys(resolvedProps);
          const result: any = {};

          for(const key of keys) {
            result[key] = resolvedProps[key].decode(cursor, options)
          }

          return result;
        }
      }
    }

    const type: { value: string, of: any } = this._parseType(payload as string)

    const resolver: TypeInterface | undefined = this.types.get(type.value as string);

    if(!resolver) {
      throw new Error('Unsupported type: ' + type.value)
    }

    if(type.of) {
      return {
        code: (cursor: CursorBuffer, value: any, options?: any) => {
          return resolver.code(cursor, value, type.of)
        },
        decode: (cursor: CursorBuffer, options?: any) => {
          return resolver.decode(cursor, type.of)
        }
      }
    }

    return resolver
  }

  public static deserialize(buffer: CursorBuffer, type: RegisterTypeInterface | TypeInterface | string, options?: any): any;
  public static deserialize(buffer: Buffer, type: RegisterTypeInterface | TypeInterface | string, options?: any): any
  public static deserialize(buffer: any, type: RegisterTypeInterface | TypeInterface | string, options?: any): any {
    let cursor = buffer

    if(buffer instanceof Buffer) {
      cursor = new CursorBuffer(buffer)
    } else if(!(buffer instanceof CursorBuffer)) {
      throw new Error('Allowed Buffer or CursorBuffer instance')
    }

    const typeInterface: TypeInterface = this._resolveType(type)

    return typeInterface.decode(cursor, options)
  }

  public static serialize(value: any, type: RegisterTypeInterface | TypeInterface | string, options?: any): any {
    const cursor: CursorBuffer = new CursorBuffer(new Uint8Array())
    const typeInterface: TypeInterface = this._resolveType(type)

    const result = typeInterface.code(cursor, value, options)

    return {
      buffer: Buffer.from(cursor.dataView.buffer),
      items: result,
    }
  }

  private static _parseType(typeString: string): { of: any; value: any } {
    const ref = {
      value: null,
      of: null,
    }

    parseType(typeString, ref)

    return ref
  }
}

function parseType(type: string, ref: any) {
  const res = XRegExp.matchRecursive(type, '\\<', '\\>', 'gi', {
    valueNames: ['value', 'break', 'generic', 'break']
  });

  const value = res.find((item: any) => item.name === 'value')
  const generic = res.find((item: any) => item.name === 'generic')

  if(value) {
    ref.value = value.value
  }

  if(generic) {
    ref.of = {
      value: null,
      of: null,
    }

    parseType(generic.value, ref.of)
  }
}

export default LCS
