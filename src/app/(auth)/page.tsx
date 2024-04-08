import { Heading, Box } from "@chakra-ui/react";
import BackgroundImage from "@components/BackgroundImage";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <Box margin={3}>
      <Heading>Home Page</Heading>
      <BackgroundImage />

      {session && (
        <div>
          <p>Signed in as {session.user && session.user.name}</p>
          <a href="/api/auth/signout">Sign out by link</a>
        </div>
      )}

      {!session && <p>Not signed in</p>}
    </Box>
  );
}
