export type UserRole = "attendee" | "organiser" | "admin"

export interface User {
  id: number
  email: string
  role: UserRole
  is_active: boolean
  created_at: string | null
}

export interface Attendee {
  id: number
  user_id: number
  full_name: string
  phone: string | null
}

export interface Organiser {
  id: number
  user_id: number
  full_name: string
  organisation: string | null
  phone: string | null
}

export interface AuthProfile {
  user: User
  attendee?: Attendee
  organiser?: Organiser
}
