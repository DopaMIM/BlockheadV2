import { useEffect, useState } from "react"
import { RECURRING_PAYMENT_CONTRACT } from "@/constants"
import { useSigner } from "@usedapp/core"
import { Contract, utils } from "ethers"

import { recurringPaymentsABI } from "@/lib/recurring-payments-abi"

export function useRecurringPaymentContract() {
  const [contract, setContract] = useState<Contract | undefined>(undefined)
  const signer = useSigner()

  const recurringPaymentContractInterface = new utils.Interface(
    recurringPaymentsABI
  )
  useEffect(() => {
    if (!signer) {
      return
    }
    setContract(
      new Contract(
        RECURRING_PAYMENT_CONTRACT,
        recurringPaymentContractInterface,
        signer
      )
    )
  }, [signer])

  return contract
}
