"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Bell, User, Shield } from "lucide-react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { isAdmin } from "@/lib/admin";
import { SearchBar } from "@/components/shared/SearchBar";
import { MoneyHouseLogo } from "@/components/icons/MoneyHouseLogo";

const navLinks = [
  { href: "/apps", label: "Applications" },
  { href: "/classement", label: "Classement" },
  { href: "/comparateur", label: "Comparateur" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: siteConfig.links.discord, label: "Nous contacter", external: true },
];

function NavLink({
  href,
  label,
  external,
  onClick,
  className,
}: {
  href: string;
  label: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={className}>
      {label}
    </Link>
  );
}

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, notifications } = useUser();
  const unread = notifications.filter((n) => !n.read).length;
  const adminAccess = user ? isAdmin(user.email) : false;

  useLayoutEffect(() => {
    registerGsapPlugins();
    gsap.from(headerRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass =
    "px-4 py-2 rounded-full text-phantom-dark hover:bg-phantom-lavender/50 transition-colors text-sm font-medium";

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-phantom-surface/90 backdrop-blur-xl border-b border-phantom-dark/8 shadow-sm py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <MoneyHouseLogo size={scrolled ? 36 : 40} className="transition-all duration-300" />
          <span className={`font-semibold text-phantom-dark hidden sm:block transition-all duration-300 ${scrolled ? "text-lg" : "text-xl"}`}>
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} external={link.external} className={linkClass} />
          ))}
        </nav>

        <div className="hidden md:block flex-1 max-w-xs">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {adminAccess && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="gap-1 hidden sm:inline-flex">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/dashboard" className="relative p-2 rounded-full hover:bg-phantom-lavender/50 transition-colors">
                <Bell className="h-5 w-5 text-phantom-dark" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-phantom-purple rounded-full" />
                )}
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/connexion">
                <Button variant="ghost" size="sm">Connexion</Button>
              </Link>
              <Link href="/inscription">
                <Button size="sm">Commencer</Button>
              </Link>
            </>
          )}
          <button
            className="lg:hidden p-2 rounded-full hover:bg-phantom-lavender/50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-phantom-dark/5 bg-phantom-surface px-6 py-4 space-y-2">
          <SearchBar className="mb-4" />
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              external={link.external}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-[24px] text-phantom-dark hover:bg-phantom-lavender/50 font-medium"
            />
          ))}
        </div>
      )}
    </header>
  );
}
