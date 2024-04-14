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
} from "@chakra-ui/react";
import CustomFormControl from "./AuthPages/CustomFormControl";
import { PasswordInput, Persona, PersonaAvatar, useForm } from "@saas-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Session } from "@src/interfaces";
import { Api } from "@utils/Api";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CustomUserDataContainerProps {
  session: Session;
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

const UserDataContainer: React.FC<CustomUserDataContainerProps> = ({
  session,
}) => {
  const router = useRouter();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors, isSubmitting: isSubmittingUser },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm({
    resolver: yupResolver(passwordSchema),
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

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (session?.user?.email) {
      await Api.changePassword(
        session.user.email,
        data.currentPassword,
        data.newPassword
      ).then(async (res) => {
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
            description: "Password was successfully changed",
            status: "success",
            position: "top",
            duration: 4000,
            isClosable: true,
          });
        }
      });
    }
  };

  const onDeleteAccount = async () => {
    if (session?.user?.id) {
      await Api.deleteUser(session.user.id).then(async (res) => {
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
          await signOut({ callbackUrl: "/" });
          toast({
            title: "Account Deleted",
            description: "Your account has been successfully deleted.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }
      });
    }
  };

  return (
    <Box w="80%" p={4} borderWidth="1px" borderRadius="lg" mx={"auto"} mt={"10"}>
      <Stack width={"95%"} mt={2} mx={"auto"} spacing={1}>
        <Text fontSize="xl">
          <b>Account Details</b>
        </Text>
        <Text fontSize="md">Manage your SolarVoyant profile</Text>
        <Divider mt={2} />
      </Stack>
      <Box
        width={"95%"}
        mx={"auto"}
        alignItems="center"
        justifyContent="center"
      >
        <form onSubmit={handleSubmitUser(onUserSubmit)}>
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
              <Text fontSize="xl">
                {session?.user?.name}
              </Text>
              <Text fontSize="md">{session?.user?.email}</Text>
            </Box>
          </Flex>

          <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={8}>
            <GridItem>
              <Text fontSize="md">
                <b>Username</b>
              </Text>
              <Text fontSize="sm">Enter your new username</Text>
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
              isLoading={isSubmittingUser}
              type="submit"
              onClick={handleSubmitUser(onUserSubmit)}
            >
              Update Details
            </Button>
          </Flex>
        </form>

        <Stack width={"100%"} mt={2} mx={"auto"} spacing={1}>
      <Text fontSize="md">
        <b>You can change your existing password below.</b>
      </Text>
      <Text fontSize="sm">
        If you have forgotten your password, please {' '}
        <Link
          color="blue.500"
          fontWeight="semibold"
          onClick={() => router.push('/forgotPassword')}
          cursor="pointer"
        >
          click here
        </Link>.
      </Text>
        </Stack>

        <form onSubmit={handleSubmitPassword(onPasswordSubmit)}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={8}>
            <GridItem>
              <Text fontSize="md">
                <b>Current Password</b>
              </Text>
              <Text fontSize="sm">Enter your current password</Text>
            </GridItem>
            <GridItem>
              <CustomFormControl
                errors={passwordErrors}
                name="currentPassword"
                label=""
                defaultValue=""
                helperText=""
                register={registerPassword}
                inputComponent={PasswordInput}
              />
            </GridItem>

            <GridItem>
              <Text fontSize="md">
                <b>New Password</b>
              </Text>
              <Text fontSize="sm">Enter your new password</Text>
            </GridItem>
            <GridItem>
              <CustomFormControl
                errors={passwordErrors}
                name="newPassword"
                label=""
                defaultValue=""
                helperText=""
                register={registerPassword}
                inputComponent={PasswordInput}
              />
            </GridItem>
          </Grid>

          <Flex justify="right" align="center" gap={4} mt={8}>
            <Button
              isLoading={isSubmittingPassword}
              type="submit"
              onClick={handleSubmitPassword(onPasswordSubmit)}
            >
              Change Password
            </Button>
          </Flex>
        </form>

        <Stack width={"100%"} mt={4} mb={4} mx={"auto"} spacing={4}>
          <Divider mt={5} />
          <Text
            fontSize="md"
            fontWeight="bold"
            color="red.500"
            cursor="pointer"
            _hover={{
              textDecoration: "underline",
            }}
            onClick={() => setIsOpen(true)}
          >
            Delete Account
          </Text>

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Account
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? This action will permanently delete your account
                  and all your data. This action cannot be undone.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={onDeleteAccount} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserDataContainer;
