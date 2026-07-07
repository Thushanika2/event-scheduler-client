"use client"

import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getApiErrorMessage } from "@/lib/api-client"
import { useMountedFetch } from "@/hooks/use-mounted-fetch"
import { useAuth } from "@/providers/auth-provider"
import { updateAttendee } from "@/services/attendee"

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function AttendeeProfileView() {
  const { profile, refreshProfile, isLoading: authLoading } = useAuth()
  const attendee = profile?.attendee

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: attendee?.full_name ?? "",
      phone: attendee?.phone ?? "",
    },
    values: attendee
      ? {
          fullName: attendee.full_name,
          phone: attendee.phone ?? "",
        }
      : undefined,
  })

  const loadProfile = useCallback(async () => {
    await refreshProfile()
  }, [refreshProfile])

  useMountedFetch(loadProfile)

  async function onSubmit(values: FormValues) {
    if (!attendee) return

    try {
      await updateAttendee(attendee.id, {
        full_name: values.fullName,
        phone: values.phone || undefined,
      })
      await refreshProfile()
      toast.success("Profile updated.")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update profile."))
    }
  }

  if (authLoading) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>
  }

  if (!attendee) {
    return <p className="text-sm text-muted-foreground">Attendee profile not found.</p>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Update your attendee details."
      />
      <Card className="max-w-2xl border bg-background shadow-sm">
        <CardHeader>
          <CardTitle>Attendee Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input {...form.register("fullName")} />
              </Field>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input {...form.register("phone")} />
              </Field>
              <Button type="submit">Save Changes</Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
