import type { Attendee } from "@/types/user"

export interface AdminAttendee extends Attendee {
  email: string
  is_active: boolean
  created_at: string | null
}

export interface AdminOrganiser {
  id: number
  user_id: number
  full_name: string
  organisation: string | null
  phone: string | null
  email: string
  is_active: boolean
  created_at: string | null
}

export interface AdminStats {
  attendees: number
  organisers: number
  sessions: number
  pending_attendees: number
  pending_organisers: number
}

export interface UpdateAdminAttendeePayload {
  full_name: string
  phone?: string
  is_active?: boolean
}

export interface UpdateAdminOrganiserPayload {
  full_name: string
  organisation?: string
  phone?: string
  is_active?: boolean
}
