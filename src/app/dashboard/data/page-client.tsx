"use client";

import {
  Box,
  Card,
  Heading,
  Text,
  Stack,
  Divider,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Select,
  Grid,
  GridItem,
  Button,
  Checkbox,
  ButtonGroup,
  useBreakpoint,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { LoadScriptNext } from "@react-google-maps/api";
import Autocomplete from "@components/Choropleth/Autocomplete";
import { LIBRARIES } from "@src/constants";
import { GooglePlacesAutocompleteOption, Session } from "@src/interfaces";
import { useEffect, useRef, useState } from "react";
import CustomFormControl from "@src/components/AuthPages/CustomFormControl";
import CustomSlider from "@src/components/CustomSlider";
import { Api } from "@src/utils/Api";
import LoadingUI from "@components/LoadingUI";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import transformQuarterlyConsumption from "@src/utils/transformQuarterlyConsumption";

interface EnergyDataSubmitValues {
  surface_area: number;
  q1p: number;
  q2p: number;
  q3p: number;
  q4p: number;
  q1c: number;
  q2c: number;
  q3c: number;
  q4c: number;
  lower_limit: number;
  upper_limit: number;
}

const schema = yup
  .object({
    surface_area: yup.number().required("Surface area is required.").typeError("Must be a number."),
    q1p: yup
      .number()
      .min(0, "Must be positive.")
      .required("Required.")
      .typeError("Must be a number."),
    q2p: yup
      .number()
      .min(0, "Must be positive.")
      .required("Required.")
      .typeError("Must be a number."),
    q3p: yup
      .number()
      .min(0, "Must be positive.")
      .required("Required.")
      .typeError("Must be a number."),
    q4p: yup
      .number()
      .min(0, "Must be positive.")
      .required("Required.")
      .typeError("Must be a number."),
    q1c: yup
      .number()
      .min(0, "Must be positive.")
      .required("Required.")
      .typeError("Must be a number."),
    q2c: yup
      .number()
      .min(0, "Must be positive.")
      .required("Required.")
      .typeError("Must be a number."),
    q3c: yup
      .number()
      .min(0, "Must be positive.")
      .required("Required.")
      .typeError("Must be a number."),
    q4c: yup
      .number()
      .min(0, "Must be positive.")
      .required("Required.")
      .typeError("Must be a number."),
    lower_limit: yup
      .number()
      .min(0, "Must be positive.")
      .max(100, "Must be <100")
      .required("Required.")
      .typeError("Must be a number."),
    upper_limit: yup
      .number()
      .min(0, "Must be positive.")
      .max(100, "Must be <100")
      .required("Required.")
      .typeError("Must be a number."),
  })
  .required();

export default function EnergyDataPageClient({ session }: { session: Session }) {
  const [selectedPlace, setSelectedPlace] = useState<GooglePlacesAutocompleteOption>();
  const [userData, setUserData] = useState<any>();
  const [sliderValue, setSliderValue] = useState(50);
  const [consumption, setConsumption] = useState<number[]>([]);
  const [autocompleteReset, setAutocompleteReset] = useState(false);
  const [solarPanelTab, setSolarPanelTab] = useState(1);
  const [consumptionTab, setConsumptionTab] = useState(1);
  const [householdMembers, setHouseholdMembers] = useState(2);
  const [receiveEmails, setReceiveEmails] = useState<boolean | undefined>(undefined);

  const breakpoint = useBreakpoint();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const findSuburbName = (terms: any[]) => {
    // look for the object with NSW in terms, then suburb is the previous object
    const suburb = terms.find((term) => term.value === "NSW");
    return terms[terms.indexOf(suburb) - 1].value;
  };

  const handleSolarPanelTabChange = (index: number) => {
    setSolarPanelTab(index);
    resetField("surface_area", { defaultValue: userData.surface_area });
  };

  const handleConsumptionTabChange = (index: number) => {
    setConsumptionTab(index);
    if (index === 0) {
      resetField("q1c", { defaultValue: consumption[0] });
      resetField("q2c", { defaultValue: consumption[1] });
      resetField("q3c", { defaultValue: consumption[2] });
      resetField("q4c", { defaultValue: consumption[3] });
    }
  };

  const {
    handleSubmit,
    register,
    reset,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<EnergyDataSubmitValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: EnergyDataSubmitValues) => {
    if (!selectedPlace) {
      toast({
        title: "Error",
        description: "Please select a location.",
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    let surfaceArea = solarPanelTab === 0 ? sliderValue : data.surface_area;
    const useValue = consumptionTab === 0 ? "householdMembers" : "custom";

    let consumptionValues = transformQuarterlyConsumption({
      use: useValue,
      householdMembers: householdMembers.toString(),
      quarter1C: data.q1c,
      quarter2C: data.q2c,
      quarter3C: data.q3c,
      quarter4C: data.q4c,
    });

    const res = await Api.setUserData(session?.user?.id as string, {
      suburb: findSuburbName(selectedPlace?.value.terms),
      surface_area: surfaceArea,
      q1_w: data.q1p,
      q2_w: data.q2p,
      q3_w: data.q3p,
      q4_w: data.q4p,
      quarterly_energy_consumption: consumptionValues,
      receive_emails: (receiveEmails === undefined
        ? userData.receive_emails
        : receiveEmails
      ).toString(),
      lower_limit: data.lower_limit,
      upper_limit: data.upper_limit,
    });

    if (res.ok) {
      toast({
        title: "Success",
        description: "Your data has been updated.",
        status: "success",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    } else {
      const error = await res.json();
      toast({
        title: "Error",
        description: error.error || "Failed to update user data.",
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      const res = await Api.getUserData(
        session?.user?.id as string,
        "suburb, surface_area, q1_w, q2_w, q3_w, q4_w, quarterly_energy_consumption, receive_emails, lower_limit, upper_limit"
      );
      if (res.ok) {
        const data = (await res.json()).user.fields;
        setUserData(data);
        setConsumption(
          data.quarterly_energy_consumption.split(",").map((c: string) => parseInt(c.trim()))
        );
      }
    }

    fetchData();
  }, []); // eslint-disable-line

  useEffect(() => {
    // simulate autocomplete structure to get initial value
    if (userData) {
      setSelectedPlace({
        value: { terms: [{ value: userData.suburb }, { value: "NSW" }] },
      } as any);
    }
  }, [userData]);

  const resetForm = () => {
    reset();
    setAutocompleteReset(!autocompleteReset);
  };

  return !userData ? (
    <LoadingUI msg={"Sit tight, fetching your data..."} />
  ) : (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignContent="center"
        w="100%"
        h="auto"
        mb="4"
        overflowX="hidden"
        overflowY="hidden"
      >
        <Box borderWidth="1px" borderRadius="lg" w="95%" h="90%" p={14}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
              <Heading as="h1" size="lg">
                My Energy Data
              </Heading>
              <Text>Manage your energy data</Text>
              <Divider />
              <Stack
                display="flex"
                justify={{ base: "left", lg: "center" }}
                align={{ base: "left", lg: "center" }}
                w="100%"
                direction={["base", "sm", "md"].includes(breakpoint) ? "column" : "row"}
              >
                <Stack>
                  <Heading as="h2" size="md">
                    Location
                  </Heading>
                  <Text>Enter the location of your solar-powered home.</Text>
                </Stack>

                <Box w="100%">
                  <LoadScriptNext
                    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
                    libraries={LIBRARIES as any}
                    loadingElement={<Spinner />}
                  >
                    <Autocomplete
                      onSelect={setSelectedPlace}
                      defaultValue={userData.suburb}
                      onClose={() => {}}
                      resetTrigger={autocompleteReset}
                    />
                  </LoadScriptNext>
                </Box>
              </Stack>
              <Divider />
              <Stack>
                <Heading as="h2" size="md">
                  Solar Panel Size
                </Heading>
                <Text>Enter the size of your solar panels.</Text>
              </Stack>
              <Card w="100%" p={4} h="200px" display="flex" alignContent="center">
                <Tabs
                  variant="soft-rounded"
                  w="100%"
                  defaultIndex={1}
                  onChange={handleSolarPanelTabChange}
                >
                  <TabList w="100%">
                    <Tab w="50%">Easy</Tab>
                    <Tab w="50%">Custom</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel mt={6}>
                      <CustomSlider value={sliderValue} onChange={setSliderValue} />
                    </TabPanel>
                    <TabPanel>
                      <Heading as="h2" size="md" pb={6}>
                        Surface Area
                      </Heading>
                      <CustomFormControl
                        errors={errors}
                        name="surface_area"
                        label=""
                        defaultValue={userData.surface_area}
                        helperText=""
                        register={register}
                        inputRightAddon="m²"
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Card>
              <Divider />
              <Stack>
                <Heading as="h2" size="md">
                  Quarterly Energy Production
                </Heading>
                <Text>Enter your estimated production values over the past 4 quarters.</Text>
              </Stack>
              <Card w="100%" p={4} display="flex" alignContent="center">
                <Grid templateColumns="repeat(4, 1fr)" gap={2} mt={1} w="100%">
                  {["q1p", "q2p", "q3p", "q4p"].map((quarter, index) => (
                    <GridItem key={index}>
                      <CustomFormControl
                        errors={errors}
                        name={quarter}
                        label={`Q${index + 1}`}
                        defaultValue={userData[`q${index + 1}_w`] as string}
                        register={register}
                      />
                    </GridItem>
                  ))}
                </Grid>
              </Card>
              <Divider />
              <Stack>
                <Heading as="h2" size="md">
                  Quarterly Energy Consumption
                </Heading>
                <Text>Enter your estimated consumption values over the past 4 quarters.</Text>
              </Stack>
              <Card w="100%" p={4} h="200px" display="flex" alignContent="center">
                <Tabs
                  variant="soft-rounded"
                  w="100%"
                  defaultIndex={1}
                  onChange={handleConsumptionTabChange}
                >
                  <TabList w="100%" mb={2}>
                    <Tab w="50%">Easy</Tab>
                    <Tab w="50%">Custom</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Heading as="h2" size="md" mt={2} pb={6}>
                        Household Members
                      </Heading>
                      <Select
                        variant="outline"
                        defaultValue={householdMembers}
                        onChange={(e) => setHouseholdMembers(Number(e.target.value))}
                        name="householdMembers"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5+</option>
                      </Select>
                    </TabPanel>
                    <TabPanel>
                      <Grid templateColumns="repeat(4, 1fr)" gap={2} mt={1} w={"100%"}>
                        {["q1c", "q2c", "q3c", "q4c"].map((quarter, index) => (
                          <GridItem key={index}>
                            <CustomFormControl
                              errors={errors}
                              name={quarter}
                              label={`Q${index + 1}`}
                              defaultValue={consumption[index].toString()}
                              register={register}
                            />
                          </GridItem>
                        ))}
                      </Grid>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Card>
              <Divider />
              <Stack>
                <Heading as="h2" size="md">
                  Notifications
                </Heading>
                <Text>
                  Enter the limits to which you wish to be notified for energy consumption and
                  production thresholds.
                </Text>
              </Stack>
              <Card w="100%" p={4} display="flex" alignContent="center">
                <Checkbox
                  id="email-alerts"
                  defaultChecked={userData.receive_emails === "true"}
                  size="lg"
                  onChange={(e) => setReceiveEmails(e.target.checked)}
                >
                  Enable email alerts?
                </Checkbox>
                <Grid templateColumns="repeat(2, 1fr)" gap={2} mt={4} w="100%">
                  {["Lower", "Upper"].map((limit, index) => (
                    <GridItem key={index}>
                      <CustomFormControl
                        errors={errors}
                        name={`${limit.toLowerCase()}_limit`}
                        defaultValue={userData[`${limit.toLowerCase()}_limit`]}
                        label={`${limit} limit`}
                        register={register}
                      />
                    </GridItem>
                  ))}
                </Grid>
              </Card>
              <ButtonGroup mt={2}>
                <Button colorScheme="red" w="100%" onClick={onOpen}>
                  Reset
                </Button>
                <Button
                  type="submit"
                  w="100%"
                  isLoading={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                >
                  Update Details
                </Button>
              </ButtonGroup>
            </Stack>
          </form>
        </Box>
      </Box>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef as any} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reset Changes
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you wish to reset your changes?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef as any} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                ml={3}
              >
                Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
