import { Box, Flex, Text, Button, IconButton } from "@chakra-ui/react";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";

const Navbar = () => {
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
      <Flex
        align="center"
        justify="space-between"
        wrap="wrap" // Wrap items on smaller screens
      >
        <Text
          fontSize={{ base: "lg", md: "xl", lg: "4xl" }}
          fontWeight="bold"
          color="red"
        >
          TWICEFLIX
        </Text>
        <Flex
          align="center"
          display={{ base: "none", md: "flex" }} // Hide on small screens
          mx={4}
        >
          <Text mx={2} fontSize={{ base: "sm", md: "md" }}>
            Home
          </Text>
          <Text mx={2} fontSize={{ base: "sm", md: "md" }}>
            TV Shows
          </Text>
          <Text mx={2} fontSize={{ base: "sm", md: "md" }}>
            Movies
          </Text>
          <Text mx={2} fontSize={{ base: "sm", md: "md" }}>
            New & Popular
          </Text>
          <Text mx={2} fontSize={{ base: "sm", md: "md" }}>
            My List
          </Text>
        </Flex>
        <Flex align="center">
          <IconButton
            aria-label="Search"
            icon={<FaSearch />}
            variant="unstyled"
            mx={2}
            fontSize={{ base: "sm", md: "md" }}
          />

          <IconButton
            aria-label="Profile"
            icon={<FaUser />}
            variant="unstyled"
            mx={2}
            fontSize={{ base: "sm", md: "md" }}
          />
        </Flex>
        <Flex
          display={{ base: "flex", md: "none" }} // Show on small screens
          justify="center"
          width="100%"
          mt={2}
        >
          <Button variant="link" color="white" fontSize="sm" mx={2}>
            Home
          </Button>
          <Button variant="link" color="white" fontSize="sm" mx={2}>
            TV Shows
          </Button>
          <Button variant="link" color="white" fontSize="sm" mx={2}>
            Movies
          </Button>
          <Button variant="link" color="white" fontSize="sm" mx={2}>
            New & Popular
          </Button>
          <Button variant="link" color="white" fontSize="sm" mx={2}>
            My List
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
