// blockhead-finance-app/src/config/chains.ts

export type HexAddr = `0x${string}`;

export type ChainConfig = {
  id: number;
  key: 'polygon' | 'linea' | 'sepolia';
  name: string;
  rpcUrls: { http: string[] };
  blockExplorers?: { default: { name: string; url: string } };
  nativeCurrency: { name: string; symbol: string; decimals: number };
  contracts: {
    automationLayer?: HexAddr;
    paymentLayer?: HexAddr;
    sequencer?: HexAddr;
    duh?: HexAddr;
    batchProcessor?: HexAddr;
  };
};

export const CHAINS: Record<ChainConfig['key'], ChainConfig> = {
  polygon: {
    id: 137,
    key: 'polygon',
    name: 'Polygon',
    rpcUrls: { http: [process.env.NEXT_PUBLIC_RPC_POLYGON ?? ''] },
    blockExplorers: { default: { name: 'Polygonscan', url: 'https://polygonscan.com' } },
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    // From your README (Polygon addresses)
    // https://github.com/DopaMIM/blockhead#polygon-addresses
    contracts: {
      sequencer:      '0x702A1Fe16B6ff595E9E2AaAfa1e8e760Df88588C',
      automationLayer:'0x62f43fb9832e83cde2380327fad8d46e77ad0bc8',
      duh:            '0xA4dABAa2DeDC043433A598e4cB1810842714A7d5',
      paymentLayer:   '0x888A74ad7076Fae93147DC1e01146Ae9381e5B36',
      batchProcessor: '0x42c6AA0e41Ded8cfcdF260bc3155f26d00FafC20',
    },
  },
  linea: {
    id: 59144,
    key: 'linea',
    name: 'Linea',
    rpcUrls: { http: [process.env.NEXT_PUBLIC_RPC_LINEA ?? ''] },
    blockExplorers: { default: { name: 'Linea Explorer', url: 'https://explorer.linea.build' } },
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    // From your README (Linea mainnet)
    // https://github.com/DopaMIM/blockhead#linea-mainnet-addresses
    contracts: {
      sequencer:      '0x08399e90178e2E51e160394123C8301E27AFBe92',
      automationLayer:'0xCa9A5C76e9c792c9106C9c1376521bAE52244790',
      paymentLayer:   '0x06a4a92ee08d44769fa67e85571a6c9a5a0299ca',
      duh:            '0x5cb892fc4b6b99F6B11882A504a3b20fA6252e3B',
      batchProcessor: '0x21bCd9863988EE6EE23EaF765b9E66bfA7D356F6',
    },
  },
  sepolia: {
    id: 11155111,
    key: 'sepolia',
    name: 'Sepolia',
    rpcUrls: { http: [process.env.NEXT_PUBLIC_RPC_SEPOLIA ?? ''] },
    blockExplorers: { default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' } },
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    // From your README (Sepolia testnet)
    // https://github.com/DopaMIM/blockhead#sepolia-testnet-addresses
    contracts: {
      sequencer:      '0xa3417E64A0749073183E948d3d1b17317230Bc87',
      automationLayer:'0x57216Cb79FA0B948d48d28Fb374Af3ca718E5705',
      paymentLayer:   '0x350288deCD61DDf2D05954074475536cdA0d4405',
      duh:            '0xe981768F7eBeC7001c21DAC72C1BD986c1522580',
      batchProcessor: '0x4a254804dc93f65453d21f8a4AbE7E52A4320782',
    },
  },
};

export type ChainKey = keyof typeof CHAINS;
