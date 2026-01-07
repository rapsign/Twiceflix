"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
} from "@/components/ui/multi-select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const VideoManagerDialog = ({
  video = null,
  isOpen,
  onClose,
  onSave,
  playlists = [],
}) => {
  const [formData, setFormData] = useState({
    youtube_url: "",
    title: "",
    description: "",
    thumbnail: "",
    playlists: [],
  });
  const [publishedDate, setPublishedDate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (video) {
      setFormData({
        youtube_url: video.youtube_url || "",
        title: video.title || "",
        description: video.description || "",
        thumbnail: video.thumbnail || "",
        playlists: video.playlists || [],
      });

      let pd = video.published_at?.toDate ? video.published_at.toDate() : null;
      setPublishedDate(pd);
      setShowDetails(true);
    } else {
      resetForm();
    }
  }, [video, isOpen]);

  const resetForm = () => {
    setFormData({
      youtube_url: "",
      title: "",
      description: "",
      thumbnail: "",
      playlists: [],
    });
    setPublishedDate(null);
    setShowDetails(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getYouTubeId = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
      if (u.searchParams.has("v")) return u.searchParams.get("v");
      const match = url.match(
        /(?:v=|\/videos\/|embed\/|\/v\/)([A-Za-z0-9_-]{11})/
      );
      return match ? match[1] : null;
    } catch {
      const m = url.match(/([A-Za-z0-9_-]{11})/);
      return m ? m[1] : null;
    }
  };

  const fetchYoutubeData = async () => {
    if (!formData.youtube_url) return setError("YouTube URL is required");
    setLoadingMeta(true);
    setError("");

    const videoId = getYouTubeId(formData.youtube_url);
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

    try {
      if (videoId && apiKey) {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
        );
        if (res.ok) {
          const data = await res.json();
          const item = data.items?.[0];
          if (item?.snippet) {
            const snip = item.snippet;
            setFormData((prev) => ({
              ...prev,
              title: snip.title,
              thumbnail:
                snip.thumbnails?.maxres?.url ||
                snip.thumbnails?.standard?.url ||
                snip.thumbnails?.high?.url ||
                snip.thumbnails?.medium?.url ||
                snip.thumbnails?.default?.url ||
                "",
            }));
            setPublishedDate(
              snip.publishedAt ? new Date(snip.publishedAt) : null
            );
            setShowDetails(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch YouTube data");
    } finally {
      setLoadingMeta(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.youtube_url || !formData.title) return;

    onSave({
      ...(video?.id ? { id: video.id } : {}),
      ...formData,
      playlists: formData.playlists || [],
      published_at: publishedDate,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-xl bg-neutral-900 text-white border-neutral-700">
        <DialogHeader>
          <DialogTitle>{video ? "Edit Video" : "Add Video"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label>YouTube URL</Label>
          <div className="flex gap-2">
            <Input
              name="youtube_url"
              value={formData.youtube_url}
              onChange={handleChange}
              className="bg-neutral-800 border-neutral-700"
            />
            <Button
              onClick={fetchYoutubeData}
              disabled={loadingMeta}
              variant="destructive"
            >
              {loadingMeta ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Fetch"
              )}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {showDetails && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="bg-neutral-800 border-neutral-700"
              />
            </div>

            <div className="space-y-2">
              <Label>Published At</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="w-full justify-between bg-neutral-800 border-neutral-700 hover:bg-neutral-700">
                    {publishedDate
                      ? publishedDate.toDateString()
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={publishedDate}
                    onSelect={(d) => setPublishedDate(d || null)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value.slice(0, 300),
                  }))
                }
                className="bg-neutral-800 border-neutral-700 min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.description.length}/300
              </p>
            </div>

            {playlists.length > 0 && (
              <div className="space-y-2">
                <Label>Playlists</Label>
                <MultiSelect
                  values={formData.playlists}
                  itemsFromProps={playlists.map((p) => ({
                    value: String(p.id),
                    label: p.title,
                  }))}
                  onValuesChange={(values) =>
                    setFormData((prev) => ({ ...prev, playlists: values }))
                  }
                >
                  <MultiSelectTrigger className="max-w-120 w-full">
                    <MultiSelectValue placeholder="Select playlists..." />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {playlists.map((p) => (
                        <MultiSelectItem key={p.id} value={String(p.id)}>
                          {p.title}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
              </div>
            )}

            {formData.thumbnail && (
              <img
                src={formData.thumbnail}
                alt={formData.title}
                className="aspect-video object-cover rounded-md border border-neutral-700"
              />
            )}
          </div>
        )}

        {showDetails && (
          <DialogFooter className="gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSubmit}>
              Save
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoManagerDialog;
