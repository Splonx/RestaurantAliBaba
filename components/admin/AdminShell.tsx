"use client";

import {
  ClipboardList,
  GalleryHorizontalEnd,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Palette,
  Search,
  Settings,
  Star,
  Tags,
  Utensils,
  Users,
  Wine
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu", icon: Utensils },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
  { href: "/admin/galerie", label: "Galerie", icon: GalleryHorizontalEnd },
  { href: "/admin/evenements", label: "Événements", icon: Wine },
  { href: "/admin/reservations", label: "Réservations", icon: ClipboardList },
  { href: "/admin/avis", label: "Avis clients", icon: Star },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/branding", label: "Branding", icon: Palette },
  { href: "/admin/settings", label: "Contenu site", icon: Settings },
  { href: "/admin/users", label: "Utilisateurs", icon: Users }
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f5efe5] text-coffee">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-coffee/10 bg-coffee text-cream lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex h-20 items-center justify-between px-5 lg:h-auto lg:block lg:px-6 lg:py-7">
            <Link href="/admin/dashboard" className="focus-ring flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-terracotta font-bold text-cream">
                AB
              </span>
              <span>
                <span className="block font-display text-2xl font-semibold leading-none">
                  Ali Baba
                </span>
                <span className="text-xs uppercase tracking-[0.22em] text-sand">
                  Admin
                </span>
              </span>
            </Link>
            <MenuIcon className="lg:hidden" size={24} aria-hidden />
          </div>

          <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-2 lg:overflow-visible lg:px-4 lg:pb-0">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`focus-ring flex min-w-max items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-cream text-coffee"
                      : "text-cream/70 hover:bg-cream/10 hover:text-cream"
                  }`}
                >
                  <Icon size={18} aria-hidden />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <form action={logoutAction} className="hidden px-4 pt-8 lg:block">
            <button
              type="submit"
              className="focus-ring flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-cream/70 transition hover:bg-cream/10 hover:text-cream"
            >
              <LogOut size={18} aria-hidden />
              Déconnexion
            </button>
          </form>
        </aside>

        <main className="flex-1 px-5 py-8 sm:px-7 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
