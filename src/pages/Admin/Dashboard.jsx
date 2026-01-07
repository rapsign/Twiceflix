// src/pages/Admin/Dashboard.jsx
import { Youtube, ListVideo } from "lucide-react";
import useDashboardStats from "@/hooks/useDashboardStats";
import LoadingSpinner from "@/components/LoadingSpinner";
import DashboardCard from "@/components/Admin/DashboardCard";

export default function Dashboard() {
  const { videoCount, playlistCount, loading } = useDashboardStats();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* HEADING */}
      <h1 className="text-2xl md:text-4xl font-extrabold">
        <span className="text-red-500">TWICEFLIX</span>{" "}
        <span className="text-white">DASHBOARD</span>
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          to="videos"
          icon={Youtube}
          count={videoCount}
          label="Videos"
        />
        <DashboardCard
          to="playlists"
          icon={ListVideo}
          count={playlistCount}
          label="Playlists"
        />
      </div>
    </div>
  );
}
