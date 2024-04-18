"use client";

import React, { useRef, useState } from "react";
import {
  Text,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Stack,
  useToast,
  Switch,
  Select,
} from "@chakra-ui/react";
import CustomFormControl from "./AuthPages/CustomFormControl";
import { useForm } from "@saas-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Session } from "@src/interfaces";
import { Api } from "@utils/Api";
import transformQuarterlyConsumption from "@src/utils/transformQuarterlyConsumption";


interface CustomUserDataContainerProps {
    session: Session;
    onEnergyGenerationChange: (newState: Partial<SurfaceAreaData>) => void;
  }
  
  interface SurfaceAreaData {
    q1?: string;
    q2?: string;
    q3?: string;
    q4?: string;
  }
  
  const surfaceAreaSchema = yup.object({
    q1: yup.string(),
    q2: yup.string(),
    q3: yup.string(),
    q4: yup.string(),
  });
  
  const SliderOptionalToggle: React.FC<CustomUserDataContainerProps> = ({
    session, onEnergyGenerationChange
  }) => {
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const toast = useToast();
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm({
      resolver: yupResolver(surfaceAreaSchema),
    });
  
    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      setIsSwitchOn(isChecked);
      const newValues = isChecked ? "-1" : "";  // Set values to "-1" if switch is on
      onEnergyGenerationChange({
        q1: newValues,
        q2: newValues,
        q3: newValues,
        q4: newValues,
      });
    };
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      onEnergyGenerationChange({
        [name]: value
      });
    };
  
    const onUserSubmit = async (data: SurfaceAreaData) => {
      const info = {
        Q1_w: data.q1 || '',
        Q2_w: data.q2 || '',
        Q3_w: data.q3 || '',
        Q4_w: data.q4 || ''
      };
  
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
              description: "Changes will be applied on next sign in",
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
      <Box my="auto" width="100%" mx="auto" height="100%">
        <form onSubmit={handleSubmit(onUserSubmit)}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6} mt="5%">
            <GridItem>
              <Text fontSize="md"><b>What is your energy generation?</b></Text>
              <Text fontSize="sm">Toggle the switch to opt for default values</Text>
            </GridItem>
            <GridItem display="flex" alignItems="center" justifyContent="flex-end">
              <Switch size="md" isChecked={isSwitchOn} onChange={handleSwitchChange} />
            </GridItem>
          </Grid>
  
          <Flex justify="center" align="center" gap={4}>
            {isSwitchOn ? (
              <Text>Default values selected</Text>
            ) : (
              <Grid templateColumns="repeat(4, 1fr)" gap={2} mt={3} w="100%">
                {["q1", "q2", "q3", "q4"].map((quarter, index) => (
                  <GridItem key={index}>
                    <CustomFormControl
                      errors={errors}
                      name={quarter}
                      label={`Quarter ${index + 1}`}
                      placeholder={"Enter value"}
                      register={register}
                      onChange={handleInputChange}
                    />
                  </GridItem>
                ))}
              </Grid>
            )}
          </Flex>
        </form>
      </Box>
    );
  };
  
  export default SliderOptionalToggle;
  