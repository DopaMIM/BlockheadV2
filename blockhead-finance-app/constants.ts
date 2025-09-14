export const ALCHEMY_API_KEY = "dZK6Z73kwwZWeJbol0U09SHT4WYTh8HH"
export const INFURA_API_KEY = "a590d8b1947a43fd900c17a3610d1f11"

export const UI_PARTNER_ADDRESS = "0x6457d77316fB6C7F5b5bf37DDD03ED957D559EE5" //LEVI_TEST_WALLET_ADDRESS

export const PolygonChainId = 137
export const SepoliaChainId = 11155111
export const LineaTestChainId = 59140
export const LineaMainChainId = 59144
export const EthereumMainnetChainId = 1
export const BscChainId = 56
export const ArbitrumChainId = 42161
export const OptimismChainId = 10
export const AvalancheChainId = 43114
export const FantomChainId = 250
export const BaseChainId = 8453
export const ZkSyncEraChainId = 324

// constants.ts

// each inner object must be Record<string, number>
/*
export const tokenDecimalsByNetwork: Record<number, Record<string, number>> = {
  137: {
    usdc: 6,
    usdt: 6,
    dai: 18,
    weth: 18,
    wmatic: 18,
  },
  59144: {
    // Linea tokens (fill in real values later)
    usdc: 6,
    usdt: 6,
    dai: 18,
    weth: 18,
    wmatic: 18,
  },
  11155111: {
    // Sepolia test tokens (fill in real values later)
    usdc: 6,
    usdt: 6,
    dai: 18,
    weth: 18,
    wmatic: 18,
  },
};

*/
export const tokenDecimalsByNetwork: Record<number, Record<string, number>> = {
  [EthereumMainnetChainId]: { usdc: 6, usdt: 6, dai: 18, tusd: 18, usdp: 18 },
  [BscChainId]: { busd: 18, usdt: 6, usdc: 6, dai: 18, tusd: 18 },
  [PolygonChainId]: { usdc: 6, usdt: 6, dai: 18, frax: 18, tusd: 18 },
  [ArbitrumChainId]: { usdc: 6, usdt: 6, dai: 18, frax: 18, tusd: 18 },
  [OptimismChainId]: { usdc: 6, usdt: 6, dai: 18, susd: 18, frax: 18 },
  [AvalancheChainId]: { usdc: 6, usdt: 6, dai: 18, frax: 18, usdce: 6 },
  [BaseChainId]: { usdc: 6, usdt: 6, dai: 18, frax: 18 },
  [LineaMainChainId]: { usdc: 6, usdt: 6, dai: 18 },
  [ZkSyncEraChainId]: { usdc: 6, usdce: 6, usdt: 6, dai: 18, frax: 18 },
  [SepoliaChainId]: { usdc: 6 }, // just your test token
}

export const addressesByNetwork: Record<number, Record<string, string>> = {
  [EthereumMainnetChainId]: {
    usdc: "0xA0b86991C6218b36c1d19D4a2e9Eb0cE3606eB48", // Circle USDC (6)
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Tether (6)
    dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // Maker DAI (18)
    tusd: "0x0000000000085d4780B73119b644AE5ecd22b376", // TrueUSD (18)
    usdp: "0x8E870D67F660d95D5be530380D0eC0bd388289E1", // Pax Dollar (18)
    recurringPayments: "0xREPLACE_ME",
    name: "Ethereum Mainnet",
  }, // USDC: :contentReference[oaicite:0]{index=0} USDT: :contentReference[oaicite:1]{index=1} DAI: :contentReference[oaicite:2]{index=2} TUSD: :contentReference[oaicite:3]{index=3} USDP(Pax): :contentReference[oaicite:4]{index=4}

  // 2) BNB Smart Chain (BSC)
  [BscChainId]: {
    busd: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD (18) (legacy but still common)
    usdt: "0x55d398326f99059fF775485246999027B3197955", // USDT (6)
    usdc: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // USDC (6)
    dai: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", // DAI (18)
    tusd: "0x14016E85a25aeb13065688CaFfB43044C2Ef8674", // TUSD (18)
    recurringPayments: "0xREPLACE_ME",
    name: "BNB Smart Chain",
  }, // USDT: :contentReference[oaicite:5]{index=5} USDC: :contentReference[oaicite:6]{index=6} DAI: :contentReference[oaicite:7]{index=7} TUSD: :contentReference[oaicite:8]{index=8}

  // 3) Polygon PoS
  [PolygonChainId]: {
    usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC (bridged) (6)
    usdt: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT (6)
    dai: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // DAI (18)
    frax: "0x45c32fA6DF82eaD1e2eF74d17b76547EDdFaFF89", // FRAX (18)
    tusd: "0x2e1ad108ff1d8c782fcbbb89aad783ac49586756", // TUSD (18)
    recurringPayments: "0xD273Bfc6C210a50bD0900F5271564B907F391D03",
    name: "Polygon Mainnet",
  }, // DAI: :contentReference[oaicite:9]{index=9} FRAX: :contentReference[oaicite:10]{index=10}

  // 4) Arbitrum One
  [ArbitrumChainId]: {
    usdc: "0xAf88d065E77C8CC2239327C5EDb3A432268e5831", // Native USDC (6)
    usdt: "0xfd086BC7CD5C481DCC9C85ebe478A1C0b69FCBb9", // USDT (6)
    dai: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", // DAI (18)
    frax: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F", // FRAX (18)
    tusd: "0x0000000000085d4780B73119b644AE5ecd22b376", // TUSD bridged (if needed)
    recurringPayments: "0xREPLACE_ME",
    name: "Arbitrum One",
  }, // USDC: :contentReference[oaicite:11]{index=11} USDT: :contentReference[oaicite:12]{index=12} DAI: :contentReference[oaicite:13]{index=13} FRAX: :contentReference[oaicite:14]{index=14}

  // 5) Optimism (OP Mainnet)
  [OptimismChainId]: {
    usdc: "0x0b2C639c533813f4Aa9D7837CaF62653d097ff85", // Native USDC (6)
    usdt: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", // USDT (6)
    dai: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", // DAI (18)
    susd: "0x8c6f28f2F1A3C87F0f938B96d27520d9751EC8d9", // sUSD (18)
    frax: "0x2e3d870790dc77a83dd1d18184acc7439a53f475", // FRAX (18)
    recurringPayments: "0xREPLACE_ME",
    name: "Optimism",
  }, // USDC: :contentReference[oaicite:15]{index=15} USDT: :contentReference[oaicite:16]{index=16} DAI: :contentReference[oaicite:17]{index=17} sUSD: :contentReference[oaicite:18]{index=18} FRAX: :contentReference[oaicite:19]{index=19}

  // 6) Avalanche C-Chain
  [AvalancheChainId]: {
    usdc: "0xB97EF9Ef8734C71904d8002F8b6Bc66Dd9c48a6E", // Native USDC (6)
    usdt: "0x9702230A8Ea53601f5CD2dc00fDBC13d4DF4A8C7", // USDT (6)
    dai: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // (bridged DAI variants exist; verify usage if needed)
    frax: "0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64", // FRAX (18)
    usdce: "0xA7D7079b0FEaD91F3e65f86e8915Cb59C1a4C664", // USDC.e (bridged from ETH) (6)
    recurringPayments: "0xREPLACE_ME",
    name: "Avalanche C-Chain",
  }, // USDC: :contentReference[oaicite:20]{index=20} USDT: :contentReference[oaicite:21]{index=21} USDC.e: :contentReference[oaicite:22]{index=22} FRAX: :contentReference[oaicite:23]{index=23}

  // 7) Fantom Opera
  [FantomChainId]: {
    usdc: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", // (USDC.e historically prevalent) (6)
    usdt: "0x049d68029688eAbF473097a2fC38ef61633A3C7A", // fUSDT (6)
    dai: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E", // DAI (18)
    frax: "0xDb12F08aa64e8E20F4CA10F5b9517E2d2E8fC034", // (check liquidity before exposing)
    usdce: "0x2F733095B80A04B38B0D10cC884524A3D09B836A", // Wormhole USDC.e (6)
    recurringPayments: "0xREPLACE_ME",
    name: "Fantom Opera",
  }, // USDC (bridged): :contentReference[oaicite:24]{index=24} USDT (fUSDT): :contentReference[oaicite:25]{index=25} USDC.e (Wormhole): :contentReference[oaicite:26]{index=26}
  // (DAI address is common knowledge on FTM; verify in explorer before prod)

  // 8) Base
  [BaseChainId]: {
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71B54bDA02913", // Native USDC (6)
    usdt: "0x2d1aDB45Bb1d7D2556c6558aDb76CFD4F9F4ed16", // USDT (6)
    dai: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", // DAI (18)
    frax: "0x909DBdE1eBE906Af95660033e478D59EFe831fED", // FRAX (18)
    usdbc: "0xA0b... (deprecated bridged USDC.e; avoid new use)",
    recurringPayments: "0xREPLACE_ME",
    name: "Base",
  }, // USDC: :contentReference[oaicite:27]{index=27} USDT: :contentReference[oaicite:28]{index=28} DAI: :contentReference[oaicite:29]{index=29} FRAX: :contentReference[oaicite:30]{index=30}

  // 9) Linea Mainnet
  [LineaMainChainId]: {
    usdc: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff", // USDC (6)
    usdt: "0xA219439258ca9da29E9Cc4cE5596924745e12B93", // USDT (6)
    dai: "0x4aF15eC2A0Bd43Db75dD04E62fAA3B8Ef36B00D5", // DAI (18)
    // add more as liquidity develops
    recurringPayments: "0x06a4a92ee08d44769fa67e85571a6c9a5a0299ca",
    name: "Linea Mainnet",
  }, // USDC: :contentReference[oaicite:31]{index=31} USDT: :contentReference[oaicite:32]{index=32} DAI: :contentReference[oaicite:33]{index=33}

  // 10) zkSync Era
  [ZkSyncEraChainId]: {
    usdc: "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4", // Native USDC (6)
    usdce: "0x3355df6D4c9C3035724Fd0e3914dE96A5A83aaf4", // USDC.e (bridged) (6)
    usdt: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C", // (popular USDT on Era) (6) — verify usage
    dai: "0x4b77B6bA0C3A3Ad0F0bE5cF2A3E0c3C0d1A14c9d", // (DAI on Era) — verify usage
    frax: "0x3eF7Dd85e0E2E6F2C8F971eD31C5D6C2C3b1C3cE", // (FRAX on Era) — verify usage
    recurringPayments: "0xREPLACE_ME",
    name: "zkSync Era",
  }, // Native USDC + USDC.e background: :contentReference[oaicite:34]{index=34}
}
/*
  // Polygon
  [PolygonChainId]: {
    usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    usdt:  "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    dai:   "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
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
    // Optimism Mainnet
    [OptimismChainId]: {
      usdc: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
      recurringPayments: "0x06a4a92ee08d44769fa67e85571a6c9a5a0299ca",
      name: "Optimism Mainnet",
    },
  */
