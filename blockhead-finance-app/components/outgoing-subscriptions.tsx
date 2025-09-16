"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { addressesByNetwork, tokenDecimalsByNetwork } from "@/constants"
import { BigNumberish } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEthers } from "@usedapp/core"
import { Contract } from "ethers"
import _ from "lodash"

import { cn, paymentDueSecondsToDays } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ChainSwitcher from "@/components/chain-switcher"

const supabase = createClientComponentClient()

function useRecurringPayments(
  refresh: number,
  chainId: number,
  recurringPaymentContract?: Contract
) {
  const [loaded, setLoaded] = useState<number>(-1)
  const [recurringPayments, setRecurringPayments] = useState<
    Record<string, any>
  >({})
  const { account } = useEthers()

  useEffect(() => setLoaded(-1), [refresh])

  useEffect(() => {
    async function inner() {
      try {
        if (loaded === chainId || !recurringPaymentContract) return
        console.log("outgoing payments loading…")
        setLoaded(chainId)
        const next: Record<string, any> = {}
        const currentBlockTimestamp =
          await recurringPaymentContract.getCurrentBlockTimestamp()
        const accountNumbers =
          await recurringPaymentContract.getAccountNumbersByAddress(account)
        for (const accountNumber of accountNumbers) {
          const [recurringPayment, additionalInformation] = await Promise.all([
            recurringPaymentContract.recurringPayments(accountNumber),
            recurringPaymentContract.getAdditionalInformation(accountNumber),
          ])
          if (recurringPayment[1] !== account) continue
          const paymentDue = recurringPayment[7].sub(currentBlockTimestamp)
          const subscriptionId =
            additionalInformation[0].split("subscriptionId:")[1]
          const { data: subscription, error } = await supabase
            .from("subscription")
            .select("*")
            .eq("id", subscriptionId)
            .maybeSingle()
          if (error) throw error
          const row = [...recurringPayment, subscription]
          row[7] = paymentDue
          next[accountNumber.toString()] = row
        }
        setRecurringPayments(next)
      } catch (e) {
        console.error(e)
      }
    }
    inner()
  }, [loaded, recurringPaymentContract, chainId, supabase])

  return recurringPayments
}

interface IOutgoingSubscriptions {
  refresh: number
  chainId: number
  recurringPaymentContract?: Contract
}

export const OutgoingSubscriptions = ({
  refresh,
  chainId = 0,
  recurringPaymentContract,
}: IOutgoingSubscriptions) => {
  const recurringPayments = useRecurringPayments(
    refresh,
    chainId,
    recurringPaymentContract
  )

  async function cancelRecurringPayment(accountNumber: BigNumberish) {
    if (!recurringPaymentContract) return
    if (window.confirm("Are you sure you want to cancel this subscription?")) {
      const gasLimit =
        await recurringPaymentContract.estimateGas.cancelRecurringPayment(
          accountNumber
        )
      const ret = await recurringPaymentContract.cancelRecurringPayment(
        accountNumber,
        {
          gasLimit,
        }
      )
      console.log(ret)
    }
  }

  return (
    <div className="m-4 space-y-6">
      <p></p>
      <p></p>
      {/* Header with centered title + button; ChainSwitcher aligned to the right on md+ */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="font-heading text-3xl md:text-4xl text-center">
          <Link
            href="/create"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Create Subscription Plan
          </Link>
          <p></p>
          <p></p>
          {/* Chain switcher sits under the title on mobile; on desktop you can float it right if you prefer */}
          <ChainSwitcher className="mt-2" />
          <p></p>
          <p></p>
          Outgoing Subscriptions
        </h1>
      </div>

      {_.values(recurringPayments).map(
        ([
          accountNumber,
          sender,
          recipientAddress,
          amount,
          tokenAddressOnChain,
          timeIntervalSeconds,
          paymentInterface,
          paymentDue,
          cancelled,
          subscription,
        ]) => {
          const chainIdForSub =
            Number(subscription?.meta?.network) || chainId || 0
          const tokenKey = String(subscription?.meta?.token || "").toLowerCase()
          const tokenAddress =
            tokenAddressOnChain ||
            addressesByNetwork[chainIdForSub]?.[tokenKey] ||
            ""
          const decimals =
            tokenDecimalsByNetwork[chainIdForSub]?.[tokenKey] ??
            (["usdc", "usdt", "usdc_e"].includes(tokenKey) ? 6 : 18)
          const humanAmount = formatUnits(amount, decimals)
          const symbol = (subscription?.meta?.token || "").toUpperCase()

          return (
            <Card key={accountNumber.toString()}>
              <CardHeader>
                <CardTitle>{subscription?.meta?.productName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Recipient:</strong>{" "}
                  {subscription?.meta?.recipientName} ({recipientAddress})
                </p>
                <p>
                  <strong>Network:</strong>{" "}
                  {addressesByNetwork[chainIdForSub]?.name || ""}
                </p>
                <p>
                  <strong>Token:</strong> {tokenAddress}
                </p>
                <p>
                  <strong>Amount:</strong> {humanAmount} {symbol}
                </p>
                <p>
                  <strong>Next payment:</strong>{" "}
                  {paymentDueSecondsToDays(paymentDue)} days
                </p>
                <p>
                  <strong>Active?</strong> {!cancelled ? "Yes" : "No"}
                </p>
                {!cancelled && (
                  <Button
                    size="sm"
                    onClick={() => cancelRecurringPayment(accountNumber)}
                  >
                    Cancel
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        }
      )}
    </div>
  )
}
