import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { auth, signOut, onAuthStateChanged } from "../firebase/firebase";
import Sidebar from "../components/SideBar";
import Dashboard from "../components/Dashboard";
import TableVideos from "../components/TableVideos";
import TablePlaylists from "../components/TablePlaylist";
import LoadingSpinner from "../components/LoadingSpinner";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box display="flex">
      <Sidebar onLogout={handleLogout} />
      <Box ml={{ base: "0", md: "250px" }} p={4} w="full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="videos" element={<TableVideos />} />
          <Route path="playlists" element={<TablePlaylists />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Admin;
