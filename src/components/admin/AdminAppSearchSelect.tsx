"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { AppLogo } from "@/components/icons/AppLogo";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface AdminAppOption {
  id: string;
  name: string;
  subtitle?: string;
}

interface AdminAppSearchSelectProps {
  apps: AdminAppOption[];
  value: string;
  onChange: (appId: string) => void;
  label?: string;
  placeholder?: string;
}

export function AdminAppSearchSelect({
  apps,
  value,
  onChange,
  label = "Application",
  placeholder = "Rechercher une application…",
}: AdminAppSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = apps.find((app) => app.id === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q) ||
        app.subtitle?.toLowerCase().includes(q)
    );
  }, [apps, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (appId: string) => {
    onChange(appId);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <p className="text-xs text-phantom-gray uppercase tracking-wide mb-2">{label}</p>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center gap-3 rounded-[16px] border border-phantom-dark/10 bg-phantom-bg px-4 py-3 text-left",
          "hover:border-phantom-purple/40 focus:outline-none focus:ring-2 focus:ring-phantom-purple transition-colors"
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {selected ? (
          <>
            <AppLogo appId={selected.id} size={28} />
            <span className="flex-1 min-w-0">
              <span className="block font-medium text-phantom-dark truncate">{selected.name}</span>
              {selected.subtitle && (
                <span className="block text-xs text-phantom-gray truncate">{selected.subtitle}</span>
              )}
            </span>
          </>
        ) : (
          <span className="flex-1 text-phantom-gray">Choisir une application</span>
        )}
        <ChevronDown
          className={cn("h-5 w-5 text-phantom-gray shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 rounded-[20px] border border-phantom-dark/10 bg-phantom-surface shadow-xl overflow-hidden">
          <div className="p-3 border-b border-phantom-dark/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-phantom-gray" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-9 h-10"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-phantom-gray hover:text-phantom-dark"
                  aria-label="Effacer la recherche"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-sm text-phantom-gray text-center">
                Aucune application trouvée.
              </li>
            ) : (
              filtered.map((app) => (
                <li key={app.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={app.id === value}
                    onClick={() => handleSelect(app.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                      app.id === value
                        ? "bg-phantom-purple/15 text-phantom-dark"
                        : "hover:bg-phantom-lavender/50 text-phantom-dark"
                    )}
                  >
                    <AppLogo appId={app.id} size={28} />
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium truncate">{app.name}</span>
                      {app.subtitle && (
                        <span className="block text-xs text-phantom-gray truncate">{app.subtitle}</span>
                      )}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
