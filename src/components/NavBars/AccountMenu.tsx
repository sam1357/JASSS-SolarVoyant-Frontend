"use client";

import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Persona, PersonaAvatar } from "@saas-ui/react";
import { signOut } from "next-auth/react";
import { Session } from "@src/interfaces";
import { useRouter } from "next/navigation";

export default function AccountMenu({ session }: { session: Session }) {
  const router = useRouter();
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
        <MenuItem onClick={() => router.push("/dashboard/settings")}>Settings</MenuItem>
      </MenuList>
    </Menu>
  );
}
