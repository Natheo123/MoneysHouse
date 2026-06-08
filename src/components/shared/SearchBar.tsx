"use client";

import { useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AppLogo } from "@/components/icons/AppLogo";
import { useLenis } from "@/context/LenisContext";
import { useLanguage, useTranslation } from "@/context/LanguageContext";

export function SearchBar({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { localizedApps } = useLanguage();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return localizedApps.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.shortDescription.toLowerCase().includes(q)
    );
  }, [query, localizedApps]);

  useEffect(() => {
    if (!open || results.length === 0) return;
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [open, results.length, lenis]);

  const handleDropdownWheel = (event: WheelEvent<HTMLElement>) => {
    event.stopPropagation();

    const list = listRef.current;
    if (!list) {
      event.preventDefault();
      return;
    }

    if (list.scrollHeight <= list.clientHeight) {
      event.preventDefault();
      return;
    }

    const goingUp = event.deltaY < 0;
    const goingDown = event.deltaY > 0;
    const atTop = list.scrollTop <= 0;
    const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 1;

    if ((atTop && goingUp) || (atBottom && goingDown)) {
      event.preventDefault();
    }
  };

  return (
    <div className={`relative w-full min-w-0 ${className ?? ""}`}>
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-phantom-gray" />
        <Input
          placeholder={t("apps.searchPlaceholder")}
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
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto overscroll-contain bg-phantom-surface rounded-[24px] border border-phantom-dark/10 shadow-xl z-50"
          onWheel={handleDropdownWheel}
        >
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
