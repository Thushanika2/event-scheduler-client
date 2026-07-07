import { apiClient } from "@/lib/api-client"
import type {
  AdminAttendee,
  AdminOrganiser,
  AdminStats,
  UpdateAdminAttendeePayload,
  UpdateAdminOrganiserPayload,
} from "@/types/admin"

export async function getAdminStats() {
  const response = await apiClient.get<{ stats: AdminStats }>("/api/admin/stats")
  return response.data
}

export async function getAdminAttendees() {
  const response = await apiClient.get<{ attendees: AdminAttendee[] }>("/api/admin/attendees")
  return response.data
}

export async function getAdminAttendee(id: number) {
  const response = await apiClient.get<{ attendee: AdminAttendee }>(`/api/admin/attendees/${id}`)
  return response.data
}

export async function updateAdminAttendee(id: number, data: UpdateAdminAttendeePayload) {
  const response = await apiClient.put<{ message: string; attendee: AdminAttendee }>(
    `/api/admin/attendees/${id}`,
    data,
  )
  return response.data
}

export async function deleteAdminAttendee(id: number) {
  const response = await apiClient.delete<{ message: string }>(`/api/admin/attendees/${id}`)
  return response.data
}

export async function approveAdminAttendee(id: number) {
  const response = await apiClient.post<{ message: string; attendee: AdminAttendee }>(
    `/api/admin/attendees/${id}/approve`,
  )
  return response.data
}

export async function disapproveAdminAttendee(id: number) {
  const response = await apiClient.post<{ message: string; attendee: AdminAttendee }>(
    `/api/admin/attendees/${id}/disapprove`,
  )
  return response.data
}

export async function getAdminOrganisers() {
  const response = await apiClient.get<{ organisers: AdminOrganiser[] }>("/api/admin/organisers")
  return response.data
}

export async function getAdminOrganiser(id: number) {
  const response = await apiClient.get<{ organiser: AdminOrganiser }>(`/api/admin/organisers/${id}`)
  return response.data
}

export async function updateAdminOrganiser(id: number, data: UpdateAdminOrganiserPayload) {
  const response = await apiClient.put<{ message: string; organiser: AdminOrganiser }>(
    `/api/admin/organisers/${id}`,
    data,
  )
  return response.data
}

export async function deleteAdminOrganiser(id: number) {
  const response = await apiClient.delete<{ message: string }>(`/api/admin/organisers/${id}`)
  return response.data
}

export async function approveAdminOrganiser(id: number) {
  const response = await apiClient.post<{ message: string; organiser: AdminOrganiser }>(
    `/api/admin/organisers/${id}/approve`,
  )
  return response.data
}

export async function disapproveAdminOrganiser(id: number) {
  const response = await apiClient.post<{ message: string; organiser: AdminOrganiser }>(
    `/api/admin/organisers/${id}/disapprove`,
  )
  return response.data
}
