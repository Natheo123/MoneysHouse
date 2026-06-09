"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Bell, User, Shield, LogIn, MessageCircle, ChevronDown } from "lucide-react";
import { gsap, registerGsapPlugins } from "@/lib/gsap";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useAdmin } from "@/context/AdminContext";
import { useLenis } from "@/context/LenisContext";
import { useTranslation } from "@/context/LanguageContext";
import { MoneyHouseLogo } from "@/components/icons/MoneyHouseLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const primaryNavLinkKeys = [
  { href: "/apps", labelKey: "nav.apps" },
  { href: "/classement", labelKey: "nav.ranking" },
  { href: "/comparateur", labelKey: "nav.compare" },
] as const;

const moreNavLinkKeys = [
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/faq", labelKey: "nav.faq" },
  { href: "/equipe", labelKey: "nav.team" },
  { href: "/partenaires", labelKey: "nav.partners" },
] as const;

const navLinkKeys = [...primaryNavLinkKeys, ...moreNavLinkKeys] as const;

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
  const { t } = useTranslation();
  const headerRef = useRef<HTMLElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lastScrollY = useRef(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
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
    const updateNavbarOnScroll = (scrollY: number) => {
      const delta = scrollY - lastScrollY.current;
      setScrolled(scrollY > 40);

      if (scrollY <= 16) {
        setVisible(true);
      } else if (delta > 2) {
        setVisible(false);
        setMobileOpen(false);
        setMoreOpen(false);
      } else if (delta < -2) {
        setVisible(true);
      }

      lastScrollY.current = scrollY;
    };

    if (lenis) {
      const onLenisScroll = () => {
        updateNavbarOnScroll(lenis.scroll);
      };

      lenis.on("scroll", onLenisScroll);
      updateNavbarOnScroll(lenis.scroll);

      return () => {
        lenis.off("scroll", onLenisScroll);
      };
    }

    let ticking = false;
    const onWindowScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateNavbarOnScroll(window.scrollY);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    updateNavbarOnScroll(window.scrollY);

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

  useEffect(() => {
    if (!moreOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!moreMenuRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [moreOpen]);

  const linkClass =
    "px-3 py-2 rounded-full text-phantom-dark hover:bg-phantom-lavender/50 transition-colors text-sm font-medium whitespace-nowrap shrink-0";

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out will-change-transform ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled || mobileOpen
            ? "bg-phantom-surface/90 backdrop-blur-xl border-b border-phantom-dark/8 shadow-sm py-3"
            : "bg-transparent py-3 sm:py-4"
        }`}
        style={{
          paddingTop: `calc(${scrolled || mobileOpen ? "0.75rem" : "0.75rem"} + env(safe-area-inset-top, 0px))`,
        }}
      >
        <div className="max-w-[92rem] mx-auto section-x flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
            <MoneyHouseLogo size={scrolled ? 34 : 38} className="transition-all duration-300 sm:hidden" />
            <MoneyHouseLogo size={scrolled ? 36 : 40} className="transition-all duration-300 hidden sm:block" />
            <span
              className={`font-semibold text-phantom-dark hidden 2xl:block transition-all duration-300 truncate ${
                scrolled ? "text-base" : "text-lg"
              }`}
            >
              {siteConfig.name}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center min-w-0 px-2 overflow-visible">
            {user &&
              primaryNavLinkKeys.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={t(link.labelKey)}
                  className={linkClass}
                />
              ))}

            {user && (
            <div ref={moreMenuRef} className="relative shrink-0 z-[60]">
              <button
                type="button"
                onClick={() => setMoreOpen((open) => !open)}
                onMouseDown={(e) => e.stopPropagation()}
                className={`${linkClass} inline-flex items-center gap-1`}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
              >
                {t("nav.more")}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>

              {moreOpen && (
                <div
                  role="menu"
                  className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+0.5rem)] min-w-[12.5rem] rounded-[20px] border border-phantom-dark/8 bg-phantom-surface/95 backdrop-blur-xl shadow-lg py-2 z-50"
                >
                  {moreNavLinkKeys.map((link) => (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      label={t(link.labelKey)}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-phantom-dark hover:bg-phantom-lavender/50 transition-colors"
                    />
                  ))}
                  <div className="my-1.5 mx-3 border-t border-phantom-dark/8" />
                  <a
                    href={siteConfig.links.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#5865F2] hover:bg-[#5865F2]/10 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    {t("nav.contact")}
                  </a>
                </div>
              )}
            </div>
            )}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0 min-w-0">
            <LanguageSwitcher compact className="hidden md:inline-flex xl:hidden" />
            <LanguageSwitcher className="hidden xl:inline-flex" />
            {user ? (
              <>
                {adminAccess && (
                  <Link href="/admin" className="hidden lg:inline-flex">
                    <Button variant="ghost" size="sm" className="gap-1 px-2 sm:px-3">
                      <Shield className="h-4 w-4" />
                      <span className="hidden 2xl:inline">{t("nav.admin")}</span>
                    </Button>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="relative p-2 rounded-full hover:bg-phantom-lavender/50 transition-colors"
                  aria-label={t("nav.notifications")}
                >
                  <Bell className="h-5 w-5 text-phantom-dark" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-phantom-purple rounded-full" />
                  )}
                </Link>
                <Link href="/dashboard" className="lg:hidden p-2 rounded-full hover:bg-phantom-lavender/50" aria-label={t("nav.myAccount")}>
                  <User className="h-5 w-5 text-phantom-dark" />
                </Link>
                <Link href="/dashboard" className="hidden lg:inline-flex">
                  <Button variant="ghost" size="sm" className="gap-2 max-w-[9rem] 2xl:max-w-[12rem] px-2 sm:px-3">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="truncate hidden 2xl:inline">{user.name}</span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/connexion" className="hidden lg:inline-flex">
                  <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link href="/connexion" className="lg:hidden p-2 rounded-full hover:bg-phantom-lavender/50" aria-label={t("nav.login")}>
                  <LogIn className="h-5 w-5 text-phantom-dark" />
                </Link>
                <Link href="/inscription" className="hidden lg:inline-flex">
                  <Button size="sm" className="px-3 sm:px-4 text-sm">
                    {t("nav.signup")}
                  </Button>
                </Link>
              </>
            )}
            <button
              type="button"
              className="lg:hidden p-2 rounded-full hover:bg-phantom-lavender/50 shrink-0"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.menu")}
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
            aria-label={t("nav.closeMenu")}
            onClick={closeMobile}
          />
          <div
            className="fixed left-0 right-0 z-40 lg:hidden border-t border-phantom-dark/5 bg-phantom-surface shadow-lg overflow-y-auto max-h-[calc(100dvh-4rem-env(safe-area-inset-top))]"
            style={{ top: "calc(4rem + env(safe-area-inset-top, 0px))" }}
          >
            <div className="section-x py-4 space-y-1">
              <div className="px-4 pb-3 md:hidden">
                <LanguageSwitcher className="w-full justify-center" />
              </div>
              {adminAccess && (
                <NavLink
                  href="/admin"
                  label={t("nav.adminPanel")}
                  onClick={closeMobile}
                  className="flex items-center gap-2 px-4 py-3 rounded-[24px] text-phantom-dark hover:bg-phantom-lavender/50 font-medium"
                />
              )}
              {user && (
                <NavLink
                  href="/dashboard"
                  label={`${t("nav.myAccount")} (${user.name})`}
                  onClick={closeMobile}
                  className="flex items-center gap-2 px-4 py-3 rounded-[24px] text-phantom-dark hover:bg-phantom-lavender/50 font-medium lg:hidden"
                />
              )}
              {user &&
                navLinkKeys.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={t(link.labelKey)}
                    onClick={closeMobile}
                    className="block px-4 py-3 rounded-[24px] text-phantom-dark hover:bg-phantom-lavender/50 font-medium"
                  />
                ))}
              <a
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobile}
                className="flex items-center gap-2 px-4 py-3 rounded-[24px] text-[#5865F2] hover:bg-[#5865F2]/10 font-medium"
              >
                <MessageCircle className="h-5 w-5" />
                {t("nav.contact")}
              </a>
              {!user && (
                <div className="pt-4 flex flex-col gap-2 lg:hidden">
                  <Link href="/connexion" onClick={closeMobile}>
                    <Button variant="outline" className="w-full">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link href="/inscription" onClick={closeMobile}>
                    <Button className="w-full">{t("nav.signup")}</Button>
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
