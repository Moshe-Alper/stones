import { redirect } from "next/navigation"
import { isOwnerAuthed } from "@/lib/auth"
import { LoginForm } from "./login-form"

export default async function LoginPage() {
  if (await isOwnerAuthed()) redirect("/")
  return (
    <>
      <h1>כניסה</h1>
      <div className="card">
        <LoginForm />
      </div>
    </>
  )
}
