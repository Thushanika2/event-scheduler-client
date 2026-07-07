import { SiteHeader } from "@/components/site-header"
import { SignupForm } from "@/components/signup-form"

export default function OrganiserRegisterPage() {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex min-h-[calc(100svh-65px)] max-w-md items-center p-6">
        <div className="w-full">
          <SignupForm
            role="organiser"
            title="Create an organiser account"
            description="Register to create and manage conference sessions."
          />
        </div>
      </div>
    </>
  )
}
