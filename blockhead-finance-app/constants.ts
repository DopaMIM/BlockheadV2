//export const ALCHEMY_API_KEY = "dZK6Z73kwwZWeJbol0U09SHT4WYTh8HH"
export const INFURA_API_KEY = "a590d8b1947a43fd900c17a3610d1f11"

// transferBotNewest2
//export const RECURRING_PAYMENT_CONTRACT = "0x32dF483898cDB30692C61BddEDbC24eAdcc5246B";
export const MY_WALLET_ADDRESS = "0x589dAD6225927Ff416836391370D017588682278"
export const LEVI_WALLET_ADDRESS = "0xeA9B8D8aD9668D0FdedE95333E816c36F2210fc0"
export const LEVI_TEST_WALLET_ADDRESS =
  "0x6457d77316fB6C7F5b5bf37DDD03ED957D559EE5"
export const UI_PARTNER_ADDRESS = LEVI_TEST_WALLET_ADDRESS

// https://polygonscan.com/token/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063
// PoS means Proof-of-Stake
// (PoS) Dai Stablecoin
export const DAI_ADDRESS = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
// https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174
// (PoS) USD Coin
export const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
// https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f
// (PoS) Tether USD
export const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
// https://polygonscan.com/token/0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6
// Wrapped BTC
export const WBTC_ADDRESS = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"
// https://polygonscan.com/token/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619
// Wrapped ETH
export const WETH_ADDRESS = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
// https://polygonscan.com/token/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270
// Wrapped MATIC
export const WMATIC_ADDRESS = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"


export const addressesByNetwork = {
  // Polygon
  137: {
    usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    recurringPayments: "0x888A74ad7076Fae93147DC1e01146Ae9381e5B36"
  },
  // Sepolia
  11155111: {
    usdc: "0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5",
    recurringPayments: "0x350288deCD61DDf2D05954074475536cdA0d4405"
  },
  // Linea Testnet
  59140: {
    usdc: "0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068",
    recurringPayments: "0x27D15b36507cAF395D7Bb5607A0974c1dbE85c0e"
  },
  // Linea Mainnet
  59144: {
    usdc: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
    recurringPayments: "0x06a4a92ee08d44769fa67e85571a6c9a5a0299ca"
  }
}

export const SepoliaTestNetwork = {
  name: "Sepolia Test Network",
  chainId: 11155111,
}
export const SepoliaRecurringPaymentsContractAddress =
  "0x350288deCD61DDf2D05954074475536cdA0d4405"
export const SepoliaTokenContractAddress =
  "0xe981768F7eBeC7001c21DAC72C1BD986c1522580"

export const RECURRING_PAYMENT_CONTRACT =
  SepoliaRecurringPaymentsContractAddress
