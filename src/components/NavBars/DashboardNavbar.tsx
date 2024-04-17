"use client";

import { Navbar as NavbarShell, NavbarContent } from "@saas-ui/react";

import React from "react";
import { NAVBAR_HEIGHT } from "@src/constants";
import ColourModeToggle from "@components/NavBars/ColourModeToggle";
import { Session } from "@src/interfaces";
import AccountMenu from "./AccountMenu";
import NotificationMenu from "./NotificationMenu";
import { useColorMode } from "@chakra-ui/react";

const DashboardNavbar: React.FC<{ session: Session }> = ({ session }) => {
  const { colorMode } = useColorMode();
  return (
    <NavbarShell
      position="sticky"
      background="transparent"
      backdropFilter="blur(10px)"
      height={`${NAVBAR_HEIGHT}px`}
      boxShadow={`2px 1px 5px 0px ${
        colorMode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.4)"
      }`}
    >
      <NavbarContent justifyContent="end" spacing="2">
        <NotificationMenu session={session} />
        <ColourModeToggle />
        <AccountMenu session={session} />
      </NavbarContent>
    </NavbarShell>
  );
};

export default DashboardNavbar;
