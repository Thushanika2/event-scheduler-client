import { apiClient } from "@/lib/api-client"
import type { AgendaItem, CreateAgendaResponse } from "@/types/agenda"

export async function getMyAgenda() {
  const response = await apiClient.get<{ agenda_items: AgendaItem[] }>("/api/agenda/my")
  return response.data
}

export async function addToAgenda(sessionId: number) {
  const response = await apiClient.post<CreateAgendaResponse>("/api/agenda", {
    session_id: sessionId,
  })
  return response.data
}

export async function removeFromAgenda(agendaItemId: number) {
  const response = await apiClient.delete<{ message: string }>(
    `/api/agenda/${agendaItemId}`,
  )
  return response.data
}
