// components/SearchBox.jsx
"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideSearch } from "lucide-react";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import { useNavigate } from "react-router-dom";

export default function SearchBox({ onSearch }) {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const toggleSearch = () => setShow((prev) => !prev);

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setQuery(query);

      if (query.trim() !== "") {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      } else {
        navigate("videos");
      }
    },
    [navigate]
  );

  useDebouncedSearch(query, handleSearchChange, 300);

  return (
    <div className="relative flex items-center">
      <Input
        placeholder="Search..."
        value={query}
        onChange={handleSearchChange}
        className={`transition-all duration-300 ease-in-out rounded-full text-sm
          ${show ? "opacity-100 w-48 md:w-72 px-4" : "opacity-0 w-0 px-0"}
        `}
      />
      <Button
        variant="ghost"
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-transparent hover:text-red-600"
        onClick={toggleSearch}
      >
        <LucideSearch className="w-5 h-5" />
      </Button>
    </div>
  );
}
