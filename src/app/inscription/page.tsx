"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InscriptionPage() {
  const { register, user } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, password);
    router.push("/dashboard");
  };

  return (
    <PageShell maxWidth="md" className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-normal text-phantom-dark tracking-tight mb-2">
            Créer un compte
          </h1>
          <p className="text-phantom-gray text-sm sm:text-base">
            Rejoignez Money&apos;s House et commencez à gagner
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] bg-phantom-surface border border-phantom-dark/5 space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-phantom-dark mb-2 block">Prénom</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre prénom"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-phantom-dark mb-2 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@email.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-phantom-dark mb-2 block">Mot de passe</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Commencer gratuitement
          </Button>
          <p className="text-center text-sm text-phantom-gray">
            Déjà un compte ?{" "}
            <Link href="/connexion" className="text-phantom-purple hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </PageShell>
  );
}
