// tslint:disable
const lcs = require('../../build/lib')

function bufferFromHex(hex) {
  const data = hex.match(/.{1,2}/g).map((x) => parseInt(x, 16));
  return new Uint8Array(data);
}

const hex = '4d0100000000000000000000000000000'
const buffer = Buffer.from(bufferFromHex(hex));

const result = lcs.deserialize(buffer, 'u128')

console.log(result);
