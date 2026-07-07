import { apiClient } from "@/lib/api-client"
import type {
  CreateSessionPayload,
  Session,
  UpdateSessionPayload,
} from "@/types/session"

export async function getSessions(params?: {
  track?: string
  start_after?: string
  start_before?: string
}) {
  const response = await apiClient.get<{ sessions: Session[] }>("/api/sessions", {
    params,
  })
  return response.data
}

export async function getSession(id: number) {
  const response = await apiClient.get<{ session: Session }>(`/api/sessions/${id}`)
  return response.data
}

export async function getOrganiserSessions() {
  const response = await apiClient.get<{ sessions: Session[] }>("/api/organiser/sessions")
  return response.data
}

export async function createSession(data: CreateSessionPayload) {
  const response = await apiClient.post<{ message: string; session: Session }>(
    "/api/sessions",
    data,
  )
  return response.data
}

export async function updateSession(id: number, data: UpdateSessionPayload) {
  const response = await apiClient.put<{ message: string; session: Session }>(
    `/api/sessions/${id}`,
    data,
  )
  return response.data
}

export async function deleteSession(id: number) {
  const response = await apiClient.delete<{ message: string }>(`/api/sessions/${id}`)
  return response.data
}
