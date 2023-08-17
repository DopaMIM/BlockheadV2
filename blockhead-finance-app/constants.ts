export const ALCHEMY_API_KEY = "dZK6Z73kwwZWeJbol0U09SHT4WYTh8HH"
export const INFURA_API_KEY = "a590d8b1947a43fd900c17a3610d1f11"

export const UI_PARTNER_ADDRESS = "0x6457d77316fB6C7F5b5bf37DDD03ED957D559EE5" //LEVI_TEST_WALLET_ADDRESS

export const PolygonChainId = 137
export const SepoliaChainId = 11155111
export const LineaTestChainId = 59140
export const LineaMainChainId = 59144

export const addressesByNetwork: Record<number, Record<string, string>> = {
  // Polygon
  [PolygonChainId]: {
    usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    recurringPayments: "0x888A74ad7076Fae93147DC1e01146Ae9381e5B36",
    name: "Polygon Mainnet",
  },
  //Sepolia
  [SepoliaChainId]: {
    usdc: "0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5",
    recurringPayments: "0x350288deCD61DDf2D05954074475536cdA0d4405",
    name: "Sepolia Test Network",
  },
  // Linea Testnet
  [LineaTestChainId]: {
    usdc: "0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068",
    recurringPayments: "0x27D15b36507cAF395D7Bb5607A0974c1dbE85c0e",
    name: "Linea Testnet",
  },
  // Linea Mainnet
  [LineaMainChainId]: {
    usdc: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
    recurringPayments: "0x06a4a92ee08d44769fa67e85571a6c9a5a0299ca",
    name: "Linea Mainnet",
  },
}
