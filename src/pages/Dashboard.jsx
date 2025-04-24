import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { BsFillCollectionPlayFill, BsYoutube } from "react-icons/bs";
import useDashboardStats from "../hooks/useDashboardStats";
import LoadingSpinner from "../components/LoadingSpinner";
import DashboardCard from "../components/Admin/DashboardCard";

const Dashboard = () => {
  const { videoCount, playlistCount, loading } = useDashboardStats();

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Heading
        mb={5}
        fontWeight="extrabold"
        fontSize={{ base: "2xl", md: "4xl" }}
      >
        <Text as="span" color="red">
          TWICEFLIX
        </Text>{" "}
        DASHBOARD
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
        <DashboardCard
          to="videos"
          icon={BsYoutube}
          count={videoCount}
          label="Videos"
        />
        <DashboardCard
          to="playlists"
          icon={BsFillCollectionPlayFill}
          count={playlistCount}
          label="Playlists"
        />
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
