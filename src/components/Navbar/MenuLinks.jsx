import { Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const links = ["Home", "Videos", "Playlist", "About"];

const MenuLinks = ({ display }) => {
  return (
    <Flex align="center" display={display}>
      {links.map((item) => (
        <Link key={item} to={item === "Home" ? "/" : `/${item.toLowerCase()}`}>
          <Text mx={2} _hover={{ color: "red" }}>
            {item}
          </Text>
        </Link>
      ))}
    </Flex>
  );
};

export default MenuLinks;
