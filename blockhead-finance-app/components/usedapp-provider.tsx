"use client"

import * as React from "react"
import {
  PolygonChainId,
  OptimismChainId,
  BaseChainId,
  ArbitrumChainId,
} from "@/constants"
import { DAppProvider, type Config } from "@usedapp/core"
import { providers } from "ethers"

// Helper to build a JsonRpcProvider with sane polling
function mkHttpProvider(url?: string, pollingMs = 9000) {
  if (!url) return undefined
  const p = new providers.JsonRpcProvider(url)
  p.pollingInterval = pollingMs
  return p
}

// Pull URLs from .env (HTTP(S) only for browser)
const RPC_POLYGON    = process.env.NEXT_PUBLIC_RPC_POLYGON
const RPC_OPTIMISM   = process.env.NEXT_PUBLIC_RPC_OPTIMISM
const RPC_BASE       = process.env.NEXT_PUBLIC_RPC_BASE
const RPC_LINEA      = process.env.NEXT_PUBLIC_RPC_LINEA
const RPC_SEPOLIA    = process.env.NEXT_PUBLIC_RPC_SEPOLIA
const RPC_LINEA_T    = process.env.NEXT_PUBLIC_RPC_LINEA_TESTNET
const RPC_ARBITRUM   = process.env.NEXT_PUBLIC_RPC_ARBITRUM // <-- added

// Build providers (skip any that are undefined)
const providerPolygon    = mkHttpProvider(RPC_POLYGON)
const providerOptimism   = mkHttpProvider(RPC_OPTIMISM)
const providerBase       = mkHttpProvider(RPC_BASE)
const providerLinea      = mkHttpProvider(RPC_LINEA)
const providerSepolia    = mkHttpProvider(RPC_SEPOLIA)
const providerLineaTest  = mkHttpProvider(RPC_LINEA_T)
const providerArbitrum   = mkHttpProvider(RPC_ARBITRUM) // <-- added

// Build readOnlyUrls without any undefined values
const readOnlyUrls: Config["readOnlyUrls"] = Object.fromEntries(
  [
    [PolygonChainId,    providerPolygon],
    [OptimismChainId,   providerOptimism],
    [BaseChainId,       providerBase],
    [ArbitrumChainId,   providerArbitrum], // <-- added
  ].filter(([, p]) => !!p) // keep only defined providers
) as Config["readOnlyUrls"]

const useDappConfig: Config = {
  // Pick a sensible default — Polygon since you're prioritizing it
  readOnlyChainId: PolygonChainId,
  readOnlyUrls,
  pollingInterval: 9000,
}

export function UseDAppProvider({ children }: { children: React.ReactNode }) {
  return <DAppProvider config={useDappConfig}>{children}</DAppProvider>
}
