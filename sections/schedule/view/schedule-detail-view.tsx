"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDateTime } from "@/lib/datetime"
import { getApiErrorMessage } from "@/lib/api-client"
import { useMountedFetch } from "@/hooks/use-mounted-fetch"
import { addToAgenda } from "@/services/agenda"
import { getSession } from "@/services/session"
import { useEffectiveUser } from "@/providers/auth-provider"
import type { Session } from "@/types/session"

export default function ScheduleDetailView({ sessionId }: { sessionId: number }) {
  const router = useRouter()
  const user = useEffectiveUser()
  const invalidId = Number.isNaN(sessionId)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(!invalidId)
  const [isAdding, setIsAdding] = useState(false)

  const loadSession = useCallback(async () => {
    if (invalidId) return

    try {
      const data = await getSession(sessionId)
      setSession(data.session)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load session."))
    } finally {
      setIsLoading(false)
    }
  }, [invalidId, sessionId])

  useMountedFetch(loadSession)

  async function handleAddToAgenda() {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (user.role !== "attendee") {
      toast.error("Only attendees can add sessions to an agenda.")
      return
    }

    setIsAdding(true)
    try {
      const result = await addToAgenda(sessionId)
      if (result.warning) {
        toast.warning(result.warning)
      } else {
        toast.success("Session added to your agenda.")
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add session to agenda."))
    } finally {
      setIsAdding(false)
    }
  }

  if (invalidId) {
    return (
      <>
        <SiteHeader />
        <p className="p-6 text-sm text-muted-foreground">Invalid session.</p>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <SiteHeader />
        <p className="p-6 text-sm text-muted-foreground">Loading session...</p>
      </>
    )
  }

  if (!session) {
    return (
      <>
        <SiteHeader />
        <p className="p-6 text-sm text-muted-foreground">Session not found.</p>
      </>
    )
  }

  const canAddToAgenda = !user || user.role === "attendee"

  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Button variant="outline" asChild>
          <Link href="/schedule">Back to Schedule</Link>
        </Button>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <h1 className="text-3xl font-extrabold">{session.title}</h1>
              <p className="text-muted-foreground">{session.speaker}</p>
            </div>
            <div className="space-y-1 text-sm">
              <p>Track: {session.track}</p>
              <p>Room: {session.room}</p>
              <p>Starts: {formatDateTime(session.start_time)}</p>
              <p>Ends: {formatDateTime(session.end_time)}</p>
              <p>
                Capacity: {session.enrolled_count ?? 0}/{session.capacity}
                {session.is_full ? " (Full)" : ""}
              </p>
            </div>
            {canAddToAgenda ? (
              <Button
                onClick={handleAddToAgenda}
                disabled={isAdding || session.is_full}
              >
                {session.is_full
                  ? "Session Full"
                  : isAdding
                    ? "Adding..."
                    : user
                      ? "Add to My Agenda"
                      : "Login to Add to Agenda"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Only attendees can add sessions to a personal agenda.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
