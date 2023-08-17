import { useEffect, useState } from "react"
import { addressesByNetwork } from "@/constants"
import { useSigner } from "@usedapp/core"
import { Contract, utils } from "ethers"

import { recurringPaymentsABI } from "@/lib/recurring-payments-abi"

export function useRecurringPaymentContract(networkId: number) {
  const [contract, setContract] = useState<Contract | undefined>(undefined)
  const signer = useSigner()

  const recurringPaymentContractInterface = new utils.Interface(
    recurringPaymentsABI
  )
  useEffect(() => {
    if (!signer || !networkId) {
      setContract(undefined)
      return
    }
    setContract(
      new Contract(
        addressesByNetwork[networkId]?.recurringPayments,
        recurringPaymentContractInterface,
        signer
      )
    )
  }, [networkId, signer])

  return contract
}
