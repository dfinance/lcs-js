import LCS from './lcs';
import CursorBuffer from '../common/CursorBuffer';
import { TypeInterface } from './interfaces';

const u8: TypeInterface = {
  code(cursor: CursorBuffer, value: any): any {
    return null;
  },
  decode(cursor: CursorBuffer): any {
    return cursor.read8();
  },
};

const u32: TypeInterface = {
  code(cursor: CursorBuffer, value: any): any {
    return null;
  },
  decode(cursor: CursorBuffer): any {
    return cursor.read32();
  },
};

const u64: TypeInterface = {
  code(cursor: CursorBuffer, value: any): any {
    return null;
  },
  decode(cursor: CursorBuffer): any {
    return cursor.read64();
  },
};

const u128: TypeInterface = {
  code(cursor: CursorBuffer, value: any): any {
    return null;
  },
  decode(cursor: CursorBuffer): any {
    return cursor.read128();
  },
};

const address: TypeInterface = {
  code(cursor: CursorBuffer, value: any): any {
    return null;
  },
  decode(cursor: CursorBuffer): any {
    // tslint:disable-next-line
    const address: Uint8Array = cursor.readXBytes(20);

    return Buffer.from(address).toString('hex');
  },
};

const vector: TypeInterface = {
  code(cursor: CursorBuffer, value: any, options: any): any {
    return null;
  },
  decode(cursor: CursorBuffer, options: any): any {
    if (!options || !options.value) {
      throw new Error('Need provide vector type, example: vector<u8>');
    }

    const vectorLength: number = cursor.readULEB().toNumber();
    const res: any[] = [];

    for (let i = 0; i < vectorLength; i++) {
      res.push(LCS.deserialize(cursor, options.value, options.of));
    }

    return res;
  },
};

// tslint:disable-next-line
const boolean: TypeInterface = {
  code(cursor: CursorBuffer, value: any): any {
    return null;
  },
  decode(cursor: CursorBuffer): any {
    return cursor.readBool();
  },
};

export default {
  u8,
  u32,
  u64,
  u128,
  boolean,
  bool: boolean,
  address,
  vector,
};
