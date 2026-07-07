"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CalendarDays, LayoutDashboard, LogOut, Shield, UserCog, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getEffectiveUser, isAuthenticated } from "@/lib/auth-storage"
import { cn } from "@/lib/utils"
import { getDashboardPath, useAuth } from "@/providers/auth-provider"
import type { UserRole } from "@/types/user"
import { useEffect } from "react"

type AuthenticatedRouteProps = {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function AuthenticatedRoute({
  children,
  allowedRoles,
}: AuthenticatedRouteProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const effectiveUser = getEffectiveUser(user)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated()) {
      router.replace("/auth/login")
      return
    }
    if (
      effectiveUser &&
      allowedRoles &&
      !allowedRoles.includes(effectiveUser.role)
    ) {
      router.replace(getDashboardPath(effectiveUser.role))
    }
  }, [effectiveUser, isLoading, allowedRoles, router])

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated() || !effectiveUser) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (allowedRoles && !allowedRoles.includes(effectiveUser.role)) {
    return null
  }

  return <>{children}</>
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const effectiveUser = getEffectiveUser(user)

  useEffect(() => {
    if (isLoading || !effectiveUser || !isAuthenticated()) return
    router.replace(getDashboardPath(effectiveUser.role))
  }, [effectiveUser, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (effectiveUser && isAuthenticated()) {
    return null
  }

  return <>{children}</>
}

type PortalLink = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

type PortalLayoutProps = {
  children: React.ReactNode
  title: string
  links: PortalLink[]
}

function isActivePath(pathname: string, href: string) {
  if (pathname === href) return true
  if (href === "/organiser/sessions" || href === "/admin/attendees" || href === "/admin/organisers") {
    return pathname.startsWith(href)
  }
  return pathname.startsWith(`${href}/`)
}

export function PortalLayout({ children, title, links }: PortalLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const effectiveUser = getEffectiveUser(user)
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.replace("/auth/login")
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <div className="mx-auto flex min-h-svh max-w-7xl flex-col md:flex-row">
        <aside className="border-b bg-background md:w-64 md:border-b-0 md:border-r">
          <div className="flex h-full flex-col gap-6 p-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                <p className="text-sm font-semibold">{title}</p>
              </div>
              <p className="truncate text-xs text-muted-foreground">{effectiveUser?.email}</p>
            </div>

            <nav className="flex flex-col gap-1">
              {links.map((link) => {
                const Icon = link.icon
                const active = isActivePath(pathname, link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </Link>
                )
              })}
              <Link
                href="/schedule"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <CalendarDays className="size-4" />
                Public Schedule
              </Link>
            </nav>

            <div className="mt-auto">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}

export const attendeeLinks: PortalLink[] = [
  { href: "/attendee/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/attendee/agenda", label: "My Agenda", icon: CalendarDays },
  { href: "/attendee/profile", label: "Profile", icon: UserCog },
]

export const organiserLinks: PortalLink[] = [
  { href: "/organiser/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/organiser/sessions", label: "Sessions", icon: CalendarDays },
  { href: "/organiser/profile", label: "Profile", icon: UserCog },
]

export const adminLinks: PortalLink[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/attendees", label: "Attendees", icon: Users },
  { href: "/admin/organisers", label: "Organisers", icon: UserCog },
]
