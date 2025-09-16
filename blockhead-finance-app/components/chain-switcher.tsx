"use client"

import React from "react"
import { useEffect, useMemo, useState } from "react"
import { useEthers } from "@usedapp/core"
import { addressesByNetwork } from "@/constants"

type Props = {
  /** If provided, only these chainIds will be selectable. */
  allowedChains?: number[]
  className?: string
}

/** Utility: treat non-empty "0x..." and not "0xREPLACE_ME" as a deployed address */
function isDeployed(addr?: string) {
  if (!addr) return false
  if (addr === "0xREPLACE_ME") return false
  return /^0x[a-fA-F0-9]{40}$/.test(addr)
}

export default function ChainSwitcher({ allowedChains, className = "" }: Props) {
  const { chainId, switchNetwork, account } = useEthers()
  const [pendingTarget, setPendingTarget] = useState<number | null>(null)

  // Build the selectable chain list:
  // - If allowedChains provided, use that
  // - Else include all chains that have a real recurringPayments address
  const options = useMemo(() => {
    const entries = Object.entries(addressesByNetwork)
      .map(([idStr, rec]) => [Number(idStr), rec] as const)
      .filter(([id, rec]) => {
        if (allowedChains && !allowedChains.includes(id)) return false
        return isDeployed(rec?.recurringPayments)
      })
      .map(([id, rec]) => ({ id, name: rec.name || `Chain ${id}` }))
      .sort((a, b) => a.name.localeCompare(b.name))
    return entries
  }, [allowedChains])

  // After wallet switches networks, reload to refetch data bound to chain
  useEffect(() => {
    if (pendingTarget && chainId === pendingTarget) {
      setPendingTarget(null)
      // small delay to let providers settle
      setTimeout(() => {
        if (typeof window !== "undefined") window.location.reload()
      }, 300)
    }
  }, [chainId, pendingTarget])

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextId = Number(e.target.value)
    if (!nextId || nextId === chainId) return
    try {
      setPendingTarget(nextId)
      switchNetwork?.(nextId) // wallet prompt
    } catch (err) {
      console.error(err)
      setPendingTarget(null)
    }
  }

  const disabled = !account || options.length === 0

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <label htmlFor="chain-switcher" className="text-sm text-muted-foreground">
        Network
      </label>
      <select
        id="chain-switcher"
        value={chainId ?? ""}
        onChange={handleChange}
        disabled={disabled}
        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
      >
        {options.length === 0 && (
          <option value="">
            {account ? "No active networks" : "Connect wallet"}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      {pendingTarget && (
        <span className="text-xs text-muted-foreground">Switching…</span>
      )}
    </div>
  )
}
