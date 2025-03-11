import { useState, useEffect, useCallback } from "react";
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
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);

      const timeoutId = setTimeout(() => {
        if (query) {
          navigate(`/search?q=${encodeURIComponent(query)}`);
        } else {
          navigate(`/`);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [navigate]
  );

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
          {["Home", "Videos", "Playlist", "About"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
            >
              <Text
                mx={2}
                fontSize={{ base: "sm", md: "md" }}
                _hover={{ color: "red" }}
              >
                {item}
              </Text>
            </Link>
          ))}
        </Flex>
        <Flex align="center" position="relative">
          <Input
            placeholder="Search..."
            color="white"
            _placeholder={{ color: "inherit" }}
            variant="outline"
            bg="transparent"
            size="sm"
            width={{ base: "200px", xl: "300px" }}
            rounded="full"
            focusBorderColor="white"
            value={searchQuery}
            onChange={handleSearchChange}
            ml={2}
            opacity={showSearch ? 1 : 0}
            visibility={showSearch ? "visible" : "hidden"}
            transition="opacity 0.3s ease, visibility 0.3s ease"
            position="absolute"
            right={0}
            zIndex={1}
            pointerEvents={showSearch ? "auto" : "none"}
          />
          <IconButton
            aria-label="Search"
            aria-expanded={showSearch}
            icon={<FaSearch />}
            variant="unstyled"
            fontSize={{ base: "sm", md: "md" }}
            onClick={toggleSearch}
            display="flex"
            _hover={{ color: "red" }}
            justifyContent="center"
            alignItems="center"
            cursor="pointer"
            zIndex={2}
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
            cursor="pointer"
          />
        </Flex>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800">
          <DrawerCloseButton color="white" />
          <DrawerBody>
            <Flex direction="column" mt={8}>
              {["Home", "Videos", "Playlist", "About"].map((item) => (
                <ChakraLink
                  key={item}
                  as={Link}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={onClose}
                  mb={4}
                >
                  <Text fontSize="lg" color="white">
                    {item}
                  </Text>
                </ChakraLink>
              ))}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
