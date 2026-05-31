"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Trash2, Upload } from "lucide-react";
import { apps } from "@/lib/data/apps";
import { useProofs } from "@/context/ProofContext";
import { AdminAppSearchSelect } from "@/components/admin/AdminAppSearchSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROOF_ACCEPTED_FORMATS_LABEL } from "@/lib/proofs-shared";

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

  const handleUpload = async (files: FileList | File[]) => {
    setError("");
    setUploading(true);

    const list = Array.from(files);
    let successCount = 0;
    let lastError = "";

    for (const file of list) {
      const result = await addProof(selectedAppId, file, caption, userEmail);
      if (result.ok) {
        successCount += 1;
      } else {
        lastError = result.error ?? "Erreur lors de l'envoi.";
      }
    }

    setUploading(false);

    if (successCount === 0) {
      setError(lastError || "Aucune image n'a pu être envoyée.");
      return;
    }

    if (lastError) {
      setError(
        `${successCount} image${successCount > 1 ? "s" : ""} ajoutée${successCount > 1 ? "s" : ""}, mais certaines ont échoué : ${lastError}`
      );
    } else {
      setError("");
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
          accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) void handleUpload(files);
          }}
        />
        <Button
          type="button"
          className="gap-2 w-full sm:w-auto"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Envoi en cours…" : "Choisir une ou plusieurs photos"}
        </Button>
        <p className="text-xs text-phantom-gray">{PROOF_ACCEPTED_FORMATS_LABEL}</p>
      </div>

      {appProofs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {appProofs.map((proof) => (
            <div
              key={proof.id}
              className="relative rounded-[16px] overflow-hidden border border-phantom-dark/10 bg-phantom-bg min-h-[120px] flex items-center justify-center"
            >
              <Image
                src={proof.url}
                alt={proof.caption ?? "Preuve"}
                width={400}
                height={400}
                className="w-full h-auto max-h-48 object-contain"
                unoptimized
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
