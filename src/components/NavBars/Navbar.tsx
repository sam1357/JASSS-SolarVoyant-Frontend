"use client";

import {
  Navbar as NavbarShell,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarLink,
} from "@saas-ui/react";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";

import { FiX, FiMenu } from "react-icons/fi";
import React from "react";
import Logo from "@components/Logo";
import { NAVBAR_HEIGHT, PAGES } from "@src/constants";
import { usePathname } from "next/navigation";
import ColourModeToggle from "@components/NavBars/ColourModeToggle";
import { Session } from "@src/interfaces";
import AccountMenu from "./AccountMenu";

const Navbar: React.FC<{ session: Session }> = ({ session }) => {
  const pathname = usePathname();
  const mobileNav = useDisclosure();
  const { colorMode } = useColorMode();

  return (
    <NavbarShell
      position="sticky"
      backdropFilter="blur(10px)"
      backgroundColor={`rgba(0, 0, 0, ${
        colorMode === "light" ? "0.1" : "0.4"
      })`}
      height={`${NAVBAR_HEIGHT}px`}
    >
      <NavbarBrand>
        <Logo size={30} />
      </NavbarBrand>

      <NavbarContent display={{ base: "none", sm: "flex" }}>
        {PAGES.map((item, index) => (
          <NavbarItem key={index}>
            <NavbarLink
              isActive={pathname === item.href}
              color="foreground"
              href={item.href}
            >
              {item.name}
            </NavbarLink>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justifyContent="end" spacing="2">
        {pathname !== "/login" &&
          pathname !== "/signup" &&
          (session ? (
            <AccountMenu session={session} />
          ) : (
            <NavbarItem>
              <NavbarLink href="/login">Login</NavbarLink>
            </NavbarItem>
          ))}
        <ColourModeToggle />
        <Button
          aria-label={mobileNav.isOpen ? "Close menu" : "Open menu"}
          display={{ base: "inline-flex", sm: "none" }}
          onClick={mobileNav.onToggle}
          variant="ghost"
        >
          {mobileNav.isOpen ? <FiX /> : <FiMenu />}
        </Button>
      </NavbarContent>
      <Drawer {...mobileNav}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody fontSize="md">
            <NavbarContent flexDirection="column" justifyContent="stretch">
              {PAGES.map((item, index) => (
                <NavbarItem key={index} width="full">
                  <NavbarLink
                    href={item.href}
                    width="full"
                    justifyContent="start"
                  >
                    {item.name}
                  </NavbarLink>
                </NavbarItem>
              ))}
            </NavbarContent>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </NavbarShell>
  );
};

export default Navbar;
