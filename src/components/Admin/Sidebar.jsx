import {
  Box,
  VStack,
  Link,
  Icon,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  BsFillCollectionPlayFill,
  BsYoutube,
  BsLayersFill,
  BsReplyAllFill,
} from "react-icons/bs";

import { TextLogo, Logo } from "../Logo";

const Sidebar = ({ onLogout }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const location = useLocation();

  const links = [
    { to: "/admin", label: "Dashboard", icon: BsLayersFill },
    { to: "/admin/videos", label: "Videos", icon: BsYoutube },
    {
      to: "/admin/playlists",
      label: "Playlists",
      icon: BsFillCollectionPlayFill,
    },
    { to: "#", label: "Logout", icon: BsReplyAllFill, onClick: onLogout },
  ];

  return (
    <Box
      w={{
        base: "72px",
        md: "180px",
        lg: "250px",
      }}
      h="100vh"
      bg="#0f0f0f"
      color="white"
      p={4}
      pos="fixed"
      zIndex={10}
      borderRight="1px solid"
      borderColor="#3F3F3F"
    >
      <VStack spacing={0} align="start">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          w="full"
          mb={{ base: 3, md: 7 }}
        >
          {isMobile ? (
            <Logo Width="100%" key="mobile-logo" />
          ) : (
            <TextLogo Width="70%" key="desktop-logo" />
          )}
        </Box>

        {links.map(({ to, label, icon, onClick }) => {
          const isLogout = label === "Logout";
          const isActive = location.pathname === to;

          const commonProps = {
            fontSize: "md",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "flex-start",
            w: "full",
            px: 2,
            py: 2,
            borderRadius: "md",
            bg: isActive ? "blackAlpha.700" : "transparent",
            color: "white",
            _hover: { bg: "blackAlpha.700" },
          };

          return (
            <Tooltip
              label={label}
              placement="bottom"
              hasArrow
              fontSize="10px"
              width="72px"
              textAlign="center"
              borderRadius="xl"
              background="#3F3F3F"
              isDisabled={!isMobile}
              key={label}
            >
              {isLogout ? (
                <Box as="button" onClick={onClick} {...commonProps}>
                  <Icon as={icon} boxSize={5} />
                  {!isMobile && <Text ml={5}>{label}</Text>}
                </Box>
              ) : (
                <Link as={RouterLink} to={to} {...commonProps}>
                  <Icon as={icon} boxSize={5} />
                  {!isMobile && <Text ml={5}>{label}</Text>}
                </Link>
              )}
            </Tooltip>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;
