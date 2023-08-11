"use client";

import * as React from "react"
import {type Config, DAppProvider, Polygon} from "@usedapp/core";
import { providers } from "ethers";
import {ALCHEMY_API_KEY, INFURA_API_KEY, SepoliaTestNetwork} from "@/constants";

//const provider = new providers.AlchemyProvider('sepolia', ALCHEMY_API_KEY);
const provider = new providers.InfuraProvider('sepolia'/*, INFURA_API_KEY*/);
provider.pollingInterval = 3000
const useDappConfig: Config = {
  readOnlyChainId: SepoliaTestNetwork.chainId, //Polygon.chainId,
  readOnlyUrls: {
    [Polygon.chainId]: provider,
    [SepoliaTestNetwork.chainId]: provider,
  },
}

export function UseDAppProvider({children}:{children: React.ReactNode}) {
  return (
    <DAppProvider config={useDappConfig}>
      {children}
    </DAppProvider>
  )
}