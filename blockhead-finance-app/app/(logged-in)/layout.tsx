import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { SiteHeader } from "@/components/site-header"

export const dynamic = "force-dynamic"

interface LayoutProps {
  children: React.ReactNode
}
export default async function LoggedInLayout({ children }: LayoutProps) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <div className="flex-1 my-16">{children}</div>
    </div>
  )
}
