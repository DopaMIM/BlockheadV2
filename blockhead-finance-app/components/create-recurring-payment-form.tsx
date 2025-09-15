"use client"

import { useState } from "react"
import Link from "next/link"
import { UI_PARTNER_ADDRESS, addressesByNetwork, tokenDecimalsByNetwork } from "@/constants"
import { parseUnits, formatUnits } from "@ethersproject/units" // NEW: formatUnits
import {
  ERC20Interface,
  useEthers,
  useSigner,
  useTokenAllowance,
  useTokenBalance,       // NEW
  useEtherBalance,       // NEW (for a gentle gas warning)
} from "@usedapp/core"
import { BigNumber, Contract, utils as v5 } from "ethers"

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
  const tokenKey = (subscription.meta.token || "").toLowerCase()

  // Auto-switch to required chain if needed
  if (subscriptionChainId !== chainId || error?.name === "ChainIdError") {
    switchNetwork(subscriptionChainId)
  }

  // Prefer values saved at creation; fall back to constants
  // @ts-expect-error meta may include these optional fields
  const savedAddr: string | undefined = subscription.meta?.tokenAddress
  const tokenAddress =
    savedAddr ??
    addressesByNetwork[subscriptionChainId]?.[tokenKey] ??
    ""

  // Validate token address early
  const isTokenAddrValid = v5.isAddress(tokenAddress)

  const spender =
    addressesByNetwork[subscriptionChainId]?.recurringPayments ?? ""

  const isSpenderValid = v5.isAddress(spender)

  // Prefer saved decimals; fall back to constants; default 6 for USDC else 18
  // @ts-expect-error meta may include these optional fields
  const savedDec: number | undefined = subscription.meta?.tokenDecimals
  const tokenDecimals =
    savedDec ??
    tokenDecimalsByNetwork[subscriptionChainId]?.[tokenKey] ??
    (tokenKey === "usdc" ? 6 : 18)

  const amountInWei = parseUnits(subscription.meta.amount.toString(), tokenDecimals)

  // Recurring payments contract for this chain
  const recurringPaymentContract = useRecurringPaymentContract(subscriptionChainId)

  // Only construct contract if everything is valid and signer exists
  const subscriptionToken =
    signer && isTokenAddrValid
      ? new Contract(tokenAddress, ERC20Interface, signer)
      : null

  // Allowance for EXACT spender we use for approve/subscribe
  const allowance = useTokenAllowance(
    isTokenAddrValid ? tokenAddress : undefined,
    account,
    isSpenderValid ? spender : undefined
  )

  // --- NEW: balances ---
  // User's ERC-20 balance for the chosen token (on the required chain)
  const tokenBalance = useTokenBalance(
    isTokenAddrValid ? tokenAddress : undefined,
    account
  )

  // Optional: native gas balance (ETH on the target L2) for a friendly warning
  const nativeBalance = useEtherBalance(account)

  // Require allowance >= amount needed
  const hasAllowance =
    BigNumber.isBigNumber(allowance) && allowance.gte(amountInWei)

  // NEW: must have at least the first payment amount available
  const hasFunds =
    BigNumber.isBigNumber(tokenBalance) && tokenBalance.gte(amountInWei)

  // NEW: nicely formatted numbers for the UI
  const amountHuman = formatUnits(amountInWei, tokenDecimals)
  const balanceHuman = tokenBalance ? formatUnits(tokenBalance, tokenDecimals) : "0"

  // NEW: soft gas warning threshold (you can tune this)
  const lowGasThreshold = parseUnits("0.0001", 18)
  const showLowGasWarning =
    nativeBalance && BigNumber.isBigNumber(nativeBalance) && nativeBalance.lt(lowGasThreshold)

  async function approveToken() {
    setLoading(true)
    try {
      if (!subscriptionToken || !isSpenderValid) {
        throw new Error("Token or spender not configured for this chain.")
      }

      // generous allowance but correct decimals
      const tx = await subscriptionToken.approve(
        spender,
        parseUnits("10000000", tokenDecimals)
      )
      await tx.wait() // wait so useTokenAllowance picks up the new allowance

      toast({
        title: "Approval submitted",
        description: `Approved ${tokenKey.toUpperCase()} for recurring payments.`,
      })
    } catch (e: any) {
      console.error(e)
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
      if (!recurringPaymentContract || !subscriptionToken || !isTokenAddrValid || !isSpenderValid) {
        throw new Error("Missing contract, token, or address configuration.")
      }

      // NEW: refuse early if insufficient funds (extra safety; UI already disables)
      if (!hasFunds) {
        throw new Error(`Insufficient ${tokenKey.toUpperCase()} for first payment.`)
      }

      const functionArgs = [
        subscription.meta.receiverAddress,
        amountInWei,
        tokenAddress,
        frequencyToSeconds(subscription.meta.frequency),
        UI_PARTNER_ADDRESS,
        [`subscriptionId:${subscription.id}`],
        frequencyToSeconds(subscription.meta.trial),
      ]

      const gasLimit =
        await recurringPaymentContract.estimateGas.createRecurringPayment(
          ...functionArgs
        )

      const tx = await recurringPaymentContract.createRecurringPayment(
        ...functionArgs,
        { gasLimit }
      )
      await tx.wait()

      toast({
        title: "Success!",
        description: "You created a recurring payment.",
      })
    } catch (e: any) {
      console.error(e)
      toast({
        title: "Transaction failed",
        description: e?.message ?? "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Friendly guard rails for misconfiguration
  if (!isTokenAddrValid || !isSpenderValid) {
    return (
      <div className="container flex h-screen w-screen items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-500 font-medium">Payment configuration missing for this chain/token.</p>
          <p className="text-sm text-muted-foreground">
            Chain: {subscriptionChainId} — Token: {tokenKey.toUpperCase()}
          </p>
        </div>
      </div>
    )
  }

  // NEW: decide button label/disabled state
  const approveDisabled = !account || loading || !subscriptionToken
  const subscribeDisabled = !account || loading || !recurringPaymentContract || !hasFunds

  const subscribeLabel = !hasFunds
    ? "Insufficient funds"
    : (loading ? "Submitting..." : "Subscribe")

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

            {/* NEW: balance check + messages */}
            <div className="rounded-md bg-gray-50 p-4 text-left">
              <p className="text-sm">
                Required first payment: <span className="font-medium">{amountHuman} {tokenKey.toUpperCase()}</span>
              </p>
              <p className="text-sm">
                Your balance: <span className="font-medium">{balanceHuman} {tokenKey.toUpperCase()}</span>
              </p>
              {!hasFunds && (
                <p className="mt-2 text-sm text-red-600">
                  You don’t have enough {tokenKey.toUpperCase()} to cover the first payment.
                </p>
              )}
              {showLowGasWarning && (
                <p className="mt-2 text-xs text-amber-600">
                  Heads up: your gas balance looks low. You’ll need a small amount of ETH on this network to submit transactions.
                </p>
              )}
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
              disabled={approveDisabled}
              onClick={approveToken}
            >
              {loading ? "Approving..." : `Approve ${tokenKey.toUpperCase()}`}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={subscribeDisabled}
              onClick={approveSubscription}
            >
              {subscribeLabel}
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
