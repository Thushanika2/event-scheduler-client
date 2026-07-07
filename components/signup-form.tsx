"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { GuestRoute } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getApiError, useAuth } from "@/providers/auth-provider"

type SignupFormProps = {
  role?: "attendee" | "organiser"
  title?: string
  description?: string
}

export function SignupForm({
  role = "attendee",
  title = "Create an attendee account",
  description = "Register to browse sessions and build your personal agenda.",
}: SignupFormProps) {
  const router = useRouter()
  const { register } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [organisation, setOrganisation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await register({
        email,
        password,
        role,
        full_name: fullName,
        phone: phone || undefined,
        organisation: role === "organiser" ? organisation || undefined : undefined,
      })
      toast.success("Registration successful. Awaiting admin approval.")
      router.replace("/auth/login")
    } catch (error) {
      toast.error(getApiError(error, "Registration failed."))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GuestRoute>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
                <Input
                  id="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
              {role === "organiser" && (
                <Field>
                  <FieldLabel htmlFor="organisation">Organisation</FieldLabel>
                  <Input
                    id="organisation"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                  />
                </Field>
              )}
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/auth/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </GuestRoute>
  )
}
