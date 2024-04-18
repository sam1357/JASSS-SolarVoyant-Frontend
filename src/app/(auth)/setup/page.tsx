import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import AccountSetupStepper from "@src/components/AuthPages/AccountSetupStepper";

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions);

  return <AccountSetupStepper session={session} />;
}
