import {
  DAI_ADDRESS,
  SepoliaTokenContractAddress,
  USDC_ADDRESS,
  USDT_ADDRESS,
  WBTC_ADDRESS,
  WETH_ADDRESS,
  WMATIC_ADDRESS,
} from "@/constants"
import { BigNumberish } from "@ethersproject/bignumber"
import { formatUnits, parseUnits } from "@ethersproject/units"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function reformatContractFunctionResult(result: any) {
  if (result?.length) {
    return result.map((item: any) => item.toString())
  }
  return result
}

export function frequencyToSeconds(frequency: string) {
  switch (frequency) {
    case "none":
      return 0
    case "daily":
    case "day":
      return 86400
    case "weekly":
    case "week":
      return 604800
    case "monthly":
    case "month":
      return 2629800
    case "annual":
      return 31556952
  }
}

export function paymentDueSecondsToDays(seconds: number) {
  return Math.round(seconds / 86400)
}

export function getTokenName(tokenAddress: string) {
  if (tokenAddress === DAI_ADDRESS) {
    return "dai"
  }
  if (tokenAddress === USDC_ADDRESS) {
    return "usdc"
  }
  if (tokenAddress === USDT_ADDRESS) {
    return "usdt"
  }
  if (tokenAddress === WETH_ADDRESS) {
    return "weth"
  }
  if (tokenAddress === WBTC_ADDRESS) {
    return "wbtc"
  }
  if (tokenAddress === WMATIC_ADDRESS) {
    return "wmatic"
  }
  if (tokenAddress === SepoliaTokenContractAddress) {
    return "duh"
  }
  return "unknown"
}

export function getTokenAddress(tokenName: string) {
  if (tokenName === "dai") {
    return DAI_ADDRESS
  }
  if (tokenName === "usdc") {
    return USDC_ADDRESS
  }
  if (tokenName === "usdt") {
    return USDT_ADDRESS
  }
  if (tokenName === "weth") {
    return WETH_ADDRESS
  }
  if (tokenName === "wbtc") {
    return WBTC_ADDRESS
  }
  if (tokenName === "wmatic") {
    return WMATIC_ADDRESS
  }
  if (tokenName === "duh") {
    return SepoliaTokenContractAddress
  }
  return "unknown"
}

// use contract.decimals() to get decimals...
// these are for testing
export function formatAmount(amount: BigNumberish, tokenAddress: string) {
  if (tokenAddress === DAI_ADDRESS) {
    return formatUnits(amount, 18)
  }
  if (tokenAddress === USDC_ADDRESS) {
    return formatUnits(amount, 6)
  }
  if (tokenAddress === USDT_ADDRESS) {
    return formatUnits(amount, 6)
  }
  if (tokenAddress === WETH_ADDRESS) {
    return formatUnits(amount, 18)
  }
  if (tokenAddress === WBTC_ADDRESS) {
    return formatUnits(amount, 18)
  }
  if (tokenAddress === WMATIC_ADDRESS) {
    return formatUnits(amount, 18)
  }
  if (tokenAddress === SepoliaTokenContractAddress) {
    return formatUnits(amount, 18)
  }
  return amount
}

export function parseAmount(amount: BigNumberish, tokenAddress: string) {
  if (typeof amount !== "string") {
    amount = amount.toString()
  }
  if (tokenAddress === DAI_ADDRESS) {
    return parseUnits(amount, 18)
  }
  if (tokenAddress === USDC_ADDRESS) {
    return parseUnits(amount, 6)
  }
  if (tokenAddress === USDT_ADDRESS) {
    return parseUnits(amount, 6)
  }
  if (tokenAddress === WETH_ADDRESS) {
    return parseUnits(amount, 18)
  }
  if (tokenAddress === WBTC_ADDRESS) {
    return parseUnits(amount, 18)
  }
  if (tokenAddress === WMATIC_ADDRESS) {
    return parseUnits(amount, 18)
  }
  if (tokenAddress === SepoliaTokenContractAddress) {
    return parseUnits(amount, 18)
  }
  return amount
}
