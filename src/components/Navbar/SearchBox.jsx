import { useState, useCallback } from "react";
import { Box, Input, IconButton } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useDebouncedSearch from "../../hooks/useDebouncedSearch";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const toggleSearch = () => setShow((prev) => !prev);

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setQuery(query);

      if (query.trim() !== "") {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      } else {
        navigate("videos");
      }
    },
    [navigate]
  );

  useDebouncedSearch(query, handleSearchChange, 300);

  return (
    <Box position="relative">
      <Input
        placeholder="Search..."
        value={query}
        onChange={handleSearchChange}
        size="sm"
        color="white"
        bg="transparent"
        rounded="full"
        right={{ base: "-10%", xl: "0" }}
        width={{ base: "150px", xl: "300px" }}
        opacity={show ? 1 : 0}
        visibility={show ? "visible" : "hidden"}
        pointerEvents={show ? "auto" : "none"}
        transition="all 0.3s ease"
        _placeholder={{ color: "inherit" }}
        focusBorderColor="white"
      />
      <IconButton
        icon={<FaSearch />}
        aria-label="Search"
        onClick={toggleSearch}
        variant="unstyled"
        position="absolute"
        right={{ base: "-20%", xl: "-5%" }}
        top="50%"
        transform="translateY(-50%)"
        _hover={{ color: "red" }}
      />
    </Box>
  );
};

export default SearchBox;
