import { apiClient } from "@/lib/api-client"
import type { Attendee } from "@/types/user"

export interface UpdateAttendeePayload {
  full_name: string
  phone?: string
}

export async function getAttendee(id: number) {
  const response = await apiClient.get<{ attendee: Attendee }>(`/api/attendees/${id}`)
  return response.data
}

export async function updateAttendee(id: number, data: UpdateAttendeePayload) {
  const response = await apiClient.put<{ message: string; attendee: Attendee }>(
    `/api/attendees/${id}`,
    data,
  )
  return response.data
}
