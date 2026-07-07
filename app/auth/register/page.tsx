import { SiteHeader } from "@/components/site-header"
import { SignupForm } from "@/components/signup-form"

export default function RegisterPage() {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex min-h-[calc(100svh-65px)] max-w-md items-center p-6">
        <div className="w-full">
          <SignupForm />
        </div>
      </div>
    </>
  )
}
