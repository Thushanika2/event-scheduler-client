import SessionNewEditForm from "@/sections/session/session-new-edit-form"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditSessionPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Edit Session</h1>
        <p className="text-muted-foreground">Update session details and capacity.</p>
      </div>
      <SessionNewEditForm sessionId={Number(id)} />
    </div>
  )
}
