import { Center, Heading, Spinner, VStack } from "@chakra-ui/react";

export default function LoadingUI({ msg = "Crunching the latest numbers..." }) {
  return (
    <Center h="100%" w="100%" zIndex={10} position="relative">
      <VStack gap={10}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          colorScheme="primary"
          color="primary.500"
          size="xl"
        />
        <Heading>{msg}</Heading>
      </VStack>
    </Center>
  );
}
