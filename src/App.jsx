import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayouts";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

import Home from "./pages/Home";
import Playlist from "./pages/Playlist";
import Videos from "./pages/Video";
import About from "./pages/About";
import Login from "./pages/Login";
import VideoPlayer from "./pages/VideoPlayer";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Admin/Dashboard";
import AdminVideosPage from "./pages/Admin/Videos";
import AdminPlaylistPage from "./pages/Admin/Playlist";

import { Toaster } from "sonner";
import Watch from "./pages/Watch";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />

      <Routes>
        {/* PUBLIC LAYOUT */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="playlist" element={<Playlist />} />
          <Route path="videos" element={<Videos />} />
          <Route path="about" element={<About />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="login" element={<Login />} />
          <Route path="/watch/:videoId" element={<Watch />} />
        </Route>

        {/* ADMIN LAYOUT */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="videos" element={<AdminVideosPage />} />
          <Route path="playlists" element={<AdminPlaylistPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
