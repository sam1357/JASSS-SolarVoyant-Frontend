import { authOptions } from "@src/authOptions";
import { redirect } from "next/navigation";
import LoginPageClient from "./page-client";
import { getServerSession } from "next-auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard/overview");
  }

  return <LoginPageClient />;
}
