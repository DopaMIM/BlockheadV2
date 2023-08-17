import * as z from "zod"

export const subscriptionSchema = z.object({
  logoUrl: z.string().url().optional().or(z.string().optional()),
  recipientName: z.string().min(3).max(100),
  productName: z.string().max(100).optional(),
  receiverAddress: z.string().length(42).startsWith("0x"),
  network: z.string().min(1).max(10),
  amount: z.coerce.number().min(0.01),
  token: z.enum(["usdc"]),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  trial: z.enum(["none", "day", "week", "biweek", "month"]),
})

export interface Subscription {
  id: string
  meta: {
    logoUrl?: string
    recipientName: string
    productName: string
    receiverAddress: string
    network: string
    amount: number
    token: string
    frequency: string
    trial: string
  }
}
