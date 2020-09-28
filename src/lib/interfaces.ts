import CursorBuffer from "../common/CursorBuffer";

export interface TypeInterface {
  decode: (cursor: CursorBuffer, options?: any) => any,
  code: (cursor: CursorBuffer, value: any, options?: any) => any
}

export interface RegisterTypeInterface {
  [key: string]: TypeInterface | string
}
