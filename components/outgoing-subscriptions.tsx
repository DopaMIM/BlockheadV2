"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { RECURRING_PAYMENT_CONTRACT } from "@/constants"
import { BigNumberish } from "@ethersproject/bignumber"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEthers, useSigner } from "@usedapp/core"
import { BigNumber, Contract, utils } from "ethers"
import _ from "lodash"

import { recurringPaymentsABI } from "@/lib/recurring-payments-abi"
import { useRecurringPaymentContract } from "@/lib/use-recurring-payment-contract"
import {
  cn,
  formatAmount,
  getTokenAddress,
  getTokenName,
  paymentDueSecondsToDays,
} from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

const supabase = createClientComponentClient()

function useRecurringPayments() {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [recurringPayments, setRecurringPayments] = useState<
    Record<string, any>
  >({})

  const { account } = useEthers()
  const signer = useSigner()

  let recurringPaymentContractInterface
  let recurringPaymentContract: Contract | undefined = undefined
  if (account && signer) {
    recurringPaymentContractInterface = new utils.Interface(
      recurringPaymentsABI
    )
    recurringPaymentContract = new Contract(
      RECURRING_PAYMENT_CONTRACT,
      recurringPaymentContractInterface,
      signer
    )
  }

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
            .single()
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
    inner()
  }, [recurringPaymentContract])

  // for (const subscription of data) {
  //   subscription.payments = payments
  // }

  return recurringPayments
}

export const OutgoingSubscriptions = () => {
  const recurringPayments = useRecurringPayments()
  const recurringPaymentContract = useRecurringPaymentContract()

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
              //const amountFormatted = BigNumber.from(amount)
              //const amountToken = formatAmount(amount, token)

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
                  <div>{subscription?.meta?.network}</div>
                  <div className="truncate">{token.toUpperCase()}</div>
                  <div className="truncate">
                    <>
                      {formatAmount(amount, token)}{" "}
                      {getTokenName(token).toUpperCase()}
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
