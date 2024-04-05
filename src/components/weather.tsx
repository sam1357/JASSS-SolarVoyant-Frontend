"use client";
import {
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import cardBackground from "../../public/mountain.jpg";
import { IoEllipsisVertical } from "react-icons/io5";

const getWeatherIcon = (icon: string) =>
  `http://openweathermap.org/img/wn/${icon}@2x.png`;

const WeatherCard = ({ ...props }: any) => {
  const { colorMode } = useColorMode();

  // Remove drawer
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {true && (
        <Box
          {...props}
          backgroundImage={`url(${cardBackground.src})`}
          backgroundPosition={"center"}
          backgroundRepeat={"no-repeat"}
          backgroundSize={"cover"}
          backgroundColor={"blackAlpha.600"}
          backgroundBlendMode={"overlay"}
          transition={"all 0.3s ease-in-out"}
          _hover={{
            backgroundColor: "blackAlpha.700",
          }}
          borderRadius={"10px"}
          color={"white"}
          boxShadow={"lg"}
        >
          <Box
            position={"relative"}
            as={Flex}
            alignItems={"center"}
            justifyContent={"center"}
            flexDir={"column"}
            paddingX={4}
            paddingY={6}
            color={"white"}
            textAlign={"center"}
          >
            <Menu>
              <MenuButton
                as={IconButton}
                backgroundColor={"transparent"}
                _hover={{
                  backgroundColor: "transparent",
                }}
                _expanded={{
                  backgroundColor: "transparent",
                }}
                _active={{ backgroundColor: "transparent" }}
                _focus={{
                  backgroundColor: "transparent",
                }}
                outlineColor={"transparent"}
                aria-label="Weather Card Options"
                position={"absolute"}
                top={4}
                right={4}
                color={"white"}
              >
                <Icon as={IoEllipsisVertical} />
              </MenuButton>
              <MenuList color={colorMode === "dark" ? "gray.200" : "gray.900"}>
                <MenuItem onClick={onOpen}>Remove City</MenuItem>
              </MenuList>
            </Menu>

            <Heading as={"h4"} fontSize={"xs"} fontWeight={"bold"}>
              Sunday
            </Heading>
            <Text>24 March</Text>

            <Tooltip hasArrow label="Clear" placement={"top"}>
              <Image
                width={"80px"}
                filter={"drop-shadow(0 0 4px white)"}
                src={getWeatherIcon("01d")}
                alt="Clear"
              />
            </Tooltip>

            <Heading fontSize={"lg"}>
              Sydney
              <Text
                as={"sup"}
                fontSize={"xs"}
                fontWeight={"bold"}
                backgroundColor={"secondary.500"}
                color={"white"}
                px={2}
                borderRadius={10}
              >
                AU
              </Text>
            </Heading>

            <Text fontSize={"md"}>Clear sky</Text>

            <Flex
              justifyContent={"center"}
              flexWrap={"wrap"}
              gap={[0, 0, 2]}
              padding={2}
              w={"100%"}
              marginTop={4}
              borderRadius={"10px"}
              backgroundColor={"whiteAlpha.500"}
              sx={{
                "& *": {
                  textAlign: "center",
                  flex: ["0 1 50%", "0 1 50%", "auto"],
                },
              }}
            >
              <Box>
                <Text fontSize={"sm"}>Current Temp.</Text>
                <Text fontWeight={"bold"}>20 ºC</Text>
              </Box>
              <Box>
                <Text fontSize={"sm"}>Feels Like</Text>
                <Text fontWeight={"bold"}>20 ºC</Text>
              </Box>
              <Box>
                <Text fontSize={"sm"}>Humidity</Text>
                <Text fontWeight={"bold"}>80%</Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
};

export default WeatherCard;
