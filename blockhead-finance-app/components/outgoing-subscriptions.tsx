"use client"

import React, { useEffect, useState } from "react"
import { addressesByNetwork } from "@/constants"
import { BigNumberish } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEthers } from "@usedapp/core"
import _ from "lodash"

import { useRecurringPaymentContract } from "@/lib/use-recurring-payment-contract"
import { paymentDueSecondsToDays } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const supabase = createClientComponentClient()

function useRecurringPayments() {
  const { chainId, account } = useEthers()
  const [loaded, setLoaded] = useState<boolean>(false)
  const [recurringPayments, setRecurringPayments] = useState<
    Record<string, any>
  >({})

  let recurringPaymentContract = useRecurringPaymentContract(chainId || 0)

  useEffect(() => {
    async function inner() {
      try {
        if (loaded || !recurringPaymentContract) {
          return
        }
        setLoaded(true)
        setRecurringPayments({})
        const currentBlockTimestamp =
          await recurringPaymentContract.getCurrentBlockTimestamp()
        // find all payments for each subscription - get all payments for this user's address
        const accountNumbers =
          await recurringPaymentContract.getAccountNumbersByAddress(account)
        for (const accountNumber of accountNumbers) {
          const [recurringPayment, additionalInformation] = await Promise.all([
            recurringPaymentContract.recurringPayments(accountNumber),
            recurringPaymentContract.getAdditionalInformation(accountNumber),
          ])
          if (recurringPayment[1] !== account) {
            continue
          }
          const paymentDue = recurringPayment[7].sub(currentBlockTimestamp)
          const subscriptionId =
            additionalInformation[0].split("subscriptionId:")[1]
          const { data: subscription, error } = await supabase
            .from("subscription")
            .select("*")
            .eq("id", subscriptionId)
            .maybeSingle()
          if (error) {
            throw error
          }
          const recurringPaymentArr = [...recurringPayment, subscription]
          recurringPaymentArr[7] = paymentDue
          recurringPayments[accountNumber.toString()] = recurringPaymentArr
        }
        setRecurringPayments(recurringPayments)
      } catch (e) {
        console.error(e)
      }
    }
    if (chainId) {
      inner()
    }
  }, [chainId])

  // for (const subscription of data) {
  //   subscription.payments = payments
  // }

  return recurringPayments
}

export const OutgoingSubscriptions = () => {
  const { chainId } = useEthers()
  const recurringPayments = useRecurringPayments()
  const recurringPaymentContract = useRecurringPaymentContract(chainId || 0)

  async function cancelRecurringPayment(accountNumber: BigNumberish) {
    if (!recurringPaymentContract) {
      return
    }
    if (window.confirm("Are you sure you want to cancel this subscription?")) {
      const gasLimit =
        await recurringPaymentContract.estimateGas.cancelRecurringPayment(
          accountNumber
        )
      const ret = await recurringPaymentContract.cancelRecurringPayment(
        accountNumber,
        { gasLimit }
      )
      console.log(ret)
    }
  }

  return (
    <div className="m-8 ">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center justify-between grow">
          <h1 className="font-heading text-3xl md:text-4xl">
            Outgoing Subscriptions
          </h1>
        </div>
        {/*<p className="text-lg text-muted-foreground">Manage account and website settings.</p>*/}
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
              accountNumber,
              sender,
              recipientAddress,
              amount,
              token,
              timeIntervalSeconds,
              paymentInterface,
              paymentDue,
              cancelled,
              subscription,
            ]) => {
              return (
                <div
                  key={accountNumber.toString()}
                  className="grid grid-cols-8 gap-2"
                >
                  <div className="">
                    {/*<div className="">{id}</div>*/}
                    <div className="">{subscription?.meta?.recipientName}</div>
                    <div className="truncate">{recipientAddress}</div>
                  </div>
                  <div>{subscription?.meta?.productName}</div>
                  <div>
                    {addressesByNetwork[subscription?.meta?.network]?.name ||
                      ""}
                  </div>
                  <div className="truncate">{token.toUpperCase()}</div>
                  <div className="truncate">
                    <>
                      {/* use contract.decimals() to get decimals...*/}
                      {formatUnits(amount, 6)}{" "}
                      {(
                        addressesByNetwork[chainId || 0]?.[token] || ""
                      ).toUpperCase()}
                    </>
                  </div>
                  <div>{paymentDueSecondsToDays(paymentDue)} days</div>
                  <div>{!cancelled ? "Yes" : "No"}</div>
                  <div>
                    {!cancelled && (
                      <Button
                        size="sm"
                        onClick={() => cancelRecurringPayment(accountNumber)}
                      >
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
