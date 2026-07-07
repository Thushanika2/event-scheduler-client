"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import axios from "axios"

import { clearAuthStorage, getEffectiveUser, getStoredToken, getStoredUser, normalizeRole } from "@/lib/auth-storage"
import { apiClient, getApiErrorMessage } from "@/lib/api-client"
import type { Attendee, AuthProfile, Organiser, User, UserRole } from "@/types/user"

type RegisterPayload = {
  email: string
  password: string
  role: "attendee" | "organiser"
  full_name: string
  phone?: string
  organisation?: string
}

type AuthContextValue = {
  user: User | null
  profile: AuthProfile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  refreshProfile: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function getDashboardPath(role: UserRole | string) {
  const normalized = normalizeRole(role)
  if (normalized === "organiser") return "/organiser/dashboard"
  if (normalized === "admin") return "/admin/dashboard"
  return "/attendee/dashboard"
}

export function getApiError(error: unknown, fallback: string) {
  return getApiErrorMessage(error, fallback)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    const token = getStoredToken()
    if (!token) {
      setUser(null)
      setProfile(null)
      return null
    }

    const response = await apiClient.get<AuthProfile>("/api/auth/profile")
    const nextUser = {
      ...response.data.user,
      role: normalizeRole(response.data.user.role),
    }
    setUser(nextUser)
    setProfile({
      ...response.data,
      user: nextUser,
    })
    localStorage.setItem("user", JSON.stringify(nextUser))
    return nextUser
  }, [])

  const clearSession = useCallback(() => {
    clearAuthStorage()
    setUser(null)
    setProfile(null)
  }, [])

  useEffect(() => {
    async function bootstrap() {
      const token = getStoredToken()

      if (!token) {
        clearSession()
        setIsLoading(false)
        return
      }

      const storedUser = getStoredUser()
      if (storedUser) {
        setUser({ ...storedUser, role: normalizeRole(storedUser.role) })
      }

      try {
        await refreshProfile()
      } catch {
        clearSession()
      } finally {
        setIsLoading(false)
      }
    }

    void bootstrap()
  }, [refreshProfile, clearSession])

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.post<{
      access_token: string
      user: User
    }>("/api/auth/login", { email, password })

    const nextUser = {
      ...response.data.user,
      role: normalizeRole(response.data.user.role),
    }

    localStorage.setItem("access_token", response.data.access_token)
    localStorage.setItem("user", JSON.stringify(nextUser))
    setUser(nextUser)
    setProfile({ user: nextUser })

    try {
      const refreshedUser = await refreshProfile()
      return refreshedUser ?? nextUser
    } catch {
      return nextUser
    }
  }, [refreshProfile])

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await apiClient.post<{
      message: string
      user: User
      attendee?: Attendee
      organiser?: Organiser
    }>("/api/auth/register", payload)

    return {
      ...response.data.user,
      role: normalizeRole(response.data.user.role),
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/auth/logout")
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        throw error
      }
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoading,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, profile, isLoading, login, register, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export function useEffectiveUser() {
  const { user } = useAuth()
  return getEffectiveUser(user)
}
