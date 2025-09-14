// blockhead-finance-app/src/lib/web3.ts
//import { CHAINS, type ChainKey } from '@ /config/chains';
//import { CHAINS, type ChainKey } from '../config/chains';
import { CHAINS, type ChainKey } from '../chains';



// Narrow typing for the injected provider without pulling in a full EIP-1193 type package.
declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Switch the user's injected wallet to the given chain (by key from CHAINS).
 * If the chain isn't known in the wallet, it tries to add it first.
 */
export async function switchToChain(chain: ChainKey) {
  const cfg = CHAINS[chain];
  if (!window.ethereum) throw new Error('No injected wallet found');

  const chainIdHex = `0x${cfg.id.toString(16)}`;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (err: any) {
    // 4902 = chain not added to the wallet yet
    if (err?.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainIdHex,
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

/** Read the current chain id from the injected wallet. Returns a number like 59144. */
export async function getInjectedChainId(): Promise<number | undefined> {
  if (!window.ethereum) return;
  const hex = await window.ethereum.request({ method: 'eth_chainId' });
  return parseInt(hex, 16);
}

/** Optional: build a tx explorer URL for toasts/links. */
export function explorerTxUrl(chain: ChainKey, txHash: string) {
  const base = CHAINS[chain].blockExplorers?.default.url;
  return base ? `${base}/tx/${txHash}` : undefined;
}
