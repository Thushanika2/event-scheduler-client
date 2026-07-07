"use client"

import { adminLinks, AuthenticatedRoute, PortalLayout } from "@/components/auth-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthenticatedRoute allowedRoles={["admin"]}>
      <PortalLayout title="Admin Portal" links={adminLinks}>
        {children}
      </PortalLayout>
    </AuthenticatedRoute>
  )
}
