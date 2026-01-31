"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  History,
  Home,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Settings,
  Trash,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Chat } from "@/app/generated/prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { createChat, deleteChat } from "@/lib/db/actions";
import { cn } from "@/lib/utils";

export function DashboardSidebar({ chats }: { chats: Chat[] }) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const activeChatId = params.id as string;
  const isInChatPage = !!params.id;

  const [isPending, startTransition] = useTransition();

  async function createNewChat() {
    const pendingPrompt = localStorage.getItem("pikuu_initial_prompt");
    if (pendingPrompt) {
      localStorage.removeItem("pikuu_initial_prompt");
    }

    startTransition(async () => {
      const id = await createChat();
      router.push(`/dashboard/chat/${id}`);
    });
  }

  async function handleDeleteChat(id: string) {
    startTransition(() => {
      deleteChat(id);
    });
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-3 p-4">
          <Button
            className="h-11 w-full justify-start gap-2 rounded-xl bg-primary px-4 font-bold text-primary-foreground shadow-vercel transition-all hover:-translate-y-0.5 active:scale-95"
            variant="default"
            onClick={createNewChat}
            disabled={isPending || isInChatPage}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>

          <div className="flex flex-col gap-0.5">
            <SidebarMenuButton
              className="h-9 rounded-lg"
              render={
                <Link
                  href="/dashboard"
                  className="flex w-full items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">Dashboard</span>
                </Link>
              }
            />
            <SidebarMenuButton
              className="h-9 rounded-lg"
              render={
                <Link
                  href="/dashboard/pricing"
                  className="flex w-full items-center gap-2"
                >
                  <Zap className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold text-sm">
                    Comprar Créditos
                  </span>
                </Link>
              }
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="opacity-50" />

      <SidebarContent>
        <SidebarGroup>
          <div className="mt-2 mb-4 flex items-center justify-between px-2">
            <SidebarGroupLabel className="font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              Recent Projects
            </SidebarGroupLabel>
            <History className="h-3 w-3 text-muted-foreground/30" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <AnimatePresence mode="popLayout" initial={false}>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      className="group h-12 rounded-lg px-3 py-2 transition-all hover:bg-accent/50"
                      render={
                        <Link
                          href={`/dashboard/chat/${chat.id}`}
                          className="relative flex w-full items-start gap-3"
                        >
                          <div
                            className={cn(
                              "rounded-lg bg-muted shadow-sm transition-colors group-hover:bg-primary/10",
                              chat.id === activeChatId && "bg-primary/10",
                            )}
                          >
                            <MessageSquare className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                          </div>
                          <div className="flex flex-col items-start gap-2">
                            <motion.span
                              key={chat.name}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="truncate font-semibold text-xs"
                            >
                              {chat.name}
                            </motion.span>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-2 w-2 text-muted-foreground/30" />
                              <span className="font-light text-muted-foreground text-xs">
                                {chat.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* eliminar chat */}
                          <div className="absolute top-2 right-2">
                            <AlertDialog>
                              <AlertDialogTrigger
                                render={
                                  <Button
                                    className="h-6 w-6 rounded-lg p-0"
                                    variant="ghost"
                                  >
                                    <Trash className="h-3 w-3 text-destructive" />
                                  </Button>
                                }
                              />

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Estas seguro de eliminar el chat?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción eliminará permanentemente tu
                                    chat y todo lo que contiene.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    variant="destructive"
                                    onClick={() => handleDeleteChat(chat.id)}
                                    disabled={isPending}
                                    className="cursor-pointer text-foreground"
                                  >
                                    Continuar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </Link>
                      }
                    ></SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </AnimatePresence>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {chats.length === 0 && (
          <div className="mx-4 my-8 flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-5 w-5 text-muted-foreground/30" />
            </div>
            <p className="text-center font-medium text-[11px] text-muted-foreground italic">
              No project history yet
            </p>
          </div>
        )}
      </SidebarContent>
      <SidebarSeparator className="opacity-50" />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Volver al sitio</span>
                </Link>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/dashboard/settings"}
              render={
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Configuración</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
