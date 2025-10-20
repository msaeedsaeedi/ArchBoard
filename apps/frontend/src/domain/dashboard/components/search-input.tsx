"use client";

import { Loader2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onSearch?: (term: string) => void;
  isLoading?: boolean;
  debounceDelay?: number;
}

export default function SearchInput({
  onSearch,
  isLoading,
  debounceDelay = 300,
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, debounceDelay);

  useEffect(() => {
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  function handleText(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  return (
    <div className="relative w-full">
      <Input
        type="search"
        value={searchTerm}
        onChange={handleText}
        placeholder="Search boards..."
        className="[&::-webkit-search-cancel-button]:hidden"
      />
      {isLoading && (
        <Loader2 className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
      )}
    </div>
  );
}
