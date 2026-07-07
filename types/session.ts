export type Session = {
  session_id: number
  room_id: number
  title: string
  speaker: string
  capacity: number
  date: string
  start_time: string
  end_time: string
}
<<<<<<< HEAD

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
=======
>>>>>>> 0fdf39e3b3f1b8ddf9a6f9bf6af14dab23d853c2
