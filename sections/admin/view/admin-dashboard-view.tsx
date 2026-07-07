"use client"

import { useCallback, useState } from "react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getApiErrorMessage } from "@/lib/api-client"
import { useMountedFetch } from "@/hooks/use-mounted-fetch"
import { getAdminStats } from "@/services/admin"
import { getSessions } from "@/services/session"
import type { AdminStats } from "@/types/admin"
import { isSessionFull, type Session } from "@/types/session"
import { toast } from "sonner"

export default function AdminDashboardView() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [statsData, sessionsData] = await Promise.all([
        getAdminStats(),
        getSessions(),
      ])
      setStats(statsData.stats)
      setSessions(sessionsData.sessions)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load dashboard."))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useMountedFetch(loadData)

  const fullSessions = sessions.filter(isSessionFull).length

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description="Manage attendees, organisers, and monitor conference activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Attendees", value: stats?.attendees ?? 0 },
          { label: "Organisers", value: stats?.organisers ?? 0 },
          { label: "Sessions", value: stats?.sessions ?? sessions.length },
          { label: "Pending Attendees", value: stats?.pending_attendees ?? 0 },
          { label: "Pending Organisers", value: stats?.pending_organisers ?? 0 },
        ].map((item) => (
          <Card key={item.label} className="border bg-background shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-3xl font-bold">{isLoading ? "..." : item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border bg-background shadow-sm">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">User Management</h2>
            <p className="text-sm text-muted-foreground">
              Review pending registrations, approve accounts, and manage profiles.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/admin/attendees">Manage Attendees</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/organisers">Manage Organisers</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border bg-background shadow-sm">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Schedule Overview</h2>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading schedule data..."
                : `${sessions.length} sessions published, ${fullSessions} at full capacity.`}
            </p>
            <Button asChild variant="outline">
              <Link href="/schedule">View Public Schedule</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
