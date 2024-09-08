import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { FaSearch, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolling, setScrolling] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <Box
      bg={scrolling ? "rgba(0, 0, 0, 0.8)" : "transparent"}
      px={4}
      py={2}
      color="white"
      position="fixed"
      width="100%"
      top="0"
      zIndex="1000"
      transition="background-color 0.3s ease"
    >
      <Flex align="center" justify="space-between" wrap="wrap">
        <Text
          fontSize={{ base: "lg", md: "xl", lg: "4xl" }}
          fontWeight="bold"
          color="red"
        >
          TWICEFLIX
        </Text>
        <Flex align="center" display={{ base: "none", md: "flex" }} mx={4}>
          <Link to="/">
            <Text
              mx={2}
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: "red" }}
            >
              Home
            </Text>
          </Link>
          <Link to="/videos">
            <Text
              mx={2}
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: "red" }}
            >
              Videos
            </Text>
          </Link>
          <Link to="/playlist">
            <Text
              mx={2}
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: "red" }}
            >
              Playlist
            </Text>
          </Link>
          <Link to="/about">
            <Text
              mx={2}
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ color: "red" }}
            >
              About
            </Text>
          </Link>
        </Flex>
        <Flex align="center">
          {showSearch && (
            <Input
              placeholder="Search..."
              variant="outline"
              bg="transparent"
              color="white"
              size="sm"
              width={{ base: "150px", md: "300px" }}
              rounded="full"
              borderColor="white"
              value={searchQuery}
              onChange={handleSearchChange}
              ml={2}
            />
          )}
          <IconButton
            aria-label="Search"
            icon={<FaSearch />}
            variant="unstyled"
            fontSize={{ base: "sm", md: "md" }}
            onClick={toggleSearch}
            display="flex"
            _hover={{ color: "red" }}
            justifyContent="center"
            alignItems="center"
          />
          <IconButton
            aria-label="Menu"
            icon={<FaBars />}
            variant="unstyled"
            _hover={{ color: "red" }}
            fontSize={{ base: "lg", md: "md" }}
            display={{ base: "flex", md: "none" }}
            justifyContent="center"
            alignItems="center"
            onClick={onOpen}
          />
        </Flex>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800">
          <DrawerCloseButton color="white" />
          <DrawerBody>
            <Flex direction="column" mt={8}>
              <ChakraLink as={Link} to="/" onClick={onClose} mb={4}>
                <Text fontSize="lg" color="white">
                  Home
                </Text>
              </ChakraLink>
              <ChakraLink as={Link} to="/videos" onClick={onClose} mb={4}>
                <Text fontSize="lg" color="white">
                  Videos
                </Text>
              </ChakraLink>
              <ChakraLink as={Link} to="/playlist" onClick={onClose} mb={4}>
                <Text fontSize="lg" color="white">
                  Playlist
                </Text>
              </ChakraLink>
              <ChakraLink as={Link} to="/about" onClick={onClose} mb={4}>
                <Text fontSize="lg" color="white">
                  About
                </Text>
              </ChakraLink>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
