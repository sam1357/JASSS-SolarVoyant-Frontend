"use client";

import React, { useRef, useState } from "react";
import {
  Text,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Stack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Link,
  Switch,
  Slider,
} from "@chakra-ui/react";
import CustomFormControl from "./AuthPages/CustomFormControl";
import { PasswordInput, Persona, PersonaAvatar, useForm } from "@saas-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Session } from "@src/interfaces";
import { Api } from "@utils/Api";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import CustomSlider from "./CustomSlider";

interface CustomUserDataContainerProps {
  session: Session;
  heading: string;
  subheading: string;
}

interface UserEmailFormData {
  username: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
}

const userSchema = yup.object({
  username: yup
    .string()
    .required("Username is required.")
    .matches(/^[\w]+$/, "Username can only contain alphanumeric characters"),
});

const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must contain at least 6 characters."),
  newPassword: yup.string().required("Please re-type your password."),
});

const SliderFieldToggle: React.FC<CustomUserDataContainerProps> = ({ session, heading, subheading }) => {
  const router = useRouter();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const handleSwitchChange = () => {
    setIsSwitchOn(!isSwitchOn);

    if (!isSwitchOn) {
        console.log("Switch turned on!")
    }
  }

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors, isSubmitting: isSubmittingUser },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const onUserSubmit = async (data: UserEmailFormData) => {
    const info = { username: data.username };

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
//   What is the surface area of your solar panels?
// Toggle the switch if you are unsure to select from common solar panel sizes
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
              <CustomSlider></CustomSlider>
            ) : (
              <CustomFormControl
              errors={userErrors}
              name="username"
              label=""
              defaultValue={session?.user?.name}
              helperText=""
              register={registerUser}
            />
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

            <Text size={"xs"} color={"Primary"}><b>Back</b></Text>

          </Stack>
        </form>
      </Box>
  );
};

export default SliderFieldToggle;
 