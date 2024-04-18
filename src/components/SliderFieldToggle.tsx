"use client";

import React, { useState } from "react";
import { Text, Box, Button, Flex, Grid, GridItem, Stack, useToast, Switch } from "@chakra-ui/react";
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
}

const surfaceAreaSchema = yup.object({
  surface_area: yup.string().required("Surface area is required."),
});

const SliderFieldToggle: React.FC<CustomUserDataContainerProps> = ({
  session,
  heading,
  subheading,
  onComplete,
}) => {
  const toast = useToast();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  const handleSwitchChange = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors, isSubmitting: isSubmittingUser },
  } = useForm({
    resolver: yupResolver(surfaceAreaSchema),
  });

  const onUserSubmit = async () => {
    const info = { surface_area: `${getSliderLabelByValue(sliderValue)}` };

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
          toast({
            title: "Success",
            description: `Changes will be applied on next sign in`,
            status: "success",
            position: "top",
            duration: 4000,
            isClosable: true,
          });
          onComplete();
        }
      });
    }
  };

  return (
    <Box my={"auto"} width={"100%"} mx={"auto"} height="100%">
      <form onSubmit={handleSubmitUser(onUserSubmit)}>
        <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={8}>
          <GridItem>
            <Text fontSize="md">
              <b>{heading}</b>
            </Text>
            <Text fontSize="sm">{subheading}</Text>
          </GridItem>
          <GridItem display="flex" alignItems="center" justifyContent="flex-end">
            <Switch size="md" isChecked={isSwitchOn} onChange={handleSwitchChange}></Switch>
          </GridItem>
        </Grid>

        <Flex justify="center" align="center" gap={4} mt={8}>
          {isSwitchOn ? (
            <CustomSlider value={sliderValue} onChange={setSliderValue}></CustomSlider>
          ) : (
            <Grid templateColumns="75fr 25fr" gap={2} mt={8} w={"100%"}>
              <GridItem w={"100%"}>
                <CustomFormControl
                  errors={userErrors}
                  name="surface_area"
                  label=""
                  defaultValue={"1.8"}
                  helperText=""
                  register={registerUser}
                />
              </GridItem>
              <GridItem
                display="flex"
                alignItems="center"
                height="100%"
                justifyContent={"flex-start"}
              >
                <Text>
                  <b>m²</b>
                </Text>
              </GridItem>
            </Grid>
          )}
        </Flex>

        <Stack justify="center" align="center" gap={4} mt={20}>
          <Button
            isLoading={isSubmittingUser}
            type="submit"
            onClick={handleSubmitUser(onUserSubmit)}
            w={"100%"}
          >
            Update Details
          </Button>

          <Text size={"xs"} color={"Primary"}>
            Back
          </Text>
        </Stack>
      </form>
    </Box>
  );
};

export default SliderFieldToggle;
