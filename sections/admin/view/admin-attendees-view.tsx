"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { Check, Pencil, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getApiErrorMessage } from "@/lib/api-client"
import { useMountedFetch } from "@/hooks/use-mounted-fetch"
import {
  approveAdminAttendee,
  deleteAdminAttendee,
  disapproveAdminAttendee,
  getAdminAttendees,
} from "@/services/admin"
import type { AdminAttendee } from "@/types/admin"

export default function AdminAttendeesView() {
  const [attendees, setAttendees] = useState<AdminAttendee[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadAttendees = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAdminAttendees()
      setAttendees(data.attendees)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load attendees."))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useMountedFetch(loadAttendees)

  async function handleApprove(attendee: AdminAttendee) {
    try {
      await approveAdminAttendee(attendee.id)
      toast.success("Attendee approved.")
      loadAttendees()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to approve attendee."))
    }
  }

  async function handleDisapprove(attendee: AdminAttendee) {
    try {
      await disapproveAdminAttendee(attendee.id)
      toast.success("Attendee disapproved.")
      loadAttendees()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to disapprove attendee."))
    }
  }

  async function handleDelete(attendee: AdminAttendee) {
    if (!confirm(`Delete attendee "${attendee.full_name}"?`)) return
    try {
      await deleteAdminAttendee(attendee.id)
      toast.success("Attendee deleted.")
      loadAttendees()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete attendee."))
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Attendees"
        description="Approve, edit, or remove attendee accounts."
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading attendees...</p>
      ) : attendees.length === 0 ? (
        <p className="text-sm text-muted-foreground">No attendees found.</p>
      ) : (
        <div className="grid gap-4">
          {attendees.map((attendee) => (
            <Card key={attendee.id} className="border bg-background shadow-sm">
              <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{attendee.full_name}</h2>
                    <Badge variant={attendee.is_active ? "success" : "warning"}>
                      {attendee.is_active ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{attendee.email}</p>
                  <p className="text-sm">{attendee.phone || "No phone provided"}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!attendee.is_active ? (
                    <Button size="sm" className="gap-2" onClick={() => handleApprove(attendee)}>
                      <Check className="size-4" />
                      Approve
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => handleDisapprove(attendee)}>
                      <X className="size-4" />
                      Disapprove
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="gap-2" asChild>
                    <Link href={`/admin/attendees/edit/${attendee.id}`}>
                      <Pencil className="size-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-2" onClick={() => handleDelete(attendee)}>
                    <Trash2 className="size-4" />
                    Delete
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
