import {BufferUtil} from './common/BufferUtil';
import LCS from './lib'
import CursorBuffer from "./common/CursorBuffer";

// 4d010000000000000000000000000000     03     646669      db4b0ed53d2fd0a74ce8f0d106e7ab144eb0fbab     00
//               u128                  vector                               payee                     metadata
//                                      len

const simpleHexData: string = '4d01000000000000000000000000000003646669db4b0ed53d2fd0a74ce8f0d106e7ab144eb0fbab00';
const CDPData: string = '80969800000000000000000000000000676a52d0a7c0a8aff30a518964f9bfd90fed0563aa81';
const buffer = Buffer.from(BufferUtil.fromHex(CDPData));

LCS.registerType('string', {
  code: (cursor: CursorBuffer, value: any, options?: any) => {
    const charCodes = value
      .split('')
      .map((char: string) => char.charCodeAt(0))

    return LCS.serialize(charCodes, 'vector<u8>', options)
  },
  decode: (cursor: CursorBuffer, options?: any) => {
    const vector: any = LCS.deserialize(cursor, 'vector<u8>', options)

    return vector.map((charCode: number) => String.fromCharCode(charCode)).join('')
  }
})

LCS.registerType('SentPaymentEvent', {
  amount: 'u128',
  denom: 'string',
  payee: 'address',
  metadata: 'vector<u8>'
})

LCS.registerType('OfferCreatedEvent', {
  offered_amount: 'u128',
  margin_call_at: 'u8',
  collateral_multiplier: 'u8',
  lender: 'address'
})

const decoded = LCS.deserialize(buffer, 'OfferCreatedEvent')
console.log(decoded);

