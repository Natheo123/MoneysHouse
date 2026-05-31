import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoneyHouseLogo } from "@/components/icons/MoneyHouseLogo";

const footerLinks = {
  Produit: [
    { href: "/apps", label: "Applications" },
    { href: "/classement", label: "Classement" },
    { href: "/comparateur", label: "Comparateur" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  Ressources: [
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/apps/earnapp", label: "EarnApp" },
    { href: "/apps/honeygain", label: "Honeygain" },
    { href: "/apps/gamby", label: "Gamby" },
    { href: "/apps/attapoll", label: "AttaPoll" },
  ],
  Entreprise: [
    { href: "/faq", label: "À propos" },
    { href: siteConfig.links.discord, label: "Nous contacter", external: true },
    { href: "/faq", label: "Confidentialité" },
    { href: "/faq", label: "Conditions" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-phantom-surface border-t border-phantom-dark/5 pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto section-x">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 mb-12 sm:mb-16">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <MoneyHouseLogo size={40} />
              <span className="text-lg sm:text-xl font-semibold text-phantom-dark">
                {siteConfig.name}
              </span>
            </Link>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="Entrez votre email" className="flex-1 min-w-0" />
              <Button className="w-full sm:w-auto shrink-0">Inscription</Button>
            </div>
            <p className="text-sm text-phantom-gray mt-3">
              Inscrivez-vous à notre newsletter et rejoignez la communauté {siteConfig.name}.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-phantom-dark mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-phantom-gray hover:text-phantom-purple transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-phantom-gray hover:text-phantom-purple transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-phantom-dark/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-phantom-gray">
            © 2026 {siteConfig.name}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-sm text-phantom-gray">
            <Link href="/faq" className="hover:text-phantom-purple transition-colors">
              Conditions
            </Link>
            <Link href="/faq" className="hover:text-phantom-purple transition-colors">
              Confidentialité
            </Link>
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-phantom-purple transition-colors"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
