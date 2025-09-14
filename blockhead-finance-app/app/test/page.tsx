'use client';

import { useEffect, useState } from 'react';
import { switchToChain, getInjectedChainId } from '../../src/config/lib/web3';

declare global { interface Window { ethereum?: any } }

export default function TestPage() {
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // keep UI in sync with wallet
  useEffect(() => {
    (async () => {
      try {
        const id = await getInjectedChainId();
        setChainId(id ?? null);
      } catch {}
    })();

    const onChainChanged = (hex: string) => setChainId(parseInt(hex, 16));
    const onAccountsChanged = (accs: string[]) => setAccount(accs?.[0] ?? null);

    window.ethereum?.on?.('chainChanged', onChainChanged);
    window.ethereum?.on?.('accountsChanged', onAccountsChanged);
    return () => {
      window.ethereum?.removeListener?.('chainChanged', onChainChanged);
      window.ethereum?.removeListener?.('accountsChanged', onAccountsChanged);
    };
  }, []);

  async function connect() {
    setError(null);
    try {
      if (!window.ethereum) throw new Error('No wallet detected.');
      const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accs?.[0] ?? null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  async function switchNow() {
    setBusy(true);
    setError(null);
    try {
      await switchToChain('linea');          // ← the helper you added
      const id = await getInjectedChainId(); // read back to confirm
      setChainId(id ?? null);
      alert('Switched (or added) Linea');
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Test Chain Switch</h1>
      <p>Current chain id: <b>{chainId ?? 'unknown'}</b></p>
      <p>Account: <code>{account ?? '(not connected)'}</code></p>

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button onClick={connect} disabled={busy}>Connect Wallet</button>
        <button onClick={switchNow} disabled={busy}>Switch to Linea</button>
      </div>

      {error && <p style={{ color: 'crimson', marginTop: 12 }}>Error: {error}</p>}
    </main>
  );
}
