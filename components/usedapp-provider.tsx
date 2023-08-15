"use client"

import * as React from "react"
import {
  ALCHEMY_API_KEY,
  INFURA_API_KEY,
  SepoliaTestNetwork,
} from "@/constants"
import { DAppProvider, LineaTestnet, Polygon, type Config } from "@usedapp/core"
import { providers } from "ethers"

const providerAlchemy = new providers.AlchemyProvider("matic", ALCHEMY_API_KEY)
providerAlchemy.pollingInterval = 3000
const providerInfura = new providers.InfuraProvider(
  "sepolia" /*, INFURA_API_KEY*/
)
providerInfura.pollingInterval = 3000
const useDappConfig: Config = {
  readOnlyChainId: SepoliaTestNetwork.chainId, //Polygon.chainId,
  readOnlyUrls: {
    [Polygon.chainId]: providerAlchemy,
    [SepoliaTestNetwork.chainId]: providerInfura,
    [LineaTestnet.chainId]: providerInfura,
  },
}

export function UseDAppProvider({ children }: { children: React.ReactNode }) {
  return <DAppProvider config={useDappConfig}>{children}</DAppProvider>
}
