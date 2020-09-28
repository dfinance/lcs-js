export default [
  {
    address: "0x1",
    namespace: "Account",
    name: 'SentPaymentEvent',
    definition: {
      type: 'struct',
      props: {
        amount: {
          type: 'u128'
        },
        denom: {
          type: 'string'
        },
        payee: {
          type: 'address',
        },
        metadata: {
          type: 'vector',
          of: {
            type: 'u8'
          }
        },
      }
    }
  }
]
