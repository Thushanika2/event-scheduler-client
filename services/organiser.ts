import { apiClient } from "@/lib/api-client"
import type { Organiser } from "@/types/user"

export interface UpdateOrganiserPayload {
  full_name: string
  organisation?: string
  phone?: string
}

export async function getOrganiser(id: number) {
  const response = await apiClient.get<{ organiser: Organiser }>(`/api/organisers/${id}`)
  return response.data
}

export async function updateOrganiser(id: number, data: UpdateOrganiserPayload) {
  const response = await apiClient.put<{ message: string; organiser: Organiser }>(
    `/api/organisers/${id}`,
    data,
  )
  return response.data
}
