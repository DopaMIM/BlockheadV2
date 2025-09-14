"use client"

import { useState } from "react"
import Link from "next/link"
import { UI_PARTNER_ADDRESS, addressesByNetwork, tokenDecimalsByNetwork } from "@/constants"
import { parseUnits } from "@ethersproject/units"
import {
  ERC20Interface,
  useEthers,
  useSigner,
  useTokenAllowance,
} from "@usedapp/core"
import { BigNumber, Contract } from "ethers"

import { useRecurringPaymentContract } from "@/lib/use-recurring-payment-contract"
import { frequencyToSeconds } from "@/lib/utils"
import type { Subscription } from "@/lib/validations/subscription"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { MetamaskInfo } from "@/components/metamask-info"

interface ICreateRecurringPaymentForm {
  subscription: Subscription
}

export default function CreateRecurringPaymentForm({
  subscription,
}: ICreateRecurringPaymentForm) {
  const { account, chainId, error, switchNetwork } = useEthers()
  const signer = useSigner()
  const [loading, setLoading] = useState(false)

  const subscriptionChainId = parseInt(subscription.meta.network, 10)

  // Auto-switch to required chain if needed
  if (subscriptionChainId !== chainId || error?.name === "ChainIdError") {
    switchNetwork(subscriptionChainId)
  }

  // --- Fixed merchant-designated token (no dropdown) ---
  const tokenKey = (subscription.meta.token || "").toLowerCase()

  // Prefer values saved at creation; fall back to constants
  const subscriptionTokenAddress =
    // @ts-expect-error meta may include these optional fields
    subscription.meta?.tokenAddress ??
    addressesByNetwork[subscriptionChainId]?.[tokenKey] ??
    ""

  const tokenDecimals =
    // @ts-expect-error meta may include these optional fields
    subscription.meta?.tokenDecimals ??
    tokenDecimalsByNetwork[subscriptionChainId]?.[tokenKey] ??
    (tokenKey === "usdc" ? 6 : 18)

  const amountInWei = parseUnits(subscription.meta.amount.toString(), tokenDecimals)

  const recurringPaymentContract = useRecurringPaymentContract(subscriptionChainId)

  const subscriptionToken = new Contract(
    subscriptionTokenAddress,
    ERC20Interface,
    signer
  )

  // Check allowance for this subscription's token against the spender
  const allowance = useTokenAllowance(
    subscriptionTokenAddress,
    account,
    addressesByNetwork[subscriptionChainId]?.recurringPayments
  )
  const hasAllowance =
    BigNumber.isBigNumber(allowance) && allowance.gte(amountInWei)

  // Approve (large buffer) using correct decimals
  async function approveToken() {
    setLoading(true)
    try {
      if (subscriptionToken) {
        await subscriptionToken.approve(
          addressesByNetwork[subscriptionChainId]?.recurringPayments,
          parseUnits("10000000", tokenDecimals)
        )
      }
      toast({
        title: "Approval submitted.",
        description: `Approving ${tokenKey.toUpperCase()}…`,
      })
    } catch (e: any) {
      toast({
        title: "Approval failed",
        description: e?.message ?? "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function approveSubscription() {
    setLoading(true)
    try {
      if (!subscriptionToken || !recurringPaymentContract) {
        return
      }

      const functionArgs = [
        subscription.meta.receiverAddress,
        amountInWei,
        subscriptionTokenAddress,
        frequencyToSeconds(subscription.meta.frequency),
        UI_PARTNER_ADDRESS,
        [`subscriptionId:${subscription.id}`],
        frequencyToSeconds(subscription.meta.trial),
      ]

      const gasLimit =
        await recurringPaymentContract.estimateGas.createRecurringPayment(
          ...functionArgs
        )
      // @ts-ignore usedapp returns { value, error } in some hooks; direct contract call returns tx
      const { value, error } =
        await recurringPaymentContract.createRecurringPayment(
          ...functionArgs,
          { gasLimit }
        )

      if (error) {
        console.error(error.message)
        toast({
          title: "Something went wrong.",
          description:
            "Your create recurring payment request failed. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success!",
        description: "You created a recurring payment.",
      })
    } catch (e: any) {
      toast({
        title: "Transaction failed",
        description: e?.message ?? "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <MetamaskInfo classes="absolute top-0 right-0" />
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-2xl">
        <div className="flex flex-col space-y-8 text-center">
          <div>
            <div className="flex space-x-2 justify-center">
              <h1 className="mt-16 text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
                {subscription.meta.recipientName}
              </h1>
            </div>
            <p className="text-lg text-gray-500 sm:text-xl">
              {subscription.meta.productName}
            </p>
          </div>

          <div className="grid w-full items-start gap-6 rounded-lg border p-6">
            <div className="grid gap-6">
              <h3 className="text-xl font-bold sm:text-2xl">
                Setup recurring payment?
              </h3>
              <ul className="grid gap-3 text-sm text-muted-foreground grid-cols-1">
                <li className="flex flex-col sm:flex-row space-x-2">
                  <span className="flex items-center shrink-0">
                    <Icons.logo className="mr-2 h-4 w-4" /> Verify the receiver address
                  </span>
                  <span>
                    <Badge variant="secondary">
                      {subscription.meta.receiverAddress}
                    </Badge>
                  </span>
                </li>
                <li className="flex items-center">
                  <Icons.logo className="mr-2 h-4 w-4" /> You can cancel at any
                  time from your dashboard.
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4 text-center">
              <div>
                <h4 className="text-7xl font-bold">
                  ${subscription.meta.amount}
                </h4>
                <p className="text-sm font-medium text-muted-foreground">
                  {tokenKey.toUpperCase()} billed {subscription.meta.frequency}
                </p>
                <div className="flex items-center justify-center space-x-1 text-sm font-medium text-muted-foreground">
                  <Icons.link className="h-3 w-3" />
                  <span>
                    <>
                      {addressesByNetwork[subscriptionChainId]?.name || ""}{" "}
                      {subscription.meta.network}
                    </>
                  </span>
                </div>
                {subscription.meta?.trial !== "none" && (
                  <p className="text-sm font-medium text-muted-foreground">
                    *first {subscription.meta?.trial} is free!
                  </p>
                )}
              </div>
            </div>
          </div>

          {!hasAllowance ? (
            <Button
              variant="secondary"
              disabled={!account || loading}
              onClick={approveToken}
            >
              Approve {tokenKey.toUpperCase()}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!account || loading}
              onClick={approveSubscription}
            >
              Subscribe
            </Button>
          )}

          <p className="pb-16 px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="hover:text-brand underline underline-offset-4"
            >
              Back to blockhead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
