"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { isAuthenticated } from "@/lib/auth-storage"
import { cn } from "@/lib/utils"
import { getDashboardPath, useEffectiveUser } from "@/providers/auth-provider"

const publicLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
]

export function SiteHeader() {
  const pathname = usePathname()
  const user = useEffectiveUser()
  const loggedIn = isAuthenticated() && Boolean(user)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            ES
          </div>
          <nav className="flex items-center gap-1">
            {publicLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname === link.href
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {loggedIn && user ? (
            <Button asChild size="sm">
              <Link href={getDashboardPath(user.role)}>My Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
