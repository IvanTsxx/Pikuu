"use client";

import * as React from "react";
import { AuthDialog } from "@/components/auth-dialog";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserNav } from "@/components/layout/user-nav";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";

const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    userOnly: true,
  },
  {
    title: "Precios",
    href: "/dashboard/pricing",
    userOnly: true,
  },
  {
    title: "Admin",
    href: "/admin",
    adminOnly: true,
  },
  {
    title: "Roadmap",
    href: "/roadmap",
  },
  {
    title: "Cómo funciona",
    href: "/how-it-works",
  },
];

export function SiteHeader() {
  const { data: session, isPending } = useSession();
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Detect scroll for styling
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = session?.user?.role === "ADMIN";
  const isUser = session?.user?.role === "USER";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mb-4 w-full border-transparent border-b bg-background/60 backdrop-blur-xl transition-all duration-300 supports-backdrop-filter:bg-background/60",
        isScrolled && "border-border/40 shadow-sm",
      )}
    >
      <div className="pointer-events-none absolute -inset-0.5 rounded-xl bg-linear-to-r from-primary/50 to-purple-600/50 opacity-30 blur transition-opacity duration-500 group-hover:opacity-50" />
      <div className="container relative flex h-14 items-center">
        <MobileNav items={NAV_ITEMS} isAdmin={isAdmin} />

        <div className="hidden md:flex">
          <MainNav items={NAV_ITEMS} isAdmin={isAdmin} isUser={isUser} />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <span className="hidden rounded-full border px-2 py-0.5 font-bold font-mono text-muted-foreground text-xs md:inline-block">
                  ADMIN
                </span>
              )}
              <UserNav />
            </div>
          ) : (
            <AuthDialog>
              <Button size="sm" className="px-4">
                Iniciar sesión
              </Button>
            </AuthDialog>
          )}
        </div>
        <div className="ml-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
