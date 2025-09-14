"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useEthers } from "@usedapp/core"
import { Button } from "@/components/ui/button"
import {
  getInjectedWallets,
  selectInjectedProvider,
  initEip6963Listener,
} from "@/src/config/lib/detect-wallets"

export function WalletChooser({
  onConnected,
  className,
}: {
  onConnected?: () => void
  className?: string
}) {
  const { activateBrowserWallet, account, error } = useEthers()
  const [busy, setBusy] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const onceRef = useRef(false)

  useEffect(() => {
    if (!onceRef.current) {
      onceRef.current = true
      initEip6963Listener()
      // give wallets time to announce
      const id = setTimeout(() => setRefresh((n) => n + 1), 120)
      return () => clearTimeout(id)
    }
  }, [])

  const wallets = useMemo(() => getInjectedWallets(), [refresh])

  async function connectWith(provider: any) {
    if (!provider || busy) return
    setBusy(true)
    try {
      // lock to chosen provider
      selectInjectedProvider(provider)

      // request accounts explicitly from that provider
      await provider.request({ method: "eth_requestAccounts" })

      // let usedapp sync with window.ethereum
      await activateBrowserWallet()

      onConnected?.()
    } catch (e) {
      // swallow; UI shows usedapp error below if any
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  // Fallback single button if we don't detect multiples
  if (!wallets.length) {
    return (
      <Button
        disabled={busy || !!account}
        onClick={() => connectWith((window as any).ethereum)}
        className={className}
      >
        {busy ? "Connecting…" : account ? "Connected" : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <div className={className}>
      <div className="flex gap-2 flex-wrap">
        {wallets.map((w) => (
          <Button
            key={w.key}
            variant="secondary"
            disabled={!!account || busy}
            onClick={() => connectWith(w.provider)}
            title={w.info?.rdns ?? w.label}
          >
            {busy ? "Connecting…" : `Connect ${w.label}`}
          </Button>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error?.message ?? "Failed to connect"}
        </p>
      )}
    </div>
  )
}
