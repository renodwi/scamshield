"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./icon";

type ActivePage = "beranda" | "cara-kerja" | "tips-aman" | "tentang-kami";

const navItems: { href: string; label: string; page: ActivePage }[] = [
  { href: "/", label: "Beranda", page: "beranda" },
  { href: "/cara-kerja", label: "Cara Kerja", page: "cara-kerja" },
  { href: "/tips-aman", label: "Tips Aman", page: "tips-aman" },
  { href: "/tentang-kami", label: "Tentang Kami", page: "tentang-kami" },
];

export function SiteHeader({ activePage }: { activePage: ActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 border-b border-slate-200/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Scam Shield Home">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/20">
            <Icon name="shield-check" className="h-6 w-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">Scam Shield</span>
        </Link>

        <div className="hidden items-center gap-9 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.page === activePage
                  ? "font-semibold text-blue-600"
                  : "font-medium text-slate-600 transition hover:text-blue-600"
              }
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white lg:hidden"
          type="button"
          aria-label="Buka menu"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <Icon name="menu" className="h-5 w-5" />
        </button>
      </nav>

      <div className={`${mobileMenuOpen ? "block" : "hidden"} border-t border-slate-200 bg-white px-4 py-4 lg:hidden`}>
        <div className="mx-auto grid max-w-7xl gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.page === activePage
                  ? "rounded-xl px-3 py-2 font-semibold text-blue-600"
                  : "rounded-xl px-3 py-2 font-medium text-slate-600 hover:bg-slate-50"
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
