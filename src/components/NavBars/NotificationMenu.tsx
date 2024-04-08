"use client";

import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { GrNotification } from "react-icons/gr";

export default function NotificationMenu() {
  return (
    <Menu>
      <Tooltip label="Shows notifications">
        <MenuButton
          as={IconButton}
          icon={<GrNotification />}
          colorScheme="gray"
          size="lg"
          variant="ghost"
        />
      </Tooltip>
      <MenuList>
        <MenuItem>No new notifications</MenuItem>
      </MenuList>
    </Menu>
  );
}
