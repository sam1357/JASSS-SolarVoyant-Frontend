"use client";

import React, { useState } from "react";
import {
  Text,
  Box,
  Button,
  Flex,
  Stack,
  useToast,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  ButtonGroup,
} from "@chakra-ui/react";
import CustomFormControl from "./AuthPages/CustomFormControl";
import { useForm } from "@saas-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Session } from "@src/interfaces";
import { Api } from "@utils/Api";
import CustomSlider from "./CustomSlider";
import getSliderLabelByValue from "@src/utils/getSliderLabelByValue";

interface CustomUserDataContainerProps {
  session: Session;
  heading: string;
  subheading: string;
  onComplete: () => void;
  setStep: (step: number) => void; // eslint-disable-line
}

const surfaceAreaSchema = yup.object({
  surface_area: yup.string().required("Surface area is required."),
});

const SliderFieldToggle: React.FC<CustomUserDataContainerProps> = ({
  session,
  heading,
  subheading,
  onComplete,
  setStep,
}) => {
  const toast = useToast();
  const [sliderValue, setSliderValue] = useState(50);
  const [activeTab, setActiveTab] = useState(0);

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors, isSubmitting: isSubmittingUser },
  } = useForm({
    resolver: yupResolver(surfaceAreaSchema),
  });

  const onUserSubmit = async (data: { surface_area: string }) => {
    let info: { surface_area: string } = { surface_area: "" };
    if (activeTab === 0) {
      info = { surface_area: `${getSliderLabelByValue(sliderValue)}` };
    } else {
      info = { surface_area: data.surface_area };
    }

    if (session?.user?.email && session?.user?.id) {
      await Api.setUserData(session.user.id, info).then(async (res) => {
        if (res?.status !== 200) {
          toast({
            title: "Error",
            description: (await res.json()).error,
            status: "error",
            position: "top",
            duration: 4000,
            isClosable: true,
          });
        } else {
          onComplete();
        }
      });
    }
  };

  return (
    <Box my={"auto"} width={"100%"} mx={"auto"} height="100%">
      <form onSubmit={handleSubmitUser(onUserSubmit)}>
        <Stack direction="column" gap={4} my={4} textAlign="left">
          <Text fontSize="xl" fontWeight={600}>
            {heading}
          </Text>
          <Text fontSize="lg">{subheading}</Text>
        </Stack>

        <Flex justify="center" align="center" gap={4} mt={8}>
          <Tabs variant="soft-rounded" w="100%" onChange={setActiveTab}>
            <TabList w="100%" mb={6}>
              <Tab w="50%">Easy</Tab>
              <Tab w="50%">Custom</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <CustomSlider value={sliderValue} onChange={setSliderValue} />
              </TabPanel>
              <TabPanel>
                <CustomFormControl
                  errors={userErrors}
                  name="surface_area"
                  label=""
                  defaultValue={"42"}
                  helperText=""
                  register={registerUser}
                  inputRightAddon="m²"
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>

        <Stack justify="center" align="center" gap={4} mt={8}>
          <ButtonGroup
            width={{ base: "100%", sm: "100%", md: "50%", lg: "20%" }}
            justifyContent="center"
          >
            <Button w="40%" onClick={() => setStep(0)} colorScheme="gray">
              Back
            </Button>
            <Button
              isLoading={isSubmittingUser}
              type="submit"
              w="60%"
              onClick={handleSubmitUser(onUserSubmit)}
            >
              Update Details
            </Button>
          </ButtonGroup>
        </Stack>
      </form>
    </Box>
  );
};

export default SliderFieldToggle;
