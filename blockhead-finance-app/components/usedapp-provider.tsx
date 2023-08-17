"use client"

import * as React from "react"
import {
  ALCHEMY_API_KEY, INFURA_API_KEY, LineaMainChainId, LineaTestChainId, PolygonChainId, SepoliaChainId,
} from "@/constants"
import { DAppProvider, type Config } from "@usedapp/core"
import { providers } from "ethers"

const providerPolygon = new providers.AlchemyProvider('matic', ALCHEMY_API_KEY)
providerPolygon.pollingInterval = 3000
const providerSepolia = new providers.JsonRpcProvider("https://sepolia.infura.io/v3/" + INFURA_API_KEY)
providerSepolia.pollingInterval = 3000
const providerLinea = new providers.JsonRpcProvider("https://linea-mainnet.infura.io/v3/" + INFURA_API_KEY)
providerLinea.pollingInterval = 3000
const providerLineaTestnet = new providers.JsonRpcProvider("https://linea-goerli.infura.io/v3/" + INFURA_API_KEY)
providerLineaTestnet.pollingInterval = 3000

const useDappConfig: Config = {
  readOnlyChainId: LineaMainChainId,
  readOnlyUrls: {
    [PolygonChainId]: providerPolygon,
    [SepoliaChainId]: providerSepolia,
    [LineaTestChainId]: providerLineaTestnet,
    [LineaMainChainId]: providerLinea,
  },
}

export function UseDAppProvider({ children }: { children: React.ReactNode }) {
  return <DAppProvider config={useDappConfig}>{children}</DAppProvider>
}
