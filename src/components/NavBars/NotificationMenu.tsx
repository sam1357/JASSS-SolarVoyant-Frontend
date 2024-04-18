"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Session } from "@src/interfaces";
import { colors } from "@src/styles/colours";
import { Api } from "@src/utils/Api";
import { useEffect, useState } from "react";
import { GrNotification } from "react-icons/gr";

interface NotificationMenuProps {
  session: Session;
}

export default function NotificationMenu({ session }: NotificationMenuProps) {
  const [notifications, setNotifications] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Function to fetch notifications from the server
    async function fetchNotifications() {
      const res = await Api.getUserNotifications(session?.user?.id as string);
      if (res.status === 200) {
        const newNotifs = (await res.json()).user.fields.notifications;
        setNotifications((prevNotifications) => {
          if (prevNotifications.length !== newNotifs.length) {
            toast({
              description: "You've got a new notification!",
              status: "info",
              position: "top-right",
              duration: 3000,
              isClosable: true,
            });
          }
          return newNotifs;
        });
      }
    }

    // Set up interval to fetch notifications periodically
    const interval = setInterval(fetchNotifications, 30000);

    fetchNotifications();
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  async function clearNotifications() {
    setIsLoading(true);
    const res = await Api.deleteUserNotifications(session?.user?.id as string);

    if (res.status === 200) {
      toast({
        title: "Notifications Cleared",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNotifications([]);
      onClose();
    } else {
      toast({
        title: "Failed to clear notifications",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  }

  return (
    <>
      <Tooltip label="Shows notifications">
        <Box position="relative">
          <IconButton
            aria-label="Notifications"
            onClick={onOpen}
            icon={<GrNotification />}
            colorScheme="gray"
            size="lg"
            variant="ghost"
          />
          {notifications.length > 0 && (
            <Badge
              borderRadius="full"
              px="2"
              colorScheme="red"
              position="absolute"
              top="2px"
              right="-2px"
            >
              {notifications.length}
            </Badge>
          )}
        </Box>
      </Tooltip>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Notifications</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
              // Show a message if there are no notifications
              notifications.length === 0 && (
                <Card variant="elevated" p={2}>
                  No notifications
                </Card>
              )
            }
            {notifications.map((notification, index) => (
              <Card
                variant="elevated"
                borderLeft={`5px solid ${colors.primary[500]}`}
                key={index}
                p={2}
                mb={2}
              >
                {notification}
              </Card>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={notifications.length === 0}
              onClick={() => clearNotifications()}
              colorScheme="red"
              isLoading={isLoading}
            >
              Clear All
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
