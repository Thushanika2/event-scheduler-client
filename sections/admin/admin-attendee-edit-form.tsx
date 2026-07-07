"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useMountedFetch } from "@/hooks/use-mounted-fetch"
import { getApiErrorMessage } from "@/lib/api-client"
import { getAdminAttendee, updateAdminAttendee } from "@/services/admin"

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

export default function AdminAttendeeEditForm({ attendeeId }: { attendeeId: number }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      isActive: false,
    },
  })

  const loadAttendee = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAdminAttendee(attendeeId)
      setEmail(data.attendee.email)
      form.reset({
        fullName: data.attendee.full_name,
        phone: data.attendee.phone ?? "",
        isActive: data.attendee.is_active,
      })
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load attendee."))
    } finally {
      setIsLoading(false)
    }
  }, [attendeeId, form])

  useMountedFetch(loadAttendee)

  async function onSubmit(values: FormValues) {
    try {
      await updateAdminAttendee(attendeeId, {
        full_name: values.fullName,
        phone: values.phone || undefined,
        is_active: values.isActive,
      })
      toast.success("Attendee updated.")
      router.push("/admin/attendees")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update attendee."))
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading attendee...</p>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit Attendee"
        description="Update attendee profile details and approval status."
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/attendees">Back to Attendees</Link>
          </Button>
        }
      />

      <Card className="max-w-2xl border bg-background shadow-sm">
        <CardHeader>
          <CardTitle>{email}</CardTitle>
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
              <Field className="flex items-center gap-2">
                <Controller
                  name="isActive"
                  control={form.control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  )}
                />
                <FieldLabel className="mb-0">Approved</FieldLabel>
              </Field>
              <Button type="submit">Save Changes</Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
