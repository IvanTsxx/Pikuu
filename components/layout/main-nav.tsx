"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";

interface MainNavProps {
  items: {
    title: string;
    href: string;
    disabled?: boolean;
    adminOnly?: boolean;
    userOnly?: boolean;
  }[];
  isAdmin?: boolean;
  isUser?: boolean;
}

export function MainNav({ items, isAdmin, isUser }: MainNavProps) {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Logo className="mr-2 h-6 w-6" />
        <span className="hidden font-bold sm:block">Pikuu</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {items.map(
          (item) =>
            (!item.adminOnly || isAdmin) &&
            (!item.userOnly || isUser) && (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60",
                )}
              >
                {item.title}
              </Link>
            ),
        )}
      </nav>
    </div>
  );
}
