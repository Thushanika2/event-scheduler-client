"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { formatDateTime, fromDatetimeLocalValue } from "@/lib/datetime"
import { getApiErrorMessage } from "@/lib/api-client"
import { useMountedFetch } from "@/hooks/use-mounted-fetch"
import { getSessions } from "@/services/session"
import type { Session } from "@/types/session"

export default function ScheduleListView() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [allTracks, setAllTracks] = useState<string[]>([])
  const [track, setTrack] = useState("")
  const [startAfter, setStartAfter] = useState("")
  const [startBefore, setStartBefore] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const loadSessions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getSessions({
        track: track || undefined,
        start_after: startAfter ? fromDatetimeLocalValue(startAfter) : undefined,
        start_before: startBefore ? fromDatetimeLocalValue(startBefore) : undefined,
      })
      setSessions(data.sessions)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load sessions."))
    } finally {
      setIsLoading(false)
    }
  }, [track, startAfter, startBefore])

  const loadInitialSessions = useCallback(async () => {
    try {
      const data = await getSessions()
      const tracks = Array.from(new Set(data.sessions.map((session) => session.track))).sort()
      setAllTracks(tracks)
      setSessions(data.sessions)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load sessions."))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useMountedFetch(loadInitialSessions)

  const visibleTracks = useMemo(() => {
    if (allTracks.length > 0) return allTracks
    return Array.from(new Set(sessions.map((session) => session.track))).sort()
  }, [allTracks, sessions])

  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-5xl space-y-8 p-6">
        <PageHeader
          title="Conference Schedule"
          description="Browse sessions by track or start time."
        />

        <Card className="border bg-background shadow-sm">
          <CardContent className="p-6">
            <FieldGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Field>
                <FieldLabel>Track</FieldLabel>
                <Input
                  list="tracks"
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  placeholder="e.g. AI, Cloud"
                />
                <datalist id="tracks">
                  {visibleTracks.map((value) => (
                    <option key={value} value={value} />
                  ))}
                </datalist>
              </Field>
              <Field>
                <FieldLabel>Start After</FieldLabel>
                <Input
                  type="datetime-local"
                  value={startAfter}
                  onChange={(e) => setStartAfter(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Start Before</FieldLabel>
                <Input
                  type="datetime-local"
                  value={startBefore}
                  onChange={(e) => setStartBefore(e.target.value)}
                />
              </Field>
              <Field className="flex items-end">
                <Button onClick={() => void loadSessions()}>Apply Filters</Button>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sessions found.</p>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session.id} className="border bg-background shadow-sm">
                <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{session.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {session.speaker} · {session.track} · {session.room}
                    </p>
                    <p className="text-sm">{formatDateTime(session.start_time)}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.enrolled_count ?? 0}/{session.capacity} enrolled
                      {session.is_full ? " · Full" : ""}
                    </p>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/schedule/${session.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
