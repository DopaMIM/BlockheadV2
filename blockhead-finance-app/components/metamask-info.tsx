"use client"

import { useState } from "react"
import { addressesByNetwork } from "@/constants"
import { useEthers } from "@usedapp/core"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MetaMaskConnectButton } from "@/components/metamask-connect-button"

export function MetamaskInfo({ classes = "" }) {
  const [network, setNetwork] = useState("")
  const { account, chainId } = useEthers()
  const networkName = addressesByNetwork[chainId || 0]?.name || ""
  if (networkName && networkName !== network) {
    setNetwork(networkName)
  }
  return (
    <Card
      className={
        classes +
        " m-2 sm:m-4 p-2 sm:p-4 max-w-[200px] sm:max-w-none scale-90 sm:scale-100"
      }
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium grow">
          <MetaMaskConnectButton />
          <div className="flex items-center space-x-1 mt-1 sm:mt-0">
            <span
              className={`rounded-full h-2 w-2 ${
                account ? "bg-green-600" : "bg-red-600"
              }`}
            ></span>
            <span className="text-[10px] sm:text-xs">
              {account ? "" : "Not "}Connected
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 sm:space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="text-base sm:text-2xl font-bold truncate max-w-[140px] sm:max-w-none">
                {network}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Network</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[160px] sm:max-w-none">
          {account || "Not connected"}
        </p>
      </CardContent>
    </Card>
  )
}
