import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AttendeeDashboardView() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Attendee Dashboard"
        description="Browse sessions and build your personal conference agenda."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border bg-background shadow-sm">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Browse Schedule</h2>
            <p className="text-sm text-muted-foreground">
              View all sessions and filter by track or time.
            </p>
            <Button asChild>
              <Link href="/schedule">View Schedule</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border bg-background shadow-sm">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">My Agenda</h2>
            <p className="text-sm text-muted-foreground">
              See your saved sessions and manage your personal schedule.
            </p>
            <Button asChild variant="outline">
              <Link href="/attendee/agenda">Open Agenda</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
