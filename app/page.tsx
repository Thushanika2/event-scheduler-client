import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex min-h-[calc(100svh-65px)] max-w-4xl flex-col justify-center gap-8 p-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold">Event Scheduler</h1>
          <p className="max-w-2xl text-muted-foreground">
            Browse conference sessions, build your personal agenda, and manage events as an
            organiser.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/schedule">View Schedule</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/register">Register as Attendee</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/register/organiser">Register as Organiser</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
