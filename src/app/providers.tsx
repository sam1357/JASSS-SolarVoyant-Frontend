"use client";

import Link, { LinkProps } from "next/link";
import { SaasProvider } from "@saas-ui/react";
import React from "react";
import { theme } from "@styles/theme";
import { SessionProvider } from "next-auth/react";

const NextLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function NextLink(props, ref) {
    return <Link ref={ref} {...props} />;
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SaasProvider linkComponent={NextLink} theme={theme}>
        {children}
      </SaasProvider>
    </SessionProvider>
  );
}
