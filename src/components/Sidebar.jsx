import React, { useState } from "react";
import {
  Box,
  VStack,
  Link,
  Text,
  Icon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { signOut } from "../firebase/firebase";
import { FaTachometerAlt, FaVideo, FaList } from "react-icons/fa";
import { FiLogOut, FiMenu } from "react-icons/fi";

const Sidebar = ({ onLogout }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        w={{ base: "full", md: "250px" }}
        h="100vh"
        bg="gray.800"
        color="white"
        p={4}
        pos="fixed"
        display={{ base: "none", md: "block" }}
      >
        <VStack align="start" spacing={4}>
          <Text fontSize="xl" fontWeight="bold" color="red">
            TWICEFLIX
          </Text>
          <Link
            as={RouterLink}
            to="/admin"
            fontSize="lg"
            display="flex"
            alignItems="center"
            _hover={{ textDecoration: "none", color: "red" }}
          >
            <Icon as={FaTachometerAlt} mr={2} />
            Dashboard
          </Link>
          <Link
            as={RouterLink}
            to="/admin/videos"
            fontSize="lg"
            display="flex"
            alignItems="center"
            _hover={{ textDecoration: "none", color: "red" }}
          >
            <Icon as={FaVideo} mr={2} />
            Videos
          </Link>
          <Link
            as={RouterLink}
            to="/admin/playlists"
            fontSize="lg"
            display="flex"
            alignItems="center"
            _hover={{ textDecoration: "none", color: "red" }}
          >
            <Icon as={FaList} mr={2} />
            Playlists
          </Link>
          <Link
            as={RouterLink}
            to="#"
            fontSize="lg"
            display="flex"
            alignItems="center"
            onClick={onLogout}
            _hover={{ textDecoration: "none", color: "red" }}
          >
            <Icon as={FiLogOut} mr={2} />
            Logout
          </Link>
        </VStack>
      </Box>

      <IconButton
        aria-label="Open Menu"
        icon={
          <Flex align="center" justify="center" h="full" w="full">
            <FiMenu />
          </Flex>
        }
        display={{ base: "block", md: "none" }}
        onClick={onOpen}
        bg="gray.800"
        color="white"
        pos="fixed"
        top={4}
        left={4}
        zIndex="overlay"
      />

      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent bg="gray.800" color="white">
          <DrawerCloseButton />
          <DrawerHeader>
            <Text fontSize="xl" fontWeight="bold" color="red">
              TWICEFLIX
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <Link
                as={RouterLink}
                to="/admin"
                fontSize="lg"
                display="flex"
                alignItems="center"
                _hover={{ textDecoration: "none", color: "red" }}
              >
                <Icon as={FaTachometerAlt} mr={2} />
                Dashboard
              </Link>
              <Link
                as={RouterLink}
                to="/admin/videos"
                fontSize="lg"
                display="flex"
                alignItems="center"
                _hover={{ textDecoration: "none", color: "red" }}
              >
                <Icon as={FaVideo} mr={2} />
                Videos
              </Link>
              <Link
                as={RouterLink}
                to="/admin/playlists"
                fontSize="lg"
                display="flex"
                alignItems="center"
                _hover={{ textDecoration: "none", color: "red" }}
              >
                <Icon as={FaList} mr={2} />
                Playlists
              </Link>
              <Link
                as={RouterLink}
                to="#"
                fontSize="lg"
                display="flex"
                alignItems="center"
                onClick={onLogout}
                _hover={{ textDecoration: "none", color: "red" }}
              >
                <Icon as={FiLogOut} mr={2} />
                Logout
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
