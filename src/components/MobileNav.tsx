"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, LayoutDashboard, LogOut, Sparkles } from "lucide-react";

type Props = {
  isAuthenticated: boolean;
  isPro?: boolean;
};

const links = [
  { href: "/track", label: "Expiry Tracker", description: "Know your key dates" },
  { href: "/renew", label: "Renewal Guide", description: "Step-by-step walkthrough" },
  { href: "/status", label: "Status Tracker", description: "20-day countdown" },
  { href: "/guide", label: "Knowledge Base", description: "Explainers & deep dives" },
  { href: "/pricing", label: "Pricing", description: "Free vs Pro — $20 one-time" },
];

export function MobileNav({ isAuthenticated, isPro = false }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Move focus into drawer on open, return it on close
  useEffect(() => {
    if (open) {
      firstFocusRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  // Close on Escape + trap focus within drawer
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`sm:hidden fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`sm:hidden fixed top-0 right-0 bottom-0 z-[70] w-80 max-w-[85vw] bg-card border-l border-border shadow-xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <span className="text-sm font-semibold">Menu</span>
          <button
            ref={firstFocusRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`block px-3 py-3 rounded-lg transition-colors ${
                      isActive ? "bg-accent" : "hover:bg-accent"
                    }`}
                  >
                    <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-foreground"}`}>{link.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border/60 p-3 space-y-1">
          {isAuthenticated ? (
            <>
              <a
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-terracotta" />
                <span className="text-sm font-medium">Dashboard</span>
                {isPro && (
                  <span className="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20">
                    <Sparkles className="h-2.5 w-2.5" /> Pro
                  </span>
                )}
              </a>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors text-left"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Sign out</span>
                </button>
              </form>
            </>
          ) : (
            <a
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg bg-terracotta text-white hover:bg-terracotta-dark transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="text-sm font-medium">Sign in</span>
            </a>
          )}
        </div>
      </aside>
    </>
  );
}
