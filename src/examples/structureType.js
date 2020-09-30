// tslint:disable
const lcs = require('../../build/lib')

function bufferFromHex(hex) {
  const data = hex.match(/.{1,2}/g).map((x) => parseInt(x, 16));
  return new Uint8Array(data);
}

const hex = '4d01000000000000000000000000000003646669db4b0ed53d2fd0a74ce8f0d106e7ab144eb0fbab00'
const buffer = Buffer.from(bufferFromHex(hex));

lcs.registerType('SentPaymentEvent', {
  amount: 'u128',
  denom: 'vector<u8>',
  payee: 'address',
  metadata: 'vector<u8>',
});

const result = lcs.deserialize(buffer, 'SentPaymentEvent')

console.log(result);
