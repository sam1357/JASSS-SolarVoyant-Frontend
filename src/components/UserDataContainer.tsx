"use client";

import React from "react";
import { Text, Box, BoxProps, Button, Divider, Flex, FormControl, Grid, GridItem, IconButton, Input, Stack, Tooltip, useColorMode, useToast } from "@chakra-ui/react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { register } from "module";
import CustomFormControl from "./AuthPages/CustomFormControl";
import { Persona, PersonaAvatar, useForm } from "@saas-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Session } from "@src/interfaces";
import { Api } from "@utils/Api";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

interface CustomUserDataContainerProps {
    session: Session;
}

interface UserEmailFormData {
  email: string;
  username: string;
}

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

const userSchema = yup
  .object({
    email: yup
    .string()
    .required("Email is required.")
    .email("Please provide a valid email."),
    username: yup
      .string()
      .required("Username is required.")
      .matches(/^[\w]+$/, "Username can only contain alphanumeric characters"),
  })

const passwordSchema = yup
  .object({
    password: yup
      .string()
      .required("Password is required.")
      .min(6, "Password must contain at least 6 characters."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match.")
      .required("Please re-type your password."),
  });

function getSchema(inputType: string): yup.ObjectSchema<UserEmailFormData | PasswordFormData>  {
  return inputType === "userSchema" ? userSchema : passwordSchema;
}

const UserDataContainer: React.FC<CustomUserDataContainerProps> = ({ session }) => {
  const toast = useToast();

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors, isSubmitting: isSubmittingUser },
    reset: resetUser,
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });
  
  const onUserSubmit = async (data: (UserEmailFormData)) => {
    const info = { username: data.username, email: data.email };
    const description = `Username: ${data.username}, Email: ${data.email}`;

    toast({
      title: "Not implemented yet.",
      description: description,
      status: "error",
      position: "top",
      duration: 4000,
      isClosable: true,
    });
  }

  const onPasswordSubmit = async (data: (PasswordFormData)) => {
    const info = { password: data.password, confirmPassword: data.confirmPassword };

    toast({
      title: "Not implemented yet.",
      description: "info.password",
      status: "error",
      position: "top",
      duration: 4000,
      isClosable: true,
    });
  }

  return (
    <Box w='90%' p={4} borderWidth='1px' borderRadius='lg' mx={'auto'}>
        <Stack width={"95%"} mt={2} mx={"auto"} spacing={1}>
        <Text fontSize="xl"><b>Account Details</b></Text>
        <Text fontSize="md">Manage your solarvoyant profile</Text>
        <Divider mt={2}/>
      </Stack>
      <Box width={"95%"} mx={"auto"}>
        <Flex align="center" gap={4} mt={8}>
          <Box>
            <Persona>
                <PersonaAvatar
                name={session?.user?.name}
                src={session?.user?.image}
                size="lg"
                />
            </Persona>
          </Box>
          <Box>
            <Text fontSize="md"><b>Profile Picture</b></Text>
            <Text fontSize="sm">PNG, JPG max size 5MB</Text>
          </Box>
        </Flex>
        <form onSubmit={handleSubmitUser(onUserSubmit)}>
            <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={8}>
                <GridItem>
                    <Text fontSize="md"><b>Email Address</b></Text>
                    <Text fontSize="sm">Enter your email address</Text>
                </GridItem>
                <GridItem>
                    <CustomFormControl
                    errors={userErrors}
                    name="email"
                    label=""
                    defaultValue={session?.user?.email}
                    helperText=""
                    register={registerUser}
                    />
                </GridItem>

                <GridItem>
                    <Text fontSize="md"><b>Username</b></Text>
                    <Text fontSize="sm">Enter your username</Text>
                </GridItem>
                <GridItem>
                    <CustomFormControl
                    errors={userErrors}
                    name="username"
                    label=""
                    defaultValue={session?.user?.name}
                    helperText=""
                    register={registerUser}
                    />
                </GridItem>
            </Grid>

            <Flex justify="right" align="center" gap={4} mt={8}>
            <Button
                isLoading={isSubmittingPassword}
                type="submit"
                onClick={handleSubmitUser(onUserSubmit)}
            >
                Update Details
            </Button>
            </Flex>
        </form>

        <Stack width={"100%"} mt={2} mx={"auto"} spacing={1}>
          <Text fontSize="md"><b>Change Password</b></Text>
          <Text fontSize="sm">You can change your password if you have forgotten it.</Text>
        </Stack>

        <form onSubmit={handleSubmitUser(onUserSubmit)}>
            <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={8}>
                <GridItem>
                  <Text fontSize="md"><b>Current Password</b></Text>
                  <Text fontSize="sm">Enter your current password</Text>
                </GridItem>
                <GridItem>
                    <CustomFormControl
                    errors={passwordErrors}
                    name="password"
                    label=""
                    defaultValue=""
                    helperText=""
                    register={registerPassword}
                    />
                </GridItem>

                <GridItem>
                  <Text fontSize="md"><b>New Password</b></Text>
                  <Text fontSize="sm">Enter your new password</Text>
                </GridItem>
                <GridItem>
                    <CustomFormControl
                    errors={passwordErrors}
                    name="confirmPassword"
                    label=""
                    defaultValue=""
                    helperText=""
                    register={registerPassword}
                    />
                </GridItem>
            </Grid>

            <Flex justify="right" align="center" gap={4} mt={8}>
            <Button
                isLoading={isSubmittingPassword}
                type="submit"
                onClick={handleSubmitUser(onUserSubmit)}
            >
                Change Password
            </Button>
            </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default UserDataContainer;
