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
