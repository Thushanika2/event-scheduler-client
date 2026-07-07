"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from "@/lib/datetime"
import { getApiErrorMessage } from "@/lib/api-client"
import { useMountedFetch } from "@/hooks/use-mounted-fetch"
import {
  createSession,
  getSession,
  updateSession,
} from "@/services/session"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  speaker: z.string().min(1, "Speaker is required"),
  track: z.string().min(1, "Track is required"),
  room: z.string().min(1, "Room is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
})

type FormValues = z.infer<typeof schema>

export default function SessionNewEditForm({ sessionId }: { sessionId?: number }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(Boolean(sessionId))

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      speaker: "",
      track: "",
      room: "",
      startTime: "",
      endTime: "",
      capacity: 50,
    },
  })

  const loadSession = useCallback(async () => {
    if (!sessionId) return

    setIsLoading(true)
    try {
      const data = await getSession(sessionId)
      const session = data.session
      form.reset({
        title: session.title,
        speaker: session.speaker,
        track: session.track,
        room: session.room,
        startTime: toDatetimeLocalValue(session.start_time),
        endTime: toDatetimeLocalValue(session.end_time),
        capacity: session.capacity,
      })
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load session."))
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, form])

  useMountedFetch(loadSession)

  async function onSubmit(values: FormValues) {
    const payload = {
      title: values.title,
      speaker: values.speaker,
      track: values.track,
      room: values.room,
      start_time: fromDatetimeLocalValue(values.startTime),
      end_time: fromDatetimeLocalValue(values.endTime),
      capacity: values.capacity,
    }

    try {
      if (sessionId) {
        await updateSession(sessionId, payload)
        toast.success("Session updated.")
      } else {
        await createSession(payload)
        toast.success("Session created.")
      }
      router.push("/organiser/sessions")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save session."))
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading session...</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sessionId ? "Edit Session" : "Create Session"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input {...form.register("title")} />
            </Field>
            <Field>
              <FieldLabel>Speaker</FieldLabel>
              <Input {...form.register("speaker")} />
            </Field>
            <Field>
              <FieldLabel>Track</FieldLabel>
              <Input {...form.register("track")} />
            </Field>
            <Field>
              <FieldLabel>Room</FieldLabel>
              <Input {...form.register("room")} />
            </Field>
            <Field>
              <FieldLabel>Start Time</FieldLabel>
              <Input type="datetime-local" {...form.register("startTime")} />
            </Field>
            <Field>
              <FieldLabel>End Time</FieldLabel>
              <Input type="datetime-local" {...form.register("endTime")} />
            </Field>
            <Field>
              <FieldLabel>Capacity</FieldLabel>
              <Input
                type="number"
                min={1}
                {...form.register("capacity", { valueAsNumber: true })}
              />
            </Field>
            <Button type="submit">
              {sessionId ? "Save Changes" : "Create Session"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
