"use client"

import {Contract} from "ethers";
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { addressesByNetwork } from "@/constants"
import { BigNumberish } from "@ethersproject/bignumber"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEthers } from "@usedapp/core"
import _ from "lodash"

import { useRecurringPaymentContract } from "@/lib/use-recurring-payment-contract"
import { cn, paymentDueSecondsToDays } from "@/lib/utils"
import type { Subscription } from "@/lib/validations/subscription"
import { Button, buttonVariants } from "@/components/ui/button"

const supabase = createClientComponentClient()

function useSubscriptionsPayments(refresh: number, subscriptions: any[], account: string, chainId: number, recurringPaymentContract?: Contract) {
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
        if (!recurringPaymentContract || loaded === chainId) {
          return
        }
        console.log('incoming payments loading...')
        setLoaded(chainId)
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

  // for (const subscription of data) {
  //   subscription.payments = payments
  // }

  return recurringPayments
}

function useSubscriptions(chainId: number) {
  const [loading, setLoading] = useState<number>(-1)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    async function inner() {
      try {
        if (loading === chainId) {
          return
        }
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setLoading(chainId)
        const { data, error } = await supabase
          .from("subscription")
          .select("*")
          .eq("user_id", user?.id)
        if (error) {
          throw error
        }
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
export const IncomingSubscriptions = ({refresh, account, chainId, recurringPaymentContract}: IIncomingSubscriptions) => {
  const subscriptions = useSubscriptions(chainId)
  const recurringPayments = useSubscriptionsPayments(refresh, subscriptions, account, chainId, recurringPaymentContract)

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

  async function deleteSubscription(subscription: Subscription) {
    if (_.keys(recurringPayments[subscription.id]).length > 0) {
      return
    }
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      const { error } = await supabase
        .from("subscription")
        .delete()
        .eq("id", subscription.id)
      if (error) {
        console.error(error)
      }
      window.location.reload()
    }
  }

  return (
    <div className="m-8 ">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center justify-between grow">
          <h1 className="font-heading text-3xl md:text-4xl">
            Incoming Subscriptions
          </h1>
          <Link
            href="/create"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Create a subscription
          </Link>
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
              <span className="font-medium">frequency</span>
            </div>
            <div>
              <span className="font-medium">trial</span>
            </div>
            <div></div>
          </div>
          {subscriptions.map(
            ({
              id,
              meta: {
                logoUrl,
                recipientName,
                productName,
                receiverAddress,
                network,
                amount,
                token,
                frequency,
                trial,
              },
            }: Subscription) => {
              const tokenAddress =
                addressesByNetwork[parseInt(network)]?.[token]
              return (
                <div key={id} className="grid grid-cols-8 gap-2">
                  <div className="">
                    {/*<div className="">{id}</div>*/}
                    <div className="">{recipientName}</div>
                    <div className="truncate">{receiverAddress}</div>
                  </div>
                  <div>{productName}</div>
                  <div>{addressesByNetwork[parseInt(network)]?.name || ""}</div>
                  <div className="truncate">{tokenAddress}</div>
                  <div className="truncate">
                    {amount} {token.toUpperCase()}
                  </div>
                  <div>{frequency}</div>
                  <div>{trial}</div>
                  <div className="flex justify-between space-x-1">
                    <Link
                      href={`/pay/${id}`}
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "",
                        })
                      )}
                    >
                      Preview
                    </Link>
                    {!_.keys(recurringPayments[id]).length && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          deleteSubscription({ id } as Subscription)
                        }
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  {_.keys(recurringPayments[id]).length > 0 && (
                    <div className="col-span-8 mb-6 mx-4 -mt-1">
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <span className="font-medium">sender</span>
                        </div>
                        <div>
                          <span className="font-medium">next payment due</span>
                        </div>
                        <div>
                          <span className="font-medium">Active ?</span>
                        </div>
                        <div></div>
                      </div>
                      {_.values(recurringPayments[id]).map((payment: any) => (
                        <div
                          key={payment[0].toString()}
                          className="bg-gray-100 rounded-md grid grid-cols-4 gap-2 p-2"
                        >
                          <div className="truncate">{payment[1]}</div>
                          <div className="">
                            {paymentDueSecondsToDays(payment[7])} days
                          </div>
                          <div className="">{!payment[8] ? "Yes" : "No"}</div>
                          <div>
                            {!payment[8] && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  cancelRecurringPayment(payment[0])
                                }
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}
