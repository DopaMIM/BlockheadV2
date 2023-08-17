import React from "react"
import { useEthers } from "@usedapp/core"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const MetaMaskConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers()
  // 'account' being undefined means that we are not connected.
  return (
    <div className="my-2">
      {account ? (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => deactivate()}
        >
          <div className="flex items-center justify-around space-x-2">
            <span className="">Disconnect wallet</span>
            <Icons.metamask className="w-8 h-8" />
          </div>
        </Button>
      ) : (
        <Button className="w-full" onClick={() => activateBrowserWallet()}>
          <div className="flex items-center justify-around space-x-2">
            <span className="">Connect wallet</span>
            <Icons.metamask className="w-8 h-8" />
          </div>
        </Button>
      )}
    </div>
  )
}
