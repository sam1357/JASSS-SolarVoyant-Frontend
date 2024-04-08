import type { Metadata } from "next";
import { Providers } from "@app/providers";
import { fonts } from "@styles/fonts";
import { ColorModeScript } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "SolarVoyant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.inter.variable}>
      <body style={{ height: "100vh" }}>
        <Providers>
          <ColorModeScript initialColorMode="system" />
          <main style={{ height: "100%" }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
