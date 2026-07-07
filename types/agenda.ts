import type { Session } from "@/types/session"

export interface AgendaItem {
  id: number
  attendee_id: number
  session_id: number
  added_at: string | null
  session: Session | null
}

export interface CreateAgendaResponse {
  message: string
  agenda_item: AgendaItem
  warning?: string
  clashing_sessions?: Session[]
}
