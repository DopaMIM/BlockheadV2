// blockhead-finance-app/src/lib/web3.ts
import type { ChainKey } from '../config/chains';
import { CHAINS } from '../config/chains';

// Narrow window.ethereum typing to avoid TS complaints without a full EIP-1193 type.
declare global {
  interface Window {
    ethereum?: any;
  }
}

export function getRpcUrl(chain: ChainKey): string {
  const url = CHAINS[chain].rpcUrls.http[0];
  if (!url) throw new Error(`Missing RPC URL for ${chain}. Did you set NEXT_PUBLIC_RPC_*?`);
  return url;
}

/**
 * Attempts to switch the user's injected wallet to the given chain.
 * Falls back to addEthereumChain if the chain is unknown.
 */
export async function switchToChain(chain: ChainKey) {
  const cfg = CHAINS[chain];
  if (!window.ethereum) throw new Error('No injected wallet found');

  const hexChainId = `0x${cfg.id.toString(16)}`;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    });
  } catch (err: any) {
    // 4902 = unknown chain
    if (err?.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: hexChainId,
          chainName: cfg.name,
          nativeCurrency: cfg.nativeCurrency,
          rpcUrls: cfg.rpcUrls.http,
          blockExplorerUrls: cfg.blockExplorers ? [cfg.blockExplorers.default.url] : [],
        }],
      });
    } else {
      throw err;
    }
  }
}

/**
 * Utility to produce a block explorer tx URL from a chain + tx hash.
 */
export function explorerTxUrl(chain: ChainKey, txHash: string) {
  const base = CHAINS[chain].blockExplorers?.default.url;
  return base ? `${base}/tx/${txHash}` : undefined;
}
