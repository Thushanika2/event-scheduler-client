import type { User, UserRole } from "@/types/user"

export function getStoredToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null

  const raw = localStorage.getItem("user")
  if (!raw) return null

  try {
    return JSON.parse(raw) as User
  } catch {
    localStorage.removeItem("user")
    return null
  }
}

export function clearAuthStorage() {
  if (typeof window === "undefined") return
  localStorage.removeItem("access_token")
  localStorage.removeItem("user")
}

export function normalizeRole(role: string | UserRole): UserRole {
  const value = String(role).trim().toLowerCase()
  if (value === "organiser") return "organiser"
  if (value === "admin") return "admin"
  return "attendee"
}

export function getEffectiveUser(contextUser: User | null): User | null {
  const token = getStoredToken()
  if (!token) return null
  const user = contextUser ?? getStoredUser()
  if (!user) return null
  return { ...user, role: normalizeRole(user.role) }
}

export function isAuthenticated() {
  return Boolean(getStoredToken() && getStoredUser())
}
