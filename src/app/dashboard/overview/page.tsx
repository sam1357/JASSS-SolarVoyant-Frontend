import { Box, Card, Heading } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Box h="100%">
        <Heading>Welcome, {session?.user?.name}! 👋</Heading>
        <Card minH="40%" minW="40%">
          Hello
        </Card>
      </Box>
    </>
  );
}
