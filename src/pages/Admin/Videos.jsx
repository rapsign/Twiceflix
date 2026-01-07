"use client";

import { useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { Plus } from "lucide-react";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useDataManager from "../../hooks/useDataManager";
import LoadingSpinner from "@/components/LoadingSpinner";
import VideoTable from "@/components/Admin/Video/VideoTable";
import DeleteConfirmationDialog from "@/components/Admin/DeleteConfirmationDialog";
import VideoManagerDialog from "@/components/Admin/Video/VideoManagerDialog";

export default function AdminVideosPage() {
  // ===============================
  // DATA
  // ===============================
  const {
    data: videos,
    loading: loadingVideos,
    addItem,
    updateItem,
    deleteItem,
    refresh,
  } = useDataManager("videos");

  const { data: playlists, loading: loadingPlaylists } =
    useDataManager("playlists");

  // ===============================
  // STATE
  // ===============================
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ===============================
  // DEBOUNCED SEARCH
  // ===============================
  const debouncedSearch = useMemo(
    () => debounce((val) => setSearch(val), 300),
    []
  );

  // ===============================
  // SAVE VIDEO
  // ===============================
  const handleSave = async (videoData) => {
    try {
      if (videoData.id) {
        await updateItem(videoData.id, videoData);
        toast.success("Video updated");
      } else {
        await addItem(videoData);
        toast.success("Video added");
      }

      refresh();
      setIsModalOpen(false);
      setSelectedVideo(null);
    } catch (error) {
      console.error(error);
      toast.error("Error saving video");
    }
  };

  // ===============================
  // DELETE VIDEO
  // ===============================
  const handleDelete = async () => {
    if (!videoToDelete) return;

    try {
      await deleteItem(videoToDelete.id);
      setIsAlertOpen(false);
      setVideoToDelete(null);
      toast.success("Video deleted");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting video");
    }
  };

  // ===============================
  // LOADING STATE
  // ===============================
  if (loadingVideos || loadingPlaylists) {
    return <LoadingSpinner />;
  }

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="p-4">
      <Toaster richColors position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold flex flex-wrap gap-2">
          <span className="text-red-600">TWICEFLIX</span>
          <span>VIDEOS</span>
        </h1>

        <div className="flex w-full max-w-sm items-center gap-2">
          <Input
            placeholder="Search videos..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />

          <Button
            variant="outline"
            onClick={() => {
              setSelectedVideo(null);
              setIsModalOpen(true);
            }}
          >
            <Plus />
            Add Video
          </Button>
        </div>
      </div>

      {/* VIDEO TABLE */}
      <VideoTable
        data={videos}
        searchTerm={search}
        onEdit={(video) => {
          setSelectedVideo(video);
          setIsModalOpen(true);
        }}
        onDelete={(video) => {
          setVideoToDelete(video);
          setIsAlertOpen(true);
        }}
      />

      {/* MODAL ADD / EDIT VIDEO */}
      {isModalOpen && (
        <VideoManagerDialog
          video={selectedVideo}
          playlists={playlists}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVideo(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* DELETE CONFIRMATION */}
      <DeleteConfirmationDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
        itemName="video"
      />
    </div>
  );
}
