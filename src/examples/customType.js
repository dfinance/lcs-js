// tslint:disable
const lcs = require('../../build/lib')

function bufferFromHex(hex) {
  const data = hex.match(/.{1,2}/g).map((x) => parseInt(x, 16));
  return new Uint8Array(data);
}

const hex = '03646669'
const buffer = Buffer.from(bufferFromHex(hex));

lcs.registerType('string', {
  decode(cursor, value, options) {
    // A string is a vector that contains the UTF8 character numbers
    const vector = lcs.deserialize(cursor, 'vector<u8>', options);

    return vector.map(charCode => String.fromCharCode(charCode)).join('');
  },
  code() {
    // TODO in development
  },
});

const result = lcs.deserialize(buffer, 'string')

console.log(result);
