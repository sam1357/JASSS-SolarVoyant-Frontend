import Sidebar from "@components/NavBars/Sidebar";
import { AppShell } from "@saas-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import DashboardNavbar from "@src/components/NavBars/DashboardNavbar";
import { Box } from "@chakra-ui/react";

export const metadata = {
  title: "Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <AppShell sidebar={<Sidebar />}>
      <DashboardNavbar session={session} />
      <Box h="100%">{children}</Box>
    </AppShell>
  );
}
