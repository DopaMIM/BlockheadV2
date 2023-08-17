"use client"
import {MetaMaskConnectButton} from "@/components/metamask-connect-button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {UserAvatar} from "@/components/user-avatar"
import {createClientComponentClient, User} from "@supabase/auth-helpers-nextjs";
import Link from "next/link"
import {useRouter} from "next/navigation";
import React from "react";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const router = useRouter()
  
  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={user}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {/*{user.name && <p className="font-medium">{user.name}</p>}*/}
            {user?.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            )}
            
          </div>
        </div>
        <DropdownMenuSeparator />
        <div>
          <MetaMaskConnectButton />
        </div>
        <DropdownMenuItem asChild>
          <Link href="/">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/create">Create a subscription</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={async (event) => {
            event.preventDefault()
            await supabase.auth.signOut()
            router.refresh()
            router.push('/login')
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}