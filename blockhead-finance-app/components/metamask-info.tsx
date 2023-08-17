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
  const { account, chainId } = useEthers()
  return (
    <Card className={classes + " m-4"}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium grow">
          <MetaMaskConnectButton />
          <div className="flex items-center space-x-1">
            <span
              className={`rounded-full h-2 w-2 ${
                account ? "bg-green-600" : "bg-red-600"
              }`}
            ></span>
            <span>{account ? "" : "Not "}Connected</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="text-2xl font-bold">
                {addressesByNetwork[chainId || 0]?.name || ""}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Network</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-xs text-muted-foreground">
          {account || "Not connected"}
        </p>
      </CardContent>
    </Card>
  )
}
