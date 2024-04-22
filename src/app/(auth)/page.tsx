"use client";

import React from "react";
import { Box, Button, Flex, Image, Heading, Stack, useColorMode, Wrap } from "@chakra-ui/react";
import Link from "next/link";
import BackgroundImage from "@src/components/BackgroundImage";

export default function LandingPage() {
  const { colorMode } = useColorMode();

  return (
    <Flex
      align="center"
      justify="center"
      direction={{ base: "column-reverse", lg: "row" }}
      px={{ base: "30", sm: "50", lg: "100" }}
      h="95%"
      w="100%"
      backgroundColor={colorMode === "light" ? "gray.300" : "whiteAlpha.200"}
      mb={16}
    >
      <BackgroundImage />
      <Stack
        zIndex={1}
        spacing={4}
        w={{ base: "90%", lg: "40%" }}
        align={["center", "center", "center", "flex-start"]}
      >
        <Heading
          as="h1"
          size="4xl"
          fontWeight="bold"
          color="white"
          textAlign={["center", "center", "center", "left"]}
        >
          Smart Savings.
        </Heading>
        <Wrap
          spacing={3}
          align={{ base: "center", lg: "left" }}
          justify={{ base: "center", lg: "left" }}
        >
          <Heading
            as="h1"
            size="4xl"
            fontWeight="bold"
            color="green.400"
            textAlign={["center", "center", "center", "left"]}
          >
            Greener
          </Heading>
          <Heading
            as="h1"
            size="4xl"
            fontWeight="bold"
            color="white"
            textAlign={["center", "center", "center", "left"]}
          >
            Future.
          </Heading>
        </Wrap>
        <Heading
          as="h2"
          size="lg"
          fontWeight="normal"
          lineHeight={1.5}
          color="white"
          textAlign={["center", "center", "center", "left"]}
          w="90%"
        >
          Our solar insights and monitoring solution maximises your savings and renewable energy
          usage.
        </Heading>
        <Link href="/dashboard/overview">
          <Button colorScheme="primary" borderRadius="8px" py="4" px="4" lineHeight="1" size="xl">
            Get started for free
          </Button>
        </Link>
      </Stack>
      <Box
        w={{ base: "80%", sm: "60%", md: "50%" }}
        mb={{ base: 12, md: 0 }}
        display="flex"
        justifyContent="center"
        alignContent="center"
        zIndex={1}
      >
        <Image alt="House" src="/phone.png" />
      </Box>
    </Flex>
  );
}
