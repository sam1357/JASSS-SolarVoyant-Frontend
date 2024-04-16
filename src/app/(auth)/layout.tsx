import Navbar from "@components/NavBars/Navbar";
import { NAVBAR_HEIGHT } from "@src/constants";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { Box } from "@chakra-ui/react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <Box style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}>
      <Navbar session={session} />
      <Suspense>
        <Box style={{ height: "100%" }}>{children}</Box>
      </Suspense>
    </Box>
  );
}
