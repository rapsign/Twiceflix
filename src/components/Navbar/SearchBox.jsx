"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { LucideSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const isUserTyping = useRef(false);

  const toggleSearch = () => setShow((prev) => !prev);

  const handleChange = (e) => {
    isUserTyping.current = true;
    setQuery(e.target.value);
  };

  useEffect(() => {
    // Hanya navigate jika perubahan berasal dari user mengetik
    if (!isUserTyping.current) return;

    const handler = setTimeout(() => {
      isUserTyping.current = false;
      if (!query.trim()) {
        navigate("/videos");
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="relative flex items-center h-12">
      <Input
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        className={`h-8 transition-all duration-300 ease-in-out rounded-full text-sm border-neutral-700 bg-neutral-700
          ${show ? "opacity-100 w-48 md:w-72 px-4" : "opacity-0 w-0 px-0"}
        `}
      />

      <Button
        variant="icon"
        onClick={toggleSearch}
        className="w-12 h-12 flex items-center justify-center"
      >
        <LucideSearch className="w-12 h-12" />
      </Button>
    </div>
  );
}
