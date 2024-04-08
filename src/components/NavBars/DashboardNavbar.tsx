"use client";

import { Navbar as NavbarShell, NavbarContent } from "@saas-ui/react";

import React from "react";
import { NAVBAR_HEIGHT } from "@src/constants";
import ColourModeToggle from "@components/NavBars/ColourModeToggle";
import { Session } from "@src/interfaces";
import AccountMenu from "./AccountMenu";
import NotificationMenu from "./NotificationMenu";

const DashboardNavbar: React.FC<{ session: Session }> = ({ session }) => {
  return (
    <NavbarShell position="sticky" height={`${NAVBAR_HEIGHT}px`}>
      <NavbarContent justifyContent="end" spacing="2">
        <NotificationMenu />
        <ColourModeToggle />
        <AccountMenu session={session} />
      </NavbarContent>
    </NavbarShell>
  );
};

export default DashboardNavbar;
