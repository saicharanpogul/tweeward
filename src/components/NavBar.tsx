import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import ConnectWalletButton from "./ConnectWalletButton";

const NavBar = () => {
  const router = useRouter();
  const [isLargerThan678] = useMediaQuery("(min-width: 678px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  return (
    <Flex
      justifyContent={"center"}
      bg={"rgba(30, 30, 30, 0.4)"}
      backdropFilter="auto"
      backdropBlur="4px"
      pos="fixed"
      w="full"
      top="0"
      zIndex={1}
    >
      <Container maxW="container.xl">
        <Box>
          <Flex
            flexDirection={"row"}
            justifyContent="space-between"
            alignItems={"center"}
            paddingY={4}
          >
            <Box onClick={() => router.replace("/")} cursor="pointer">
              <Text
                color="primary.500"
                fontSize={"20"}
                fontWeight="bold"
                userSelect={"none"}
              >
                Tweeward
              </Text>
            </Box>
            <Flex flex="1" justifyContent={"flex-end"} mr="4"></Flex>
            <ConnectWalletButton />
          </Flex>
        </Box>
      </Container>
      <Drawer
        isOpen={isOpen}
        placement="top"
        onClose={onClose}
        // @ts-ignore
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color={"text.500"} />
          <DrawerHeader display="flex" bg="background.100" w="full">
            <Box>
              <Text></Text>
            </Box>
          </DrawerHeader>
          <DrawerBody bg="background.100">
            <Text
              color={router.pathname === "/profile" ? "text.900" : "gray.500"}
              p="4"
              cursor={"pointer"}
              userSelect="none"
              onClick={() => {
                router.push("/profile");
                onClose();
              }}
            >
              Profile
            </Text>
            <Text
              color={router.pathname === "/" ? "text.900" : "gray.500"}
              p="4"
              cursor={"pointer"}
              userSelect="none"
              onClick={() => {
                router.push("/");
                onClose();
              }}
            >
              Explore
            </Text>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default NavBar;
