import {
  Spacer,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  AppShell,
  Sidebar,
  SidebarSection,
  NavItem,
  PersonaAvatar,
} from "@saas-ui/react";

import { FiHome, FiUsers } from "react-icons/fi";

export default function Page() {
  return (
    <AppShell
      height="$100vh"
      sidebar={
        <Sidebar width="30%" toggleBreakpoint="sm">
          <SidebarSection direction="row">
            {/* <SaasUILogo width="100px" /> */}
            <Spacer />
            <Menu>
              <MenuButton
                as={IconButton}
                icon={
                  <PersonaAvatar
                    presence="offline"
                    size="xs"
                    src="/showcase-avatar.jpg"
                  />
                }
                variant="ghost"
              />
              <MenuList>
                <MenuItem>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </SidebarSection>
          <SidebarSection flex="1" overflowY="auto">
            <NavItem icon={<FiHome size="1.2em" />}>Home</NavItem>
            <NavItem icon={<FiUsers size="1.2em" />}>Contacts</NavItem>
          </SidebarSection>
        </Sidebar>
      }
    >
      <Button colorScheme="orange">Test Button</Button>
    </AppShell>
  );
}
