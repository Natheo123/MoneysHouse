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

export function AppProofsGallery({ app }: { app: App }) {
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
          <h2 className="text-2xl font-semibold text-phantom-dark">Preuves de paiement</h2>
        </div>
        <p className="text-phantom-gray text-sm mb-6">
          Captures réelles partagées par l&apos;équipe Money&apos;s House pour prouver que{" "}
          {app.name} paie bien.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {proofs.map((proof) => (
            <button
              key={proof.id}
              type="button"
              onClick={() => openProof(proof.url, proof.caption)}
              className="group relative aspect-[3/4] rounded-[20px] overflow-hidden border border-phantom-dark/10 bg-phantom-bg focus:outline-none focus:ring-2 focus:ring-phantom-purple"
            >
              <Image
                src={proof.url}
                alt={proof.caption ?? `Preuve ${app.name}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-phantom-dark/0 group-hover:bg-phantom-dark/20 transition-colors flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
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
          <DialogTitle className="sr-only">Preuve {app.name}</DialogTitle>
          {selectedUrl && (
            <div className="space-y-3">
              <div className="relative w-full min-h-[200px] max-h-[75dvh] rounded-[16px] overflow-hidden bg-phantom-bg">
                <Image
                  src={selectedUrl}
                  alt={selectedCaption ?? `Preuve ${app.name}`}
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
