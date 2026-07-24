"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "搜索文章...",
  defaultValue,
}: SearchBarProps) {
  const [value, setValue] = React.useState(defaultValue ?? "");

  React.useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative w-full max-w-lg">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary/60 pointer-events-none" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 pr-4"
      />
    </div>
  );
}
