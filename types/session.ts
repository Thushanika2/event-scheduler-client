export interface Session {
  id: number
  organiser_id: number
  title: string
  speaker: string
  track: string
  room: string
  start_time: string
  end_time: string
  capacity: number
  enrolled_count?: number
  is_full?: boolean
}

export function isSessionFull(session: Session): boolean {
  return session.is_full ?? (session.enrolled_count ?? 0) >= session.capacity
}

export interface CreateSessionPayload {
  title: string
  speaker: string
  track: string
  room: string
  start_time: string
  end_time: string
  capacity: number
}

export type UpdateSessionPayload = CreateSessionPayload
