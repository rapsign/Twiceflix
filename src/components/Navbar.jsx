import { useState } from "react";
import { Box, Flex, Text, Button, IconButton, Input } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <Box
      bg="transparent"
      px={4}
      py={2}
      color="white"
      position="fixed"
      width="100%"
      top="0"
      zIndex="1000"
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
            <Text mx={2} fontSize={{ base: "sm", md: "md" }}>
              Home
            </Text>
          </Link>
          <Link to="/videos">
            <Text mx={2} fontSize={{ base: "sm", md: "md" }}>
              Videos
            </Text>
          </Link>
          <Link to="/playlist">
            <Text mx={2} fontSize={{ base: "sm", md: "md" }}>
              Playlist
            </Text>
          </Link>
          <Link to="/about">
            <Text mx={2} fontSize={{ base: "sm", md: "md" }}>
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
              width="200px"
              rounded="full"
              borderColor="white"
              colorScheme="red"
              ml={2}
            />
          )}
          <IconButton
            aria-label="Search"
            icon={<FaSearch />}
            variant="unstyled"
            mx={2}
            fontSize={{ base: "sm", md: "md" }}
            onClick={toggleSearch}
          />
        </Flex>
        <Flex
          display={{ base: "flex", md: "none" }}
          justify="center"
          width="100%"
          mt={2}
        >
          <Link to="/">
            <Button variant="link" color="white" fontSize="sm" mx={2}>
              Home
            </Button>
          </Link>
          <Link to="/videos">
            <Button variant="link" color="white" fontSize="sm" mx={2}>
              Videos
            </Button>
          </Link>
          <Link to="/playlist">
            <Button variant="link" color="white" fontSize="sm" mx={2}>
              Playlist
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="link" color="white" fontSize="sm" mx={2}>
              About
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
