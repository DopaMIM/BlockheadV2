import React, { useState } from "react"
import { useEthers } from "@usedapp/core"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { WalletChooser } from "@/components/wallet-chooser"

export const MetaMaskConnectButton = () => {
  const { account, deactivate } = useEthers()
  const [showChooser, setShowChooser] = useState(false)

  return (
    <div className="my-2">
      {account ? (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => deactivate()}
        >
          <div className="flex items-center justify-around space-x-2">
            <span>Disconnect wallet</span>
            <Icons.metamask className="w-8 h-8" />
          </div>
        </Button>
      ) : (
        <>
          <Button
            className="w-full"
            onClick={() => setShowChooser((prev) => !prev)}
          >
            <div className="flex items-center justify-around space-x-2">
              <span>Connect wallet</span>
              <Icons.metamask className="w-8 h-8" />
            </div>
          </Button>

          {showChooser && (
            <WalletChooser
              className="mt-2"
              onConnected={() => {
                console.log("connected")
                setShowChooser(false) // hide chooser once connected
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
