import {SiteHeader} from "@/components/site-header";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

interface LayoutProps {
  children: React.ReactNode
}
export default async function LoggedInLayout({children}: LayoutProps) {
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
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}