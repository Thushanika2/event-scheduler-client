"use client"

import {
  attendeeLinks,
  AuthenticatedRoute,
  PortalLayout,
} from "@/components/auth-guard"

export default function AttendeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthenticatedRoute allowedRoles={["attendee"]}>
      <PortalLayout title="Attendee Portal" links={attendeeLinks}>
        {children}
      </PortalLayout>
    </AuthenticatedRoute>
  )
}
