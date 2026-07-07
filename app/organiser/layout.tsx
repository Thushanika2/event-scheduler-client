"use client"

import {
  AuthenticatedRoute,
  organiserLinks,
  PortalLayout,
} from "@/components/auth-guard"

export default function OrganiserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthenticatedRoute allowedRoles={["organiser"]}>
      <PortalLayout title="Organiser Portal" links={organiserLinks}>
        {children}
      </PortalLayout>
    </AuthenticatedRoute>
  )
}
