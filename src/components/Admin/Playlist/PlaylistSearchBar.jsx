import { Input } from "@chakra-ui/react";

const PlaylistSearchBar = ({ onChange }) => (
  <Input
    placeholder="Search..."
    color="white"
    size="sm"
    mb={3}
    rounded="full"
    width={{ base: "100%", md: "400px" }}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default PlaylistSearchBar;
