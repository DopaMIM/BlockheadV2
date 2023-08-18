import { useEffect, useState } from "react"
import { addressesByNetwork } from "@/constants"
import {useEthers, useSigner} from "@usedapp/core"
import { Contract, utils } from "ethers"

import { recurringPaymentsABI } from "@/lib/recurring-payments-abi"

export function useRecurringPaymentContract(networkId: number) {
  const [contract, setContract] = useState<Contract | undefined>(undefined)
  const { chainId } = useEthers()
  const signer = useSigner()

  const recurringPaymentContractInterface = new utils.Interface(
    recurringPaymentsABI
  )
  useEffect(() => {
    if (!signer || !networkId) {
      return
    }
    const contract = new Contract(
      addressesByNetwork[networkId]?.recurringPayments,
      recurringPaymentContractInterface,
      signer
    )
    console.log("contract", contract)
    setContract(contract)
  }, [networkId, signer, chainId])

  return contract
}
