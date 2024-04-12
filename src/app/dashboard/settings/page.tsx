import { Box, Heading } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";

export default async function DashboardSettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Box>
        <Heading>Welcome, {session?.user?.name}! This is the settings page.👋</Heading>
      </Box>
    </>
  );
}
