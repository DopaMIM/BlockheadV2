"use client"

import { Contract } from "ethers"
import React, { useEffect, useState } from "react"
import { addressesByNetwork, tokenDecimalsByNetwork } from "@/constants"
import { BigNumberish } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEthers } from "@usedapp/core"
import _ from "lodash"

import { paymentDueSecondsToDays } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const supabase = createClientComponentClient()

function useRecurringPayments(
  refresh: number,
  chainId: number,
  recurringPaymentContract?: Contract
) {
  const [loaded, setLoaded] = useState<number>(-1)
  const [recurringPayments, setRecurringPayments] = useState<Record<string, any>>({})
  const { account } = useEthers()

  useEffect(() => {
    setLoaded(-1)
  }, [refresh])

  useEffect(() => {
    async function inner() {
      try {
        if (loaded === chainId || !recurringPaymentContract) return

        console.log("outgoing payments loading…")
        setLoaded(chainId)
        const next: Record<string, any> = {}

        const currentBlockTimestamp = await recurringPaymentContract.getCurrentBlockTimestamp()
        const accountNumbers = await recurringPaymentContract.getAccountNumbersByAddress(account)

        for (const accountNumber of accountNumbers) {
          const [recurringPayment, additionalInformation] = await Promise.all([
            recurringPaymentContract.recurringPayments(accountNumber),
            recurringPaymentContract.getAdditionalInformation(accountNumber),
          ])

          // Only show rows where *you* are the sender
          if (recurringPayment[1] !== account) continue

          const paymentDue = recurringPayment[7].sub(currentBlockTimestamp)
          const subscriptionId = additionalInformation[0].split("subscriptionId:")[1]

          const { data: subscription, error } = await supabase
            .from("subscription")
            .select("*")
            .eq("id", subscriptionId)
            .maybeSingle()

          if (error) throw error

          const row = [...recurringPayment, subscription]
          row[7] = paymentDue // replace nextDue with delta seconds
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
  const recurringPayments = useRecurringPayments(refresh, chainId, recurringPaymentContract)

  async function cancelRecurringPayment(accountNumber: BigNumberish) {
    if (!recurringPaymentContract) return
    if (window.confirm("Are you sure you want to cancel this subscription?")) {
      const gasLimit = await recurringPaymentContract.estimateGas.cancelRecurringPayment(accountNumber)
      const ret = await recurringPaymentContract.cancelRecurringPayment(accountNumber, { gasLimit })
      console.log(ret)
    }
  }

  return (
    <div className="m-8 ">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center justify-between grow">
          <h1 className="font-heading text-3xl md:text-4xl">Outgoing Subscriptions</h1>
        </div>
      </div>

      <div className="mt-4 p-4 border border-gray-200 rounded-lg">
        <div>
          <div className="grid grid-cols-8 gap-2">
            <div>
              <span className="font-medium">recipient</span>
            </div>
            <div>
              <span className="font-medium">product name</span>
            </div>
            <div>
              <span className="font-medium">network</span>
            </div>
            <div>
              <span className="font-medium">token</span>
            </div>
            <div>
              <span className="font-medium">amount</span>
            </div>
            <div>
              <span className="font-medium">next payment</span>
            </div>
            <div>
              <span className="font-medium">Active ?</span>
            </div>
            <div></div>
          </div>

          {_.values(recurringPayments).map(
            ([
              accountNumber,        // 0
              sender,               // 1
              recipientAddress,     // 2
              amount,               // 3 (BigNumber, in token decimals)
              tokenAddressOnChain,  // 4 (address)
              timeIntervalSeconds,  // 5
              paymentInterface,     // 6
              paymentDue,           // 7 (delta seconds we set)
              cancelled,            // 8 (bool)
              subscription,         // 9 (record from Supabase)
            ]) => {
              // Pull display metadata from the subscription meta
              const chainIdForSub = Number(subscription?.meta?.network) || chainId || 0
              const tokenKey = String(subscription?.meta?.token || "").toLowerCase()

              // Token address column (same as incoming)
              const tokenAddress =
                tokenAddressOnChain ||
                addressesByNetwork[chainIdForSub]?.[tokenKey] ||
                ""

              // Human amount + symbol column
              const decimals =
                tokenDecimalsByNetwork[chainIdForSub]?.[tokenKey] ??
                (tokenKey === "usdc" ? 6 : 18)

              const humanAmount = formatUnits(amount, decimals)
              const symbol = (subscription?.meta?.token || "").toUpperCase()

              return (
                <div key={accountNumber.toString()} className="grid grid-cols-8 gap-2">
                  <div>
                    <div className="">{subscription?.meta?.recipientName}</div>
                    <div className="truncate">{recipientAddress}</div>
                  </div>

                  <div>{subscription?.meta?.productName}</div>

                  <div>{addressesByNetwork[chainIdForSub]?.name || ""}</div>

                  {/* TOKEN column: contract address (hex) */}
                  <div className="truncate">{tokenAddress}</div>

                  {/* AMOUNT column: human-readable + symbol */}
                  <div className="truncate">
                    {humanAmount} {symbol}
                  </div>

                  <div>{paymentDueSecondsToDays(paymentDue)} days</div>

                  <div>{!cancelled ? "Yes" : "No"}</div>

                  <div>
                    {!cancelled && (
                      <Button size="sm" onClick={() => cancelRecurringPayment(accountNumber)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}
