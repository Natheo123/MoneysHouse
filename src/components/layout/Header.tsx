"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Bell, User, Shield, LogIn } from "lucide-react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useAdmin } from "@/context/AdminContext";
import { useLenis } from "@/context/LenisContext";
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
  const lenis = useLenis();
  const lastScrollY = useRef(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const { user, notifications } = useUser();
  const { isAdmin, ready: adminReady } = useAdmin();
  const unread = notifications.filter((n) => !n.read).length;
  const adminAccess = adminReady && user ? isAdmin(user.email) : false;

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
    const updateFromScroll = (scrollY: number, direction: number) => {
      setScrolled(scrollY > 40);

      const delta = scrollY - lastScrollY.current;

      if (scrollY <= 8) {
        setVisible(true);
      } else if (direction > 0 && scrollY > 24) {
        setVisible(false);
        setMobileOpen(false);
      } else if (direction < 0) {
        setVisible(true);
      } else if (Math.abs(delta) >= 6) {
        if (delta > 0 && scrollY > 24) {
          setVisible(false);
          setMobileOpen(false);
        } else if (delta < 0) {
          setVisible(true);
        }
      }

      lastScrollY.current = scrollY;
    };

    if (lenis) {
      const onLenisScroll = (instance: typeof lenis) => {
        const scrollY = instance.scroll;
        const direction =
          instance.direction !== 0
            ? instance.direction
            : scrollY > lastScrollY.current
              ? 1
              : scrollY < lastScrollY.current
                ? -1
                : 0;
        updateFromScroll(scrollY, direction);
      };

      lenis.on("scroll", onLenisScroll);
      updateFromScroll(lenis.scroll, 0);

      return () => {
        lenis.off("scroll", onLenisScroll);
      };
    }

    const onWindowScroll = () => {
      const scrollY = window.scrollY;
      const direction =
        scrollY > lastScrollY.current ? 1 : scrollY < lastScrollY.current ? -1 : 0;
      updateFromScroll(scrollY, direction);
    };

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    onWindowScroll();
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, [lenis]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const linkClass =
    "px-4 py-2 rounded-full text-phantom-dark hover:bg-phantom-lavender/50 transition-colors text-sm font-medium";

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out will-change-transform ${
          visible ? "translate-y-0" : "-translate-y-full pointer-events-none"
        } ${
          scrolled || mobileOpen
            ? "bg-phantom-surface/90 backdrop-blur-xl border-b border-phantom-dark/8 shadow-sm py-3"
            : "bg-transparent py-3 sm:py-4"
        }`}
        style={{
          paddingTop: `calc(${scrolled || mobileOpen ? "0.75rem" : "0.75rem"} + env(safe-area-inset-top, 0px))`,
        }}
      >
        <div className="max-w-7xl mx-auto section-x flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
            <MoneyHouseLogo size={scrolled ? 34 : 38} className="transition-all duration-300 sm:hidden" />
            <MoneyHouseLogo size={scrolled ? 36 : 40} className="transition-all duration-300 hidden sm:block" />
            <span
              className={`font-semibold text-phantom-dark hidden sm:block transition-all duration-300 truncate ${
                scrolled ? "text-base sm:text-lg" : "text-lg sm:text-xl"
              }`}
            >
              {siteConfig.name}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                external={link.external}
                className={linkClass}
              />
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {user ? (
              <>
                {adminAccess && (
                  <Link href="/admin" className="inline-flex">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Shield className="h-4 w-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </Button>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="relative p-2 rounded-full hover:bg-phantom-lavender/50 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-phantom-dark" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-phantom-purple rounded-full" />
                  )}
                </Link>
                <Link href="/dashboard" className="sm:hidden p-2 rounded-full hover:bg-phantom-lavender/50" aria-label="Mon compte">
                  <User className="h-5 w-5 text-phantom-dark" />
                </Link>
                <Link href="/dashboard" className="hidden sm:inline-flex">
                  <Button variant="ghost" size="sm" className="gap-2 max-w-[140px] md:max-w-[180px]">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="truncate">{user.name}</span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/connexion" className="hidden sm:inline-flex">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/connexion" className="sm:hidden p-2 rounded-full hover:bg-phantom-lavender/50" aria-label="Connexion">
                  <LogIn className="h-5 w-5 text-phantom-dark" />
                </Link>
                <Link href="/inscription">
                  <Button size="sm" className="px-3 sm:px-4 text-sm sm:text-base">
                    Commencer
                  </Button>
                </Link>
              </>
            )}
            <button
              type="button"
              className="lg:hidden p-2 rounded-full hover:bg-phantom-lavender/50 shrink-0"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && visible && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-phantom-dark/40 backdrop-blur-sm lg:hidden"
            aria-label="Fermer le menu"
            onClick={closeMobile}
          />
          <div
            className="fixed left-0 right-0 z-40 lg:hidden border-t border-phantom-dark/5 bg-phantom-surface shadow-lg overflow-y-auto max-h-[calc(100dvh-4rem-env(safe-area-inset-top))]"
            style={{ top: "calc(4rem + env(safe-area-inset-top, 0px))" }}
          >
            <div className="section-x py-4 space-y-1">
              {adminAccess && (
                <NavLink
                  href="/admin"
                  label="Administration"
                  onClick={closeMobile}
                  className="flex items-center gap-2 px-4 py-3 rounded-[24px] text-phantom-dark hover:bg-phantom-lavender/50 font-medium"
                />
              )}
              {user && (
                <NavLink
                  href="/dashboard"
                  label={`Mon compte (${user.name})`}
                  onClick={closeMobile}
                  className="flex items-center gap-2 px-4 py-3 rounded-[24px] text-phantom-dark hover:bg-phantom-lavender/50 font-medium sm:hidden"
                />
              )}
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  external={link.external}
                  onClick={closeMobile}
                  className="block px-4 py-3 rounded-[24px] text-phantom-dark hover:bg-phantom-lavender/50 font-medium"
                />
              ))}
              {!user && (
                <div className="pt-4 flex flex-col gap-2 sm:hidden">
                  <Link href="/connexion" onClick={closeMobile}>
                    <Button variant="outline" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/inscription" onClick={closeMobile}>
                    <Button className="w-full">Commencer</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
