import { SiteHeader } from "@/components/site-header"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex min-h-[calc(100svh-65px)] max-w-md items-center p-6">
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </>
  )
}
