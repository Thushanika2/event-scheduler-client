import AdminAttendeeEditForm from "@/sections/admin/admin-attendee-edit-form"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminAttendeeEditPage({ params }: PageProps) {
  const { id } = await params
  return <AdminAttendeeEditForm attendeeId={Number(id)} />
}
