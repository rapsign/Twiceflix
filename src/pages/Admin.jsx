import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";

import { SidebarProvider } from "@/components/ui/sidebar";

import AdminSidebar from "../components/Admin/AdminSidebar";
import Dashboard from "./Admin/Dashboard";
import TableVideos from "@/components/Admin/Video/TableVideos";
import TablePlaylists from "@/components/Admin/Playlist/TablePlaylist";

export default function Admin() {
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
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-950 text-white">
        {/* SIDEBAR */}
        <AdminSidebar onLogout={handleLogout} />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="videos" element={<TableVideos />} />
            <Route path="playlists" element={<TablePlaylists />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}
