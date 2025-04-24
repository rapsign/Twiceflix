import { Box } from "@chakra-ui/react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import Dashboard from "./Dashboard";
import TableVideos from "../components/Admin/Video/TableVideos";
import TablePlaylists from "../components/Admin/Playlist/TablePlaylist";
import { signOut, getAuth } from "firebase/auth";

const Admin = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  return (
    <Box maxW="100vw">
      <Box display="flex">
        <Sidebar onLogout={handleLogout} />
        <Box
          ml={{ base: "72px", md: "180px", lg: "250px" }}
          w={{ base: "calc(100vw - 72px)", md: "calc(100vw - 180px)" }}
          p={4}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="videos" element={<TableVideos />} />
            <Route path="playlists" element={<TablePlaylists />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
