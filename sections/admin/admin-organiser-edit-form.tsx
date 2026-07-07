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
import { getAdminOrganiser, updateAdminOrganiser } from "@/services/admin"

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  organisation: z.string().optional(),
  phone: z.string().optional(),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

export default function AdminOrganiserEditForm({ organiserId }: { organiserId: number }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      organisation: "",
      phone: "",
      isActive: false,
    },
  })

  const loadOrganiser = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAdminOrganiser(organiserId)
      setEmail(data.organiser.email)
      form.reset({
        fullName: data.organiser.full_name,
        organisation: data.organiser.organisation ?? "",
        phone: data.organiser.phone ?? "",
        isActive: data.organiser.is_active,
      })
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load organiser."))
    } finally {
      setIsLoading(false)
    }
  }, [organiserId, form])

  useMountedFetch(loadOrganiser)

  async function onSubmit(values: FormValues) {
    try {
      await updateAdminOrganiser(organiserId, {
        full_name: values.fullName,
        organisation: values.organisation || undefined,
        phone: values.phone || undefined,
        is_active: values.isActive,
      })
      toast.success("Organiser updated.")
      router.push("/admin/organisers")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update organiser."))
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading organiser...</p>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit Organiser"
        description="Update organiser profile details and approval status."
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/organisers">Back to Organisers</Link>
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
                <FieldLabel>Organisation</FieldLabel>
                <Input {...form.register("organisation")} />
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
