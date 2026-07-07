import { notFound } from "next/navigation"

import ScheduleDetailView from "@/sections/schedule/view/schedule-detail-view"

type PageProps = {
  params: Promise<{ sessionId: string }>
}

export default async function ScheduleDetailPage({ params }: PageProps) {
  const { sessionId } = await params
  const id = Number(sessionId)

  if (Number.isNaN(id)) {
    notFound()
  }

  return <ScheduleDetailView sessionId={id} />
}
