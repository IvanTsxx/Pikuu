import { redirect } from "next/navigation";
import { NewChatListener } from "@/components/dashboard/new-chat-listener";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/db/queries/auth";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardSidebar } from "./_components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/");
  }

  const chats = await prisma.chat.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <SidebarProvider>
      <NewChatListener />
      <DashboardSidebar chats={chats} />
      <SidebarInset>
        <main className="flex h-full flex-1 overflow-hidden">
          <div className="flex min-w-0 flex-1 flex-col">
            <DashboardHeader user={user} />
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
