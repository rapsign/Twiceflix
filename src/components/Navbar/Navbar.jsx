import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import SearchBox from "./SearchBox";
import MenuLinks from "./MenuLinks";
import MobileDrawer from "./MobileDrawer";
import useScrollToggle from "../../hooks/useScrollToggle";
import { TextLogo } from "../Logo";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isScrolled = useScrollToggle();

  return (
    <Box
      bg={isScrolled ? "rgba(0, 0, 0, 0.8)" : "transparent"}
      p={{ base: 2, md: 4 }}
      color="white"
      position="fixed"
      width="100%"
      top="0"
      zIndex="1000"
      transition="background-color 0.3s ease"
    >
      <Box
        display={{ base: "flex", md: "none" }}
        justifyContent="space-between"
        width="100%"
      >
        <Box width="30%" height="auto" alignSelf="center">
          <TextLogo />
        </Box>
        <Flex align="center" gap={2} ml="auto">
          <SearchBox />
          <IconButton
            aria-label="Menu"
            icon={<FaBars />}
            variant="unstyled"
            right="-10%"
            fontSize="lg"
            onClick={onOpen}
          />
        </Flex>
      </Box>

      <Grid
        as="nav"
        templateColumns="1fr 3fr 1fr"
        gap={4}
        alignItems="center"
        display={{ base: "none", md: "grid" }}
      >
        <GridItem>
          <TextLogo Width="50%" />
        </GridItem>
        <GridItem display="flex" justifyContent="center" alignItems="center">
          <MenuLinks />
        </GridItem>
        <GridItem display="flex" justifyContent="flex-end" alignItems="center">
          <Flex align="center" gap={2}>
            <SearchBox />
          </Flex>
        </GridItem>
      </Grid>

      <MobileDrawer isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Navbar;
