import { UserNav } from "@/components/layout/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@/lib/auth";

export function AdminHeader({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <SidebarTrigger className="-ml-1" />

        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">
            Bienvenido {user?.name}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <UserNav />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
