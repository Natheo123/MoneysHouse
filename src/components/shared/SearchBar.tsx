"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apps } from "@/lib/data/apps";
import { AppLogo } from "@/components/icons/AppLogo";

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.shortDescription.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-phantom-gray" />
        <Input
          placeholder="Rechercher une application..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="pl-14 pr-12"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-phantom-gray hover:text-phantom-dark"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-phantom-surface rounded-[24px] border border-phantom-dark/10 shadow-xl z-50 overflow-hidden">
          {results.map((app) => (
            <Link
              key={app.id}
              href={`/apps/${app.slug}`}
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="flex items-center gap-4 px-6 py-4 hover:bg-phantom-lavender/50 transition-colors"
            >
              <AppLogo appId={app.id} size={32} />
              <div>
                <p className="font-medium text-phantom-dark">{app.name}</p>
                <p className="text-sm text-phantom-gray">{app.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
