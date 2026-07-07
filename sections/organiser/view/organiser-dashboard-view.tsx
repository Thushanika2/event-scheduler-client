import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function OrganiserDashboardView() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Organiser Dashboard"
        description="Create sessions, manage capacity, and monitor enrolments."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border bg-background shadow-sm">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Manage Sessions</h2>
            <p className="text-sm text-muted-foreground">
              View, create, edit, and delete your event sessions.
            </p>
            <Button asChild>
              <Link href="/organiser/sessions">My Sessions</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border bg-background shadow-sm">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Public Schedule</h2>
            <p className="text-sm text-muted-foreground">
              Preview how attendees see your sessions on the public schedule.
            </p>
            <Button asChild variant="outline">
              <Link href="/schedule">View Schedule</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
