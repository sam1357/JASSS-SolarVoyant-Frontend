"use client";
import {
  Box,
  Spacer,
  IconButton,
  Image,
  useDisclosure,
  Badge,
  Text,
  Button,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  AppShell,
  Sidebar,
  SidebarSection,
  SidebarOverlay,
  NavItem,
  NavGroup,
} from "@saas-ui/react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiStar,
  FiChevronsLeft,
  FiChevronsRight,
  FiHelpCircle,
} from "react-icons/fi";
import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import { AreaChart } from "@saas-ui/charts";
import WeatherCard from "@/components/weather";

const valueFormatter = (value: any) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default function Page() {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  });

  return (
    <AppShell
      height="$100vh"
      sidebar={
        <Sidebar
          toggleBreakpoint={false}
          variant={isOpen ? "default" : "compact"}
          transition="width"
          transitionDuration="normal"
          width={isOpen ? "280px" : "14"}
          minWidth="auto"
        >
          <SidebarSection direction={isOpen ? "row" : "column"}>
            <Image
              src="S.png"
              boxSize="8"
              display={isOpen ? "block" : "none"}
            />
            <Spacer />
            <IconButton
              onClick={onToggle}
              variant="ghost"
              size="sm"
              icon={isOpen ? <FiChevronsLeft /> : <FiChevronsRight />}
              aria-label="Toggle Sidebar"
            />
          </SidebarSection>

          <SidebarSection flex="1" overflowY="auto">
            <NavGroup>
              <NavItem icon={<FiHome />} isActive>
                Home
              </NavItem>
              <NavItem icon={<FiUsers />}>Users</NavItem>
              <NavItem icon={<FiSettings />}>Settings</NavItem>
            </NavGroup>

            <NavGroup title="Teams" isCollapsible>
              <NavItem>Sales</NavItem>
              <NavItem>Support</NavItem>
            </NavGroup>

            <NavGroup title="Tags" isCollapsible>
              <NavItem
                icon={<Badge bg="purple.500" boxSize="2" borderRadius="full" />}
              >
                <Text>Lead</Text>
                <Badge opacity="0.6" borderRadius="full" bg="none" ms="auto">
                  83
                </Badge>
              </NavItem>
              <NavItem
                icon={<Badge bg="cyan.500" boxSize="2" borderRadius="full" />}
              >
                <Text>Customer</Text>
                <Badge opacity="0.6" borderRadius="full" bg="none" ms="auto">
                  210
                </Badge>
              </NavItem>
            </NavGroup>
          </SidebarSection>
          <SidebarSection>
            <NavItem icon={<FiHelpCircle />}>Documentation</NavItem>
          </SidebarSection>
        </Sidebar>
      }
    >
      <Box>
        <Button colorScheme="brand">Hello</Button>
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          <GridItem colSpan={2}>
            <Card>
              <CardHeader pb="0">
                <Heading as="h4" fontWeight="medium" size="md">
                  Production v. Consumption over time
                </Heading>
              </CardHeader>
              <CardBody>
                <AreaChart
                  data={data}
                  categories={["Consumption", "Generation"]}
                  valueFormatter={valueFormatter}
                  colors={["blue", "green"]}
                  yAxisWidth={80}
                  height="300px"
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem colSpan={2}>
            <Card>
              <CardHeader pb="0">
                <Heading as="h4" fontWeight="medium" size="md">
                  Testing
                </Heading>
              </CardHeader>
              <CardBody>
                <AreaChart
                  data={data}
                  categories={["Consumption", "Generation"]}
                  valueFormatter={valueFormatter}
                  colors={["orange", "blue"]}
                  yAxisWidth={80}
                  height="300px"
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem colSpan={1}>
            <WeatherCard />
          </GridItem>
        </Grid>
      </Box>
    </AppShell>
  );
}
const data = [
  {
    date: "Dec 1",
    Consumption: 40,
    Generation: 21,
  },
  {
    date: "Dec 2",
    Consumption: 38,
    Generation: 22,
  },
  {
    date: "Dec 3",
    Consumption: 49,
    Generation: 22,
  },
  {
    date: "Dec 4",
    Consumption: 48,
    Generation: 29,
  },
  {
    date: "Dec 5",
    Consumption: 50,
    Generation: 22,
  },
  {
    date: "Dec 6",
    Consumption: 42,
    Generation: 30,
  },
  {
    date: "Dec 7",
    Consumption: 41,
    Generation: 28,
  },
  {
    date: "Dec 8",
    Consumption: 44,
    Generation: 23,
  },
  {
    date: "Dec 9",
    Consumption: 44,
    Generation: 24,
  },
  {
    date: "Dec 10",
    Consumption: 44,
    Generation: 30,
  },
  {
    date: "Dec 11",
    Consumption: 46,
    Generation: 25,
  },
  {
    date: "Dec 12",
    Consumption: 48,
    Generation: 25,
  },
  {
    date: "Dec 13",
    Consumption: 46,
    Generation: 25,
  },
  {
    date: "Dec 14",
    Consumption: 50,
    Generation: 28,
  },
  {
    date: "Dec 15",
    Consumption: 42,
    Generation: 34,
  },
  {
    date: "Dec 16",
    Consumption: 58,
    Generation: 33,
  },
  {
    date: "Dec 17",
    Consumption: 49,
    Generation: 35,
  },
  {
    date: "Dec 18",
    Consumption: 44,
    Generation: 33,
  },
  {
    date: "Dec 19",
    Consumption: 46,
    Generation: 35,
  },
  {
    date: "Dec 20",
    Consumption: 44,
    Generation: 35,
  },
  {
    date: "Dec 21",
    Consumption: 51,
    Generation: 30,
  },
  {
    date: "Dec 22",
    Consumption: 58,
    Generation: 36,
  },
  {
    date: "Dec 23",
    Consumption: 46,
    Generation: 30,
  },
  {
    date: "Dec 24",
    Consumption: 61,
    Generation: 30,
  },
  {
    date: "Dec 25",
    Consumption: 56,
    Generation: 33,
  },
  {
    date: "Dec 26",
    Consumption: 55,
    Generation: 33,
  },
  {
    date: "Dec 27",
    Consumption: 47,
    Generation: 32,
  },
  {
    date: "Dec 28",
    Consumption: 55,
    Generation: 33,
  },
  {
    date: "Dec 29",
    Consumption: 61,
    Generation: 32,
  },
  {
    date: "Dec 30",
    Consumption: 62,
    Generation: 29,
  },
  {
    date: "Dec 31",
    Consumption: 52,
    Generation: 37,
  },
];
