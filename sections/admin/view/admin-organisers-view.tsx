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
  approveAdminOrganiser,
  deleteAdminOrganiser,
  disapproveAdminOrganiser,
  getAdminOrganisers,
} from "@/services/admin"
import type { AdminOrganiser } from "@/types/admin"

export default function AdminOrganisersView() {
  const [organisers, setOrganisers] = useState<AdminOrganiser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadOrganisers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAdminOrganisers()
      setOrganisers(data.organisers)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load organisers."))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useMountedFetch(loadOrganisers)

  async function handleApprove(organiser: AdminOrganiser) {
    try {
      await approveAdminOrganiser(organiser.id)
      toast.success("Organiser approved.")
      loadOrganisers()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to approve organiser."))
    }
  }

  async function handleDisapprove(organiser: AdminOrganiser) {
    try {
      await disapproveAdminOrganiser(organiser.id)
      toast.success("Organiser disapproved.")
      loadOrganisers()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to disapprove organiser."))
    }
  }

  async function handleDelete(organiser: AdminOrganiser) {
    if (!confirm(`Delete organiser "${organiser.full_name}"?`)) return
    try {
      await deleteAdminOrganiser(organiser.id)
      toast.success("Organiser deleted.")
      loadOrganisers()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete organiser."))
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Organisers"
        description="Approve, edit, or remove organiser accounts."
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading organisers...</p>
      ) : organisers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No organisers found.</p>
      ) : (
        <div className="grid gap-4">
          {organisers.map((organiser) => (
            <Card key={organiser.id} className="border bg-background shadow-sm">
              <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{organiser.full_name}</h2>
                    <Badge variant={organiser.is_active ? "success" : "warning"}>
                      {organiser.is_active ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{organiser.email}</p>
                  <p className="text-sm">{organiser.organisation || "No organisation"}</p>
                  <p className="text-sm text-muted-foreground">
                    {organiser.phone || "No phone provided"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!organiser.is_active ? (
                    <Button size="sm" onClick={() => handleApprove(organiser)}>
                      <Check className="size-4" />
                      Approve
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleDisapprove(organiser)}>
                      <X className="size-4" />
                      Disapprove
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/organisers/edit/${organiser.id}`}>
                      <Pencil className="size-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(organiser)}>
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
