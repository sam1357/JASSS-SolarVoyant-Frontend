"use client";

import { IconButton, Menu, MenuButton, MenuItem, MenuList, useColorMode } from "@chakra-ui/react";
import { Persona, PersonaAvatar } from "@saas-ui/react";
import { signOut } from "next-auth/react";
import { Session } from "@src/interfaces";
import { useRouter } from "next/navigation";
import { FaCog } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

export default function AccountMenu({ session }: { session: Session }) {
  const router = useRouter();
  const { colorMode } = useColorMode();

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
        <MenuItem icon={<FaCog />} onClick={() => router.push("/dashboard/settings")}>
          Settings
        </MenuItem>
        <MenuItem
          textColor={colorMode === "dark" ? "red.400" : "red.500"}
          icon={<MdLogout />}
          fontWeight={600}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
