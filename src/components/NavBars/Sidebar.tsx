"use client";

import {
  Box,
  Center,
  Divider,
  Text,
  Flex,
  Heading,
  HStack,
  IconButton,
  Show,
  Stack,
  Tooltip,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Sidebar as SidebarShell,
  SidebarSection,
  SidebarOverlay,
  NavItem,
  SidebarToggleButton,
} from "@saas-ui/react";
import Logo from "../Logo";
import { TbLayoutGrid } from "react-icons/tb";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { BiSolidMapAlt } from "react-icons/bi";
import { IoMdPerson } from "react-icons/io";
import { usePathname } from "next/navigation";
import { FaCog } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { PiPushPinSlashLight } from "react-icons/pi";
import { PiPushPinFill } from "react-icons/pi";
import { IconContext } from "react-icons/lib";
import { colors } from "@src/styles/colours";
import Link from "next/link";

// can't be put in constants because of the icons because XML
const DASHBOARD_PAGES = [
  { name: "Overview", href: "/dashboard/overview", icon: <TbLayoutGrid /> },
  {
    name: "Forecast",
    href: "/dashboard/forecast",
    icon: <BiSolidBarChartAlt2 />,
  },
  {
    name: "Choropleth Map",
    href: "/dashboard/choropleth-map",
    icon: <BiSolidMapAlt />,
  },
  { name: "My Energy Data", href: "/dashboard/data", icon: <IoMdPerson /> },
];

interface Props {
  isOpen: boolean;
}

const SidebarContents: React.FC<Props> = ({ isOpen }) => {
  const pathname = usePathname();
  const { colorMode } = useColorMode();

  return (
    <>
      <Tooltip label="Return to Home">
        <Link href="/">
          <SidebarSection paddingY={{ base: 4, md: 10 }}>
            <HStack gap={3} justifyContent="center">
              <Logo size={35} />
              <Heading display={isOpen ? "block" : "none"}>SolarVoyant</Heading>
            </HStack>
          </SidebarSection>
        </Link>
      </Tooltip>
      <Center>
        <Divider width="80%" />
      </Center>
      <Heading
        as="h6"
        paddingLeft={8}
        size="sm"
        color="gray.600"
        display={isOpen ? "block" : "none"}
      >
        GENERAL
      </Heading>
      <SidebarSection flex="1" overflowY="auto">
        <Stack spacing={6}>
          {DASHBOARD_PAGES.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              isActive={pathname === item.href}
              size="lg"
              variant="subtle"
              colorScheme="primary"
              href={item.href}
            >
              {item.name}
            </NavItem>
          ))}
        </Stack>
      </SidebarSection>
      <Center>
        <Divider width="80%" />
      </Center>
      <Heading
        as="h6"
        paddingLeft={8}
        size="sm"
        color="gray.600"
        display={isOpen ? "block" : "none"}
      >
        ACCOUNT
      </Heading>
      <SidebarSection>
        <Stack>
          {" "}
          <NavItem
            icon={<FaCog />}
            variant="subtle"
            isActive={pathname === "/dashboard/settings"}
            size="lg"
            href="/dashboard/settings"
          >
            Settings
          </NavItem>
          <NavItem
            icon={
              <IconContext.Provider value={{ color: "red.500" }}>
                <MdLogout
                  style={{ fill: colorMode === "dark" ? colors.red[400] : colors.red[500] }}
                />
              </IconContext.Provider>
            }
            variant="subtle"
            size="lg"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <Text
              display={isOpen ? "block" : "none"}
              textColor={colorMode === "dark" ? "red.400" : "red.500"}
              fontWeight={600}
              whiteSpace="nowrap"
            >
              Sign Out
            </Text>
          </NavItem>
        </Stack>
      </SidebarSection>
      <SidebarOverlay />
    </>
  );
};

export default function Sidebar() {
  const { isOpen, onToggle, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Show the sidebar when the user hovers over it
  useEffect(() => {
    if (isHovered) {
      onOpen();
    } else {
      // Close the sidebar after a delay if it is not pinned
      const timeoutId = setTimeout(() => {
        if (!isPinned) {
          onClose();
        }
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [isHovered, isPinned, onOpen, onClose]);

  // Toggle the sidebar pin
  const togglePin = () => {
    setIsPinned(!isPinned);
    toast({
      title: `Sidebar has been ${isPinned ? "unpinned" : "pinned"}.`,
      status: "info",
      duration: 1500,
      position: "top",
      isClosable: true,
    });
    if (!isPinned && !isOpen) {
      onToggle();
    }
  };

  return (
    <>
      <Show above="lg">
        <Box
          position={"fixed"}
          zIndex={"100"}
          height={"100vh"}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <SidebarShell
            toggleBreakpoint={false}
            variant={isOpen ? "default" : "compact"}
            transition="width"
            transitionDuration="normal"
            width={isPinned || isOpen ? "280px" : "20"}
            minWidth="auto"
            height="100%"
          >
            <Flex justifyContent="right">
              {isOpen && (
                <Tooltip label={isPinned ? "Unpin sidebar" : "Pin sidebar"}>
                  <IconButton
                    icon={isPinned ? <PiPushPinFill /> : <PiPushPinSlashLight />}
                    aria-label="Pin sidebar"
                    onClick={togglePin}
                    position="fixed"
                    marginX={2}
                    size="lg"
                    variant="neutral"
                  />
                </Tooltip>
              )}
            </Flex>
            <SidebarContents isOpen={isOpen} />
          </SidebarShell>
        </Box>
        <SidebarShell
          variant={isOpen ? "default" : "compact"}
          transition="width"
          transitionDuration="normal"
          width={isPinned || isOpen ? "280px" : "20"}
          zIndex={-1000}
          opacity={0}
        />
      </Show>
      <Show below="lg">
        <SidebarShell toggleBreakpoint="lg" height="100%" position="fixed">
          <SidebarToggleButton top="7px" />
          <SidebarContents isOpen={true} />
        </SidebarShell>
      </Show>
    </>
  );
}
