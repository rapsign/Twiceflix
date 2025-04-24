import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Flex,
  Text,
  Link as ChakraLink,
  Box,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { TextLogo } from "../Logo";

const links = ["Home", "Videos", "Playlist", "About"];

const MobileDrawer = ({ isOpen, onClose }) => (
  <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
    <DrawerOverlay />
    <DrawerContent bg="#0f0f0f">
      <Box width="40%" height="auto" p={4}>
        <TextLogo />
      </Box>
      <DrawerCloseButton color="white" />
      <DrawerBody>
        <Flex direction="column">
          {links.map((item) => (
            <ChakraLink
              key={item}
              as={Link}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={onClose}
              _hover={{ textDecoration: "none" }}
              mb={4}
            >
              <Text fontSize="lg" color="white" _hover={{ color: "red" }}>
                {item}
              </Text>
            </ChakraLink>
          ))}
        </Flex>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

export default MobileDrawer;
