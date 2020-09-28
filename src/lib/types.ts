import {BufferUtil} from "../common/BufferUtil";
import LCS from "./lcs";
import CursorBuffer from "../common/CursorBuffer";
import {TypeInterface} from "./interfaces";

const leb = require('leb')

function uint8ToBytes(source: number): Uint8Array {
  const buffer = new ArrayBuffer(1)
  const view = new DataView(buffer)
  view.setUint8(0, source)
  return new Uint8Array(buffer)
}

function uint32ToBytes(source: number): Uint8Array {
    const buffer = new ArrayBuffer(4)
    const view = new DataView(buffer)
    view.setUint32(0, source, true)
    return new Uint8Array(buffer)
}

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

const u8: TypeInterface = {
  code(cursor: CursorBuffer, value: any): any {
    const bytes = leb.encodeUIntBuffer(uint8ToBytes(value))
    cursor.write(bytes)
    return Buffer.from(bytes)
  },
  decode(cursor: CursorBuffer): any {
    return cursor.read8()
  },
}

const u32: TypeInterface = {
  code(cursor: CursorBuffer, value: any): any {
      const bytes = leb.encodeUIntBuffer(uint32ToBytes(value))
      cursor.write(bytes)
      return Buffer.from(bytes)
  },
  decode(cursor: CursorBuffer): any {
    return cursor.read32()
  },
}

const u64: TypeInterface = {
  code(cursor: CursorBuffer, value: any): any {
  },
  decode(cursor: CursorBuffer): any {
    return cursor.read64()
  },
}

const u128: TypeInterface = {
  code(cursor: CursorBuffer, value: any): any {

  },
  decode(cursor: CursorBuffer): any {
    return cursor.read128()
  },
}

const address: TypeInterface = {
  code(cursor: CursorBuffer, value: any): any {
    console.log(value);
    const buffer = Buffer.from(BufferUtil.fromHex(value))

    const uint = Uint8Array.from(buffer)
    cursor.write(uint)

    return buffer
  },
  decode(cursor: CursorBuffer): any {
    const address: Uint8Array = cursor.readXBytes(20);

    return Buffer.from(address).toString('hex');
  },
}

const vector: TypeInterface = {
  code(cursor: CursorBuffer, value: any, options: any): any {
    if (!options || !options.value) {
      throw new Error('Need provide vector type, example: vector<u8>')
    }

    const vectorLength: number = value.length
    const res: any[] = [];

    const arrayLengthBuffer = LCS.serialize(value.length, 'u8')
    cursor.write(Uint8Array.from(arrayLengthBuffer))

    for (let i = 0; i < vectorLength; i++) {
      const val = LCS.serialize(value[i], options.value, options.of)
      cursor.write(Uint8Array.from(val))

      res.push(val)
    }

    return res
  },
  decode(cursor: CursorBuffer, options: any): any {
    if (!options || !options.value) {
      throw new Error('Need provide vector type, example: vector<u8>')
    }

    const vectorLength: number = cursor.readULEB().toNumber()
    const res: any[] = [];

    for (let i = 0; i < vectorLength; i++) {
      const val = LCS.deserialize(cursor, options.value, options.of)
      res.push(val)
    }

    return res
  },
}

export default {
  u8,
  u32,
  u64,
  u128,
  address,
  vector
}
