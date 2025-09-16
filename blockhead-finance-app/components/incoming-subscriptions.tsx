"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { addressesByNetwork } from "@/constants"
import { BigNumberish } from "@ethersproject/bignumber"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEthers } from "@usedapp/core"
import { Contract } from "ethers"
import _ from "lodash"

import { useRecurringPaymentContract } from "@/lib/use-recurring-payment-contract"
import { cn, paymentDueSecondsToDays } from "@/lib/utils"
import type { Subscription } from "@/lib/validations/subscription"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const supabase = createClientComponentClient()

function useSubscriptionsPayments(
  refresh: number,
  subscriptions: any[],
  account: string,
  chainId: number,
  recurringPaymentContract?: Contract
) {
  const [loaded, setLoaded] = useState<number>(-1)
  const [recurringPayments, setRecurringPayments] = useState<
    Record<string, any>
  >({})

  useEffect(() => {
    setLoaded(-1)
  }, [refresh])

  useEffect(() => {
    async function inner() {
      try {
        if (!recurringPaymentContract || loaded === chainId) return
        console.log("incoming payments loading…")
        setLoaded(chainId)
        setRecurringPayments({})
        const currentBlockTimestamp =
          await recurringPaymentContract.getCurrentBlockTimestamp()
        const accountNumbers =
          await recurringPaymentContract.getAccountNumbersByAddress(account)
        for (const accountNumber of accountNumbers) {
          const [recurringPayment, additionalInformation] = await Promise.all([
            recurringPaymentContract.recurringPayments(accountNumber),
            recurringPaymentContract.getAdditionalInformation(accountNumber),
          ])
          const subscriptionId =
            additionalInformation[0].split("subscriptionId:")[1]
          if (!recurringPayments[subscriptionId]) {
            recurringPayments[subscriptionId] = {}
          }
          const paymentDue = recurringPayment[7].sub(currentBlockTimestamp)
          const recurringPaymentArr = [...recurringPayment]
          recurringPaymentArr[7] = paymentDue
          recurringPayments[subscriptionId][accountNumber.toString()] =
            recurringPaymentArr
        }
        setRecurringPayments(recurringPayments)
      } catch (e) {
        console.error(e)
      }
    }
    inner()
  }, [loaded, recurringPaymentContract, subscriptions])

  return recurringPayments
}

function useSubscriptions(chainId: number) {
  const [loading, setLoading] = useState<number>(-1)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    async function inner() {
      try {
        if (loading === chainId) return
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setLoading(chainId)
        const { data, error } = await supabase
          .from("subscription")
          .select("*")
          .eq("user_id", user?.id)
        if (error) throw error
        if (Array.isArray(data)) {
          const filtered = data.filter((s) => s.meta.network == chainId)
          setData(filtered)
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (chainId) {
      inner()
    }
  }, [chainId])

  return data
}

interface IIncomingSubscriptions {
  refresh: number
  account: string
  chainId: number
  recurringPaymentContract?: Contract
}

export const IncomingSubscriptions = ({
  refresh,
  account,
  chainId,
  recurringPaymentContract,
}: IIncomingSubscriptions) => {
  const subscriptions = useSubscriptions(chainId)
  const recurringPayments = useSubscriptionsPayments(
    refresh,
    subscriptions,
    account,
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

  async function deleteSubscription(subscription: Subscription) {
    if (_.keys(recurringPayments[subscription.id]).length > 0) return
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      const { error } = await supabase
        .from("subscription")
        .delete()
        .eq("id", subscription.id)
      if (error) console.error(error)
      window.location.reload()
    }
  }

  return (
    <div className="m-4 space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="font-heading text-3xl md:text-4xl text-center">
          Incoming Subscriptions
        </h1>
      </div>

      {subscriptions.map((sub: Subscription) => {
        const tokenAddress =
          addressesByNetwork[parseInt(sub.meta.network)]?.[sub.meta.token]
        return (
          <Card key={sub.id}>
            <CardHeader>
              <CardTitle>{sub.meta.productName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Recipient:</strong> {sub.meta.recipientName} (
                {sub.meta.receiverAddress})
              </p>
              <p>
                <strong>Network:</strong>{" "}
                {addressesByNetwork[parseInt(sub.meta.network)]?.name || ""}
              </p>
              <p>
                <strong>Token:</strong> {tokenAddress}
              </p>
              <p>
                <strong>Amount:</strong> {sub.meta.amount}{" "}
                {sub.meta.token.toUpperCase()}
              </p>
              <p>
                <strong>Frequency:</strong> {sub.meta.frequency}
              </p>
              <p>
                <strong>Trial:</strong> {sub.meta.trial}
              </p>
              <div className="flex space-x-2 pt-2">
                <Link
                  href={`/pay/${sub.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  Preview
                </Link>
                {!_.keys(recurringPayments[sub.id]).length && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSubscription(sub)}
                  >
                    Delete
                  </Button>
                )}
              </div>

              {_.keys(recurringPayments[sub.id]).length > 0 && (
                <div className="mt-4 space-y-2">
                  {_.values(recurringPayments[sub.id]).map((payment: any) => (
                    <Card key={payment[0].toString()}>
                      <CardContent className="flex flex-col space-y-1 text-sm p-2">
                        <p>
                          <strong>Sender:</strong> {payment[1]}
                        </p>
                        <p>
                          <strong>Next payment due:</strong>{" "}
                          {paymentDueSecondsToDays(payment[7])} days
                        </p>
                        <p>
                          <strong>Active?</strong> {!payment[8] ? "Yes" : "No"}
                        </p>
                        {!payment[8] && (
                          <Button
                            size="sm"
                            onClick={() => cancelRecurringPayment(payment[0])}
                          >
                            Cancel
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
