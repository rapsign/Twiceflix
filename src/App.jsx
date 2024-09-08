import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Playlist from "./pages/Playlist";
import Home from "./pages/Home";
import Videos from "./pages/Video";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import VideoPlayer from "./components/VideoPlayer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import About from "./pages/About";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname.startsWith("/admin/") ||
    location.pathname === "/admin" ||
    location.pathname === "/video-player";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/video-player" element={<VideoPlayer />} />
      </Routes>
    </>
  );
}

export default App;
