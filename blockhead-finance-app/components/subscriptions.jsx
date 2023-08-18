"use client"

import {OutgoingSubscriptions} from "./outgoing-subscriptions";
import {IncomingSubscriptions} from "./incoming-subscriptions";
import {useEthers} from "@usedapp/core";
import {useRecurringPaymentContract} from "@/lib/use-recurring-payment-contract";
import {useState} from "react";

export const Subscriptions = () => {
  const [refresh, setRefresh] = useState(0)
  if (window.blockheadRefreshInterval) {
    clearInterval(window.blockheadRefreshInterval)
  }
  //window.blockheadRefreshInterval = setInterval(() => setRefresh(refresh + 1), 15000)
  const {account, chainId} = useEthers();
  const recurringPaymentContract = useRecurringPaymentContract(chainId)
  return (
    <>
      <OutgoingSubscriptions refresh={refresh} chainId={chainId} recurringPaymentContract={recurringPaymentContract} />
      <IncomingSubscriptions refresh={refresh} account={account} chainId={chainId} recurringPaymentContract={recurringPaymentContract} />
    </>
  )
}