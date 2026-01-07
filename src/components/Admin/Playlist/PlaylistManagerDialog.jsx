import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectItem,
} from "@/components/ui/multi-select";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import useDataManager from "@/hooks/useDataManager";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";

const PlaylistManagerDialog = ({ open, onOpenChange, playlist = null }) => {
  const {
    addItem,
    updateItem,
    refresh: refreshPlaylists,
  } = useDataManager("playlists");

  const {
    data: videosData,
    updateItem: updateVideo,
    refresh: refreshVideos,
  } = useDataManager("videos");

  /* ===============================
     FORM STATE
  ================================ */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVideoIds, setSelectedVideoIds] = useState([]);
  const [videos, setVideos] = useState([]);

  const [videoToDelete, setVideoToDelete] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  /* ===============================
     RESET FORM
  ================================ */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedVideoIds([]);
    setVideos([]);
  };

  /* ===============================
     HANDLE OPEN MODE (FIX UTAMA)
  ================================ */
  useEffect(() => {
    if (!open) return;

    // ✅ ADD MODE → RESET TOTAL
    if (!playlist) {
      resetForm();
      return;
    }

    // ✅ EDIT MODE
    setTitle(playlist.title);
    setDescription(playlist.description || "");

    const playlistVideos = (videosData || []).filter((v) =>
      v.playlists?.includes(playlist.id)
    );

    setVideos(playlistVideos);
  }, [open, playlist, videosData]);

  /* ===============================
     SAVE PLAYLIST
  ================================ */
  const handleSave = async () => {
    if (!title.trim()) {
      toast.warning("Playlist title is required");
      return;
    }

    try {
      let playlistId = playlist?.id;

      // CREATE / UPDATE PLAYLIST
      if (!playlist) {
        const newPlaylist = await addItem({
          title,
          description,
          created_at: new Date(),
          updated_at: new Date(),
        });
        playlistId = newPlaylist.id;
      } else {
        await updateItem(playlist.id, {
          title,
          description,
          updated_at: new Date(),
        });
      }

      // ADD VIDEO TO PLAYLIST
      for (const videoId of selectedVideoIds) {
        const video = videosData.find((v) => v.id === videoId);
        if (!video) continue;

        const existing = video.playlists || [];
        if (!existing.includes(playlistId)) {
          await updateVideo(videoId, {
            playlists: [...existing, playlistId],
          });
        }
      }

      refreshVideos();
      refreshPlaylists();
      resetForm();
      onOpenChange(false);

      toast.success(
        playlist
          ? "Playlist updated successfully"
          : "Playlist added successfully"
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  /* ===============================
     REMOVE VIDEO
  ================================ */
  const confirmRemoveVideo = async () => {
    if (!playlist || !videoToDelete) return;

    try {
      const video = videos.find((v) => v.id === videoToDelete);
      if (!video) return;

      await updateVideo(video.id, {
        playlists: video.playlists.filter((id) => id !== playlist.id),
      });

      setVideos((prev) => prev.filter((v) => v.id !== video.id));
      refreshVideos();

      toast.success("Video removed from playlist");
    } catch {
      toast.error("Failed to remove video");
    } finally {
      setIsAlertOpen(false);
      setVideoToDelete(null);
    }
  };

  const videosNotInPlaylist = (videosData || []).filter(
    (v) => !videos.some((vid) => vid.id === v.id)
  );

  /* ===============================
     RENDER
  ================================ */
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-neutral-800 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {playlist ? "Edit Playlist" : "Add Playlist"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="playlist-title"
              className=" block text-sm font-medium mb-2"
            >
              Playlist Title
            </label>
            <Input
              placeholder="Playlist title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label
              htmlFor="playlist-title"
              className=" block text-sm font-medium mb-2"
            >
              Playlist Description
            </label>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              className="min-h-40"
            />

            <p className="text-right text-xs text-muted-foreground">
              {description.length}/300
            </p>

            {playlist && (
              <>
                <label className="block text-sm font-medium mb-2">
                  Select Videos
                </label>
                <MultiSelect
                  values={selectedVideoIds}
                  onValuesChange={setSelectedVideoIds}
                >
                  <MultiSelectTrigger className="w-full max-w-120">
                    <MultiSelectValue placeholder="Add video to playlist" />
                  </MultiSelectTrigger>

                  <MultiSelectContent
                    search={{
                      placeholder: "Search video...",
                      emptyMessage: "No video found",
                    }}
                  >
                    {videosNotInPlaylist.map((video) => (
                      <MultiSelectItem
                        key={video.id}
                        value={video.id}
                        badgeLabel={video.title}
                      >
                        <div className="flex gap-3">
                          <img
                            src={video.thumbnail}
                            className="w-24 h-14 rounded-md object-cover"
                          />
                          <span className="text-xs line-clamp-2">
                            {video.title}
                          </span>
                        </div>
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
                <p className=" text-xs text-muted-foreground">
                  Select one or more videos to add to this playlist
                </p>
                <label className="block text-sm font-medium mb-2">
                  Video On This Playlist
                </label>
                <ScrollArea className="h-78 bg-neutral-900/50 p-3 rounded">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center gap-4 p-3 rounded-lg mb-2 border  "
                    >
                      <img
                        src={video.thumbnail}
                        className="w-28 h-16 object-cover rounded-lg"
                      />
                      <p className="text-xs flex-1 line-clamp-2">
                        {video.title}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-400 hover:text-red-500"
                        onClick={() => {
                          setVideoToDelete(video.id);
                          setIsAlertOpen(true);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSave}>
              {playlist ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={confirmRemoveVideo}
        itemName="video"
      />
    </>
  );
};

export default PlaylistManagerDialog;
