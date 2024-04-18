"use client";

import React, { useState } from "react";
import { Text, Box, Flex, Grid, GridItem, useToast, Switch, Select } from "@chakra-ui/react";
import CustomFormControl from "./AuthPages/CustomFormControl";
import { useForm } from "@saas-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Session } from "@src/interfaces";
import { Api } from "@utils/Api";
import transformQuarterlyConsumption from "@src/utils/transformQuarterlyConsumption";

interface onEnergyConsumptionChangeType {
  // eslint-disable-next-line
  (newState: Partial<surfaceAreaData>): void;
}

interface CustomUserDataContainerProps {
  session: Session;
  onEnergyConsumptionChange: onEnergyConsumptionChangeType;
}

interface surfaceAreaData {
  surface_area1?: string;
  surface_area2?: string;
  surface_area3?: string;
  surface_area4?: string;
  householdMembers?: number;
}

const surfaceAreaSchema = yup.object({
  surface_area: yup.string().required("Surface area is required."),
  householdMembers: yup.number().optional(),
});

const SliderToggle: React.FC<CustomUserDataContainerProps> = ({
  session,
  onEnergyConsumptionChange,
}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const toast = useToast();

  const handleSwitchChange = (event: {
    // eslint-disable-next-line
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setIsSwitchOn(event.target.checked);
    onEnergyConsumptionChange({
      householdMembers: undefined,
      surface_area1: undefined,
      surface_area2: undefined,
      surface_area3: undefined,
      surface_area4: undefined,
    });
  };

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    if (name.startsWith("surface_area")) {
      onEnergyConsumptionChange({
        householdMembers: undefined,
        [name]: value,
      });
    } else {
      onEnergyConsumptionChange({
        surface_area1: undefined,
        surface_area2: undefined,
        surface_area3: undefined,
        surface_area4: undefined,
        [name]: value,
      });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(surfaceAreaSchema),
  });

  const onUserSubmit = async (data: any) => {
    const consumption = transformQuarterlyConsumption(data);
    const info = { quarterly_energy_consumption: consumption };

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
        }
      });
    }
  };

  return (
    <Box my={"auto"} width={"100%"} mx={"auto"} height="100%">
      <form onSubmit={handleSubmit(onUserSubmit)}>
        <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={"5%"}>
          <GridItem>
            <Text fontSize="md">
              <b>What is your energy consumption?</b>
            </Text>
            <Text fontSize="sm">
              Toggle the switch if you are unsure to estimate energy use from household size
            </Text>
          </GridItem>
          <GridItem display="flex" alignItems="center" justifyContent="flex-end">
            <Switch size="md" isChecked={isSwitchOn} onChange={handleSwitchChange}></Switch>
          </GridItem>
        </Grid>

        <Flex justify="center" align="center" gap={4}>
          {isSwitchOn ? (
            <Select
              {...register("householdMembers")}
              variant="outline"
              placeholder="Household members"
              onChange={handleInputChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </Select>
          ) : (
            <Grid templateColumns="repeat(4, 1fr)" gap={2} mt={3} w={"100%"}>
              <GridItem>
                <CustomFormControl
                  errors={errors}
                  name="surface_area1"
                  label="Quarter 1"
                  placeholder={"1388"}
                  register={register}
                  onChange={handleInputChange}
                />
              </GridItem>
              <GridItem>
                <CustomFormControl
                  errors={errors}
                  name="surface_area2"
                  label="Quarter 2"
                  placeholder={"1331"}
                  register={register}
                  onChange={handleInputChange}
                />
              </GridItem>
              <GridItem>
                <CustomFormControl
                  errors={errors}
                  name="surface_area3"
                  label="Quarter 3"
                  placeholder={"1681"}
                  register={register}
                  onChange={handleInputChange}
                />
              </GridItem>
              <GridItem>
                <CustomFormControl
                  errors={errors}
                  name="surface_area4"
                  label="Quarter 4"
                  placeholder={"1262"}
                  register={register}
                  onChange={handleInputChange}
                />
              </GridItem>
            </Grid>
          )}
        </Flex>
      </form>
    </Box>
  );
};

export default SliderToggle;
