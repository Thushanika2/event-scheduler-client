import AdminOrganiserEditForm from "@/sections/admin/admin-organiser-edit-form"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminOrganiserEditPage({ params }: PageProps) {
  const { id } = await params
  return <AdminOrganiserEditForm organiserId={Number(id)} />
}
