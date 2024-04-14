import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import UserDataContainer from "@src/components/UserDataContainer";

export default async function DashboardSettingsPage() {
  const session = await getServerSession(authOptions);

  return <UserDataContainer session={session} />;
}
