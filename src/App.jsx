import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Playlist from "./pages/Playlist";
import Home from "./pages/Home";
import Videos from "./pages/Video";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import VideoPlayer from "./pages/VideoPlayer";
import SearchPage from "./pages/SearchPage";
import About from "./pages/About";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname.startsWith("/admin") ||
    location.pathname === "/admin" ||
    location.pathname === "/video-player" ||
    ![
      "/",
      "/playlist",
      "/videos",
      "/login",
      "/search",
      "/about",
      "/video-player",
    ].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/videos" element={<Videos />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/video-player" element={<VideoPlayer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
