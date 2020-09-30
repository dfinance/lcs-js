# lcs-js

Implementation of the LCS (Libra Canonical Serialization) protocol.

> NOTE: Currently only data deserialization function is available

## Examples

```
npm install lcs-js
```

### Deserialize base type

LCS library supports the following basic types:
* u8
* u32
* u64
* u128
* boolean | bool
* address
* vector<TYPE>

```JavaScript
const lcs = require('lcs-js');

function bufferFromHex(hex) {
  const data = hex.match(/.{1,2}/g).map((x) => parseInt(x, 16));
  return new Uint8Array(data);
}

const hex = '4d0100000000000000000000000000000';
const buffer = Buffer.from(bufferFromHex(hex));

const result = lcs.deserialize(buffer, 'u128');

console.log(result); // 333

```

### Register custom type

```JavaScript
const lcs = require('lcs-js');

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

console.log(result); // dfi
```

### Register custom structure

```JavaScript
const lcs = require('lcs-js');

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
/*

    {
      amount: BigNumber { s: 1, e: 2, c: [ 333 ] },
      denom: [ 100, 102, 105 ],
      payee: 'db4b0ed53d2fd0a74ce8f0d106e7ab144eb0fbab',
      metadata: []
    }

*/
```
