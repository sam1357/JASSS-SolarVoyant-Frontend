import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import EnergyDataPageClient from "./page-client";
import { Box } from "@chakra-ui/react";

export default async function EnergyDataPage() {
  const session = await getServerSession(authOptions);

  return (
    <Box p={5} h="100%" w="100%">
      <EnergyDataPageClient session={session} />
    </Box>
  );
}
