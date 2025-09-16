'use client';

import { OutgoingSubscriptions } from "./outgoing-subscriptions";
import { IncomingSubscriptions } from "./incoming-subscriptions";
import { useEthers } from "@usedapp/core";
import { useRecurringPaymentContract } from "@/lib/use-recurring-payment-contract";
import { useEffect, useRef, useState } from "react";

export const Subscriptions = () => {
  const [refresh, setRefresh] = useState(0);
  const intervalRef = useRef(null);

  // ✅ Only run interval logic in the browser (no SSR crash), and clean up safely
  useEffect(() => {
    // If an interval already exists (hot reload/dev), clear it
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Optional: enable polling if you want to auto-refresh
    // intervalRef.current = setInterval(() => {
    //   setRefresh((r) => r + 1); // functional update avoids stale closures
    // }, 15000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const { account, chainId } = useEthers();
  const recurringPaymentContract = useRecurringPaymentContract(chainId);

  return (
    <>
      <OutgoingSubscriptions
        refresh={refresh}
        chainId={chainId}
        recurringPaymentContract={recurringPaymentContract}
      />
      <IncomingSubscriptions
        refresh={refresh}
        account={account}
        chainId={chainId}
        recurringPaymentContract={recurringPaymentContract}
      />
    </>
  );
};
