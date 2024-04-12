"use client";

import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Persona, PersonaAvatar } from "@saas-ui/react";
import { signOut } from "next-auth/react";
import { Session } from "@src/interfaces";

export default function AccountMenu({ session }: { session: Session }) {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={
          <Persona>
            <PersonaAvatar name={session?.user?.name} src={session?.user?.image} size="sm" />
          </Persona>
        }
        variant="ghost"
      />
      <MenuList>
        <MenuItem onClick={() => signOut({ callbackUrl: "/" })}>Sign out</MenuItem>
      </MenuList>
    </Menu>
  );
}
