import { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import debounce from "lodash/debounce";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PlaylistManagerDialog from "@/components/Admin/Playlist/PlaylistManagerDialog";
import PlaylistsTable from "@/components/Admin/Playlist/PlaylistTable";
import DeleteConfirmationDialog from "@/components/Admin/DeleteConfirmationDialog";
import LoadingSpinner from "@/components/LoadingSpinner";

import useDataManager from "@/hooks/useDataManager";

const AdminPlaylistPage = () => {
  const {
    data: playlists,
    loading,
    deleteItem,
    refresh,
  } = useDataManager("playlists");

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  /* ===============================
     SEARCH (DEBOUNCED)
  ================================ */
  const debouncedSearch = useMemo(
    () => debounce((value) => setSearch(value), 300),
    []
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  /* ===============================
     DELETE HANDLER
  ================================ */
  const handleDelete = async () => {
    if (!playlistToDelete) return;

    try {
      await deleteItem(playlistToDelete.id);
      toast.success("Playlist deleted successfully");
      setPlaylistToDelete(null);
      setIsAlertOpen(false);
      refresh();
    } catch (err) {
      toast.error("Failed to delete playlist");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          <span className="text-red-600">TWICEFLIX</span> PLAYLISTS
        </h1>

        <div className="flex w-full max-w-sm items-center gap-2">
          <Input
            placeholder="Search Playlist..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />

          <Button
            variant="outline"
            onClick={() => {
              setSelectedPlaylist(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Playlist
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <PlaylistsTable
        data={playlists}
        searchTerm={search}
        onEdit={(playlist) => {
          setSelectedPlaylist(playlist);
          setIsModalOpen(true);
        }}
        onDelete={(playlist) => {
          setPlaylistToDelete(playlist);
          setIsAlertOpen(true);
        }}
      />

      {/* MODAL ADD / EDIT */}
      <PlaylistManagerDialog
        open={isModalOpen}
        playlist={selectedPlaylist}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setSelectedPlaylist(null);
            refresh();
          }
        }}
      />

      {/* DELETE CONFIRMATION */}
      <DeleteConfirmationDialog
        isOpen={isAlertOpen}
        onClose={() => {
          setIsAlertOpen(false);
          setPlaylistToDelete(null);
        }}
        onConfirm={handleDelete}
        itemName="playlist"
      />
    </div>
  );
};

export default AdminPlaylistPage;
