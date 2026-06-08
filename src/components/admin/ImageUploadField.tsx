"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UPLOAD_ACCEPTED_FORMATS_LABEL } from "@/lib/uploads-shared";
import type { UploadKind } from "@/lib/uploads-shared";
import { useTranslation } from "@/context/LanguageContext";

interface ImageUploadFieldProps {
  kind: UploadKind;
  userEmail: string;
  value?: string;
  onChange: (url: string) => void;
  nameHint?: string;
  placeholder?: string;
  hint?: string;
  fallbackLabel?: string;
}

export function ImageUploadField({
  kind,
  userEmail,
  value,
  onChange,
  nameHint = "",
  placeholder,
  hint,
  fallbackLabel,
}: ImageUploadFieldProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("requestedBy", userEmail);
    formData.append("kind", kind);
    formData.append("file", file);
    if (nameHint.trim()) formData.append("nameHint", nameHint.trim());

    try {
      const res = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!data.ok || !data.url) {
        setError(data.error ?? t("admin.uploadError"));
        return;
      }
      onChange(data.url);
    } catch {
      setError(t("admin.uploadError"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {hint && <p className="text-xs text-phantom-gray">{hint}</p>}

      <div className="flex gap-3 items-center">
        {value ? (
          <img
            src={value}
            alt=""
            className="w-14 h-14 rounded-2xl object-cover border border-phantom-dark/10 bg-white shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-phantom-lavender/50 flex items-center justify-center text-lg font-bold text-phantom-purple shrink-0">
            ?
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? t("admin.uploading") : t("admin.uploadImage")}
          </Button>
          <p className="text-xs text-phantom-gray">{UPLOAD_ACCEPTED_FORMATS_LABEL}</p>
        </div>
      </div>

      <Input
        placeholder={placeholder ?? t("admin.uploadUrlPlaceholder")}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value.trim())}
      />
      {fallbackLabel && <p className="text-xs text-phantom-gray">{fallbackLabel}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
