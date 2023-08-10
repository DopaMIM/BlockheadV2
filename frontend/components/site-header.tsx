import {UserAccountNav} from "@/components/user-account-nav";
import {cn} from "@/lib/utils";
import type {User} from "@supabase/auth-helpers-nextjs";
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

interface SiteHeaderProps {
  user: User | null
}
export function SiteHeader({user}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
            <nav>
              {user ? (
                <UserAccountNav user={user} />
                ) : (
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "px-4"
                  )}
                >
                  Login
                </Link>
              )}
            </nav>
          </nav>
        </div>
      </div>
    </header>
  )
}
