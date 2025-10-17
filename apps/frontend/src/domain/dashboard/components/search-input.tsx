"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onSearch?: (term: string) => void;
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300); // 300ms delay

  useEffect(() => {
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  function handleText(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  return (
    <Input
      type="search"
      value={searchTerm}
      onChange={handleText}
      placeholder="Search boards..."
    />
  );
}
