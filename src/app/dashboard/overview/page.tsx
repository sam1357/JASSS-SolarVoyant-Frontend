import { Box, Heading } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Box>
        <Heading>Welcome, {session?.user?.name}! 👋</Heading>
      </Box>
    </>
  );
}
