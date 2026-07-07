"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDateTime } from "@/lib/datetime"
import { getApiErrorMessage } from "@/lib/api-client"
import { useMountedFetch } from "@/hooks/use-mounted-fetch"
import { deleteSession, getOrganiserSessions } from "@/services/session"
import type { Session } from "@/types/session"

export default function SessionListView() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSessions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getOrganiserSessions()
      setSessions(data.sessions)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load sessions."))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useMountedFetch(loadSessions)

  async function handleDelete(session: Session) {
    if (!confirm(`Delete "${session.title}"?`)) return
    try {
      await deleteSession(session.id)
      toast.success("Session deleted.")
      await loadSessions()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete session."))
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Sessions"
        description="Create and manage your event sessions."
        action={
          <Button asChild>
            <Link href="/organiser/sessions/new">New Session</Link>
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <Card className="border bg-background shadow-sm">
          <CardContent className="p-6 text-sm text-muted-foreground">No sessions yet.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="border bg-background shadow-sm">
              <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{session.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {session.track} · {session.room}
                  </p>
                  <p className="text-sm">{formatDateTime(session.start_time)}</p>
                  <p className="text-sm text-muted-foreground">
                    {session.enrolled_count ?? 0}/{session.capacity} enrolled
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/organiser/sessions/edit/${session.id}`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(session)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
