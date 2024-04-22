import { authOptions } from "@src/authOptions";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import SignupPageClient from "./page-client";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  // redirect to the dashboard if the user is already logged in
  if (session) {
    redirect("/dashboard/overview");
  }

  return <SignupPageClient />;
}
