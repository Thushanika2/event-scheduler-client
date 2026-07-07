import SessionNewEditForm from "@/sections/session/session-new-edit-form"

export default function NewSessionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">New Session</h1>
        <p className="text-muted-foreground">Create a new conference session.</p>
      </div>
      <SessionNewEditForm />
    </div>
  )
}
