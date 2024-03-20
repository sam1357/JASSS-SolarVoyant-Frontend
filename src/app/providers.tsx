"use client";

import Link, { LinkProps } from "next/link";
import { SaasProvider } from "@saas-ui/react";
import React from "react";

const NextLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function NextLink(props, ref) {
    return <Link ref={ref} {...props} />;
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <SaasProvider linkComponent={NextLink}>{children}</SaasProvider>;
}
