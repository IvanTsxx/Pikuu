"use client";

import { useState } from "react";
import { ArtifactsPanel } from "@/app/dashboard/chat/[id]/_components/artifacts-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { MyUIMessage } from "@/lib/message-types";
import { type ArtifactSection, ArtifactSectionSchema } from "@/lib/types";
import Chat from "./chat";

export default function ChatPageContent({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages?: MyUIMessage[];
}) {
  const artifactsDB: ArtifactSection[] =
    initialMessages?.flatMap((m) =>
      m.parts.flatMap((p) => {
        if (p.type !== "data-artifact") return [];

        const parsed = ArtifactSectionSchema.safeParse({
          name: p.data.name,
          type: p.data.type,
          filePath: p.data.filePath,
          code: p.data.code,
          previousCode: p.data.previousCode,
          diff: p.data.diff,
          isNew: p.data.isNew,
        });

        return parsed.success ? [parsed.data] : [];
      }),
    ) ?? [];
  const [artifacts, setArtifacts] = useState<ArtifactSection[]>(artifactsDB);

  const onArtifactsChange = (newArtifacts: ArtifactSection[]) => {
    // mandamos el nuevo array al array sin perder lo anterior
    setArtifacts((prev) => [...prev, ...newArtifacts]);
  };

  return (
    <div className="flex h-full max-h-[calc(100vh-4rem)] flex-1 overflow-hidden">
      <ResizablePanelGroup className="h-full">
        <ResizablePanel defaultSize={35} minSize={25}>
          <Chat
            onArtifactsChange={onArtifactsChange}
            id={id}
            initialMessages={initialMessages}
          />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="border border-primary bg-border transition-colors hover:bg-border/50"
        />

        <ResizablePanel defaultSize={65} minSize={30}>
          <ArtifactsPanel artifacts={artifacts} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
