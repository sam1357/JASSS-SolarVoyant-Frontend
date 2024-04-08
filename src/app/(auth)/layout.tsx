import type { Metadata } from "next";
import Navbar from "@components/NavBars/Navbar";
import { NAVBAR_HEIGHT } from "@src/constants";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";

export const metadata: Metadata = {
  title: "SolarVoyant | Authentication",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <div style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}>
      <Navbar session={session} />
      <Suspense>
        <div style={{ height: "100%" }}>{children}</div>
      </Suspense>
    </div>
  );
}
