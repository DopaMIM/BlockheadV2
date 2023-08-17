import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import CreateRecurringPaymentForm from "@/components/create-recurring-payment-form"

export const dynamic = "force-dynamic"

interface IPayPage {
  params: {
    id: string //GUID of subscription or "recurring payment template"
  }
}
export default async function PayPage({ params }: IPayPage) {
  const supabase = createServerComponentClient({ cookies })

  const { data: subscription } = await supabase
    .from("subscription")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!subscription) {
    notFound()
    return
  }

  return <CreateRecurringPaymentForm subscription={subscription} />
}
