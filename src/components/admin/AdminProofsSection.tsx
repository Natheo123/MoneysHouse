"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Trash2, Upload } from "lucide-react";
import { apps } from "@/lib/data/apps";
import { useProofs } from "@/context/ProofContext";
import { AdminAppSearchSelect } from "@/components/admin/AdminAppSearchSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminProofsSectionProps {
  userEmail: string;
}

export function AdminProofsSection({ userEmail }: AdminProofsSectionProps) {
  const { ready, proofs, getProofsForApp, addProof, removeProof, refreshProofs } = useProofs();
  const [selectedAppId, setSelectedAppId] = useState(apps[0]?.id ?? "");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const appProofs = getProofsForApp(selectedAppId);
  const selectedApp = apps.find((a) => a.id === selectedAppId);

  const appOptions = useMemo(
    () =>
      apps.map((app) => ({
        id: app.id,
        name: app.name,
        subtitle:
          (proofs[app.id]?.length ?? 0) > 0
            ? `${proofs[app.id]?.length} preuve${(proofs[app.id]?.length ?? 0) > 1 ? "s" : ""}`
            : "Aucune preuve",
      })),
    [proofs]
  );

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);
    const result = await addProof(selectedAppId, file, caption, userEmail);
    setUploading(false);

    if (!result.ok) {
      setError(result.error ?? "Erreur lors de l'envoi.");
      return;
    }

    setCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    flashSaved();
  };

  const handleRemove = async (proofId: string) => {
    setRemovingId(proofId);
    const result = await removeProof(selectedAppId, proofId, userEmail);
    setRemovingId(null);

    if (!result.ok) {
      setError(result.error ?? "Erreur lors de la suppression.");
      return;
    }

    setError("");
    flashSaved();
  };

  return (
    <section className="p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5">
      <h2 className="text-xl font-semibold text-phantom-dark mb-2 flex items-center gap-2">
        <Camera className="h-5 w-5" />
        Preuves de paiement
      </h2>
      <p className="text-sm text-phantom-gray mb-6">
        Ajoutez des captures (paiements, retraits, gains) par application. Elles s&apos;affichent
        sur la fiche de l&apos;app concernée. Enregistrées via{" "}
        <code className="text-xs bg-phantom-bg px-1.5 py-0.5 rounded">GITHUB_TOKEN</code>.
      </p>

      {!ready && <p className="text-sm text-phantom-gray mb-4">Chargement des preuves…</p>}
      {saved && <p className="text-green-600 text-sm mb-4">Preuve enregistrée avec succès.</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="mb-6">
        <AdminAppSearchSelect
          apps={appOptions}
          value={selectedAppId}
          onChange={(appId) => {
            setSelectedAppId(appId);
            setError("");
          }}
        />
      </div>

      <div className="rounded-[20px] bg-phantom-bg p-5 mb-6 space-y-4">
        <p className="text-phantom-dark font-medium">{selectedApp?.name}</p>
        <Input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Légende optionnelle (ex. : Retrait PayPal 12 €)"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
        <Button
          type="button"
          className="gap-2 w-full sm:w-auto"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Envoi en cours…" : "Choisir une photo"}
        </Button>
        <p className="text-xs text-phantom-gray">JPG, PNG, WebP ou GIF — max 4 Mo.</p>
      </div>

      {appProofs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {appProofs.map((proof) => (
            <div
              key={proof.id}
              className="relative rounded-[16px] overflow-hidden border border-phantom-dark/10 bg-phantom-bg aspect-[3/4]"
            >
              <Image
                src={proof.url}
                alt={proof.caption ?? "Preuve"}
                fill
                className="object-cover"
                unoptimized
                sizes="150px"
              />
              <button
                type="button"
                onClick={() => handleRemove(proof.id)}
                disabled={removingId === proof.id}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-red-100 text-phantom-gray hover:text-red-500 transition-colors shadow"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {proof.caption && (
                <div className="absolute bottom-0 inset-x-0 p-2 bg-phantom-dark/60">
                  <p className="text-white text-xs line-clamp-2">{proof.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-phantom-gray">Aucune preuve pour cette application.</p>
      )}

      <Button variant="outline" size="sm" className="mt-6" onClick={() => refreshProofs()}>
        Actualiser depuis le serveur
      </Button>
    </section>
  );
}
