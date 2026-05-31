"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, ZoomIn } from "lucide-react";
import type { App } from "@/types";
import { useProofs } from "@/context/ProofContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage, useTranslation } from "@/context/LanguageContext";

export function AppProofsGallery({ app }: { app: App }) {
  const { t } = useTranslation();
  const { getLocalizedApp } = useLanguage();
  const localizedApp = getLocalizedApp(app);
  const { ready, getProofsForApp } = useProofs();
  const proofs = getProofsForApp(app.id);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState<string | undefined>();

  if (!ready || proofs.length === 0) return null;

  const openProof = (url: string, caption?: string) => {
    setSelectedUrl(url);
    setSelectedCaption(caption);
  };

  return (
    <>
      <section>
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon className="h-5 w-5 text-phantom-purple" />
          <h2 className="text-2xl font-semibold text-phantom-dark">{t("proofs.title")}</h2>
        </div>
        <p className="text-phantom-gray text-sm mb-6">
          {t("proofs.subtitle", { app: localizedApp.name })}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {proofs.map((proof) => (
            <button
              key={proof.id}
              type="button"
              onClick={() => openProof(proof.url, proof.caption)}
              className="group relative rounded-[20px] overflow-hidden border border-phantom-dark/10 bg-phantom-bg min-h-[140px] focus:outline-none focus:ring-2 focus:ring-phantom-purple"
            >
              <div className="relative flex items-center justify-center p-2 min-h-[140px]">
                <Image
                  src={proof.url}
                  alt={proof.caption ?? t("proofs.dialogTitle", { app: localizedApp.name })}
                  width={600}
                  height={600}
                  className="w-full h-auto max-h-56 object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-phantom-dark/0 group-hover:bg-phantom-dark/20 transition-colors flex items-center justify-center pointer-events-none">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                </div>
              </div>
              {proof.caption && (
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-phantom-dark/70 to-transparent">
                  <p className="text-white text-xs line-clamp-2 text-left">{proof.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      <Dialog open={Boolean(selectedUrl)} onOpenChange={(open) => !open && setSelectedUrl(null)}>
        <DialogContent className="max-w-3xl p-3 sm:p-4">
          <DialogTitle className="sr-only">
            {t("proofs.dialogTitle", { app: localizedApp.name })}
          </DialogTitle>
          {selectedUrl && (
            <div className="space-y-3">
              <div className="relative w-full min-h-[200px] max-h-[75dvh] rounded-[16px] overflow-hidden bg-phantom-bg">
                <Image
                  src={selectedUrl}
                  alt={selectedCaption ?? t("proofs.dialogTitle", { app: localizedApp.name })}
                  width={1200}
                  height={1600}
                  className="w-full h-auto max-h-[75dvh] object-contain mx-auto"
                  unoptimized
                />
              </div>
              {selectedCaption && (
                <p className="text-sm text-phantom-gray text-center">{selectedCaption}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
