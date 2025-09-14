// blockhead-finance-app/src/config/tokens.ts
import type { ChainKey } from './chains';

export type TokenConfig = {
  chain: ChainKey;
  symbol: string;
  address: `0x${string}`;
  decimals: number;
  logoURI?: string;
};

export const TOKENS: TokenConfig[] = [
  // --- Polygon mainnet tokens ---
  // USDC (bridged, 6 decimals)
  { chain: 'polygon', symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },

  // USDT (6)
  { chain: 'polygon', symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },

  // DAI (18)
  { chain: 'polygon', symbol: 'DAI',  address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18 },

  // WETH (PoS, 18)
  { chain: 'polygon', symbol: 'WETH', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18 },

  // WMATIC (18)
  { chain: 'polygon', symbol: 'WMATIC', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', decimals: 18 },
];

export const tokensByChain = (chain: ChainKey) =>
  TOKENS.filter(t => t.chain === chain);
