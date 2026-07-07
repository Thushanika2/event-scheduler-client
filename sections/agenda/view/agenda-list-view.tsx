"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDateTime } from "@/lib/datetime"
import { getApiErrorMessage } from "@/lib/api-client"
import { useMountedFetch } from "@/hooks/use-mounted-fetch"
import { getMyAgenda, removeFromAgenda } from "@/services/agenda"
import type { AgendaItem } from "@/types/agenda"

export default function AgendaListView() {
  const [items, setItems] = useState<AgendaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadAgenda = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getMyAgenda()
      setItems(data.agenda_items)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load agenda."))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useMountedFetch(loadAgenda)

  async function handleRemove(item: AgendaItem) {
    if (!confirm(`Remove "${item.session?.title ?? "this session"}" from your agenda?`)) {
      return
    }

    try {
      await removeFromAgenda(item.id)
      toast.success("Session removed from agenda.")
      await loadAgenda()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to remove session."))
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Agenda"
        description="Your personal schedule, sorted by start time."
        action={
          <Button asChild variant="outline">
            <Link href="/schedule">Browse Sessions</Link>
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading agenda...</p>
      ) : items.length === 0 ? (
        <Card className="border bg-background shadow-sm">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No sessions in your agenda yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="border bg-background shadow-sm">
              <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{item.session?.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {item.session?.speaker} · {item.session?.track} · {item.session?.room}
                  </p>
                  {item.session?.start_time && (
                    <p className="text-sm">{formatDateTime(item.session.start_time)}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemove(item)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
