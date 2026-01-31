"use client";

import { Braces, Database, FileCode, FormInput, Workflow } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ArtifactSection } from "@/lib/types";
import { ArtifactCard } from "./artifact-card";

interface VersionedArtifact extends ArtifactSection {
  versions: ArtifactSection[];
}

function normalizeArtifacts(artifacts: ArtifactSection[]): VersionedArtifact[] {
  const map = new Map<string, ArtifactSection[]>();

  // 1. Agrupar por archivo
  for (const artifact of artifacts) {
    const key = `${artifact.name}:${artifact.filePath}`;
    const list = map.get(key) ?? [];
    list.push(artifact);
    map.set(key, list);
  }

  const result: VersionedArtifact[] = [];

  // 2. Agrupar versiones
  for (const [, versions] of map) {
    if (versions.length === 0) continue;

    const current = versions[versions.length - 1];

    result.push({
      ...current,
      versions,
    });
  }

  return result;
}

interface ArtifactsPanelProps {
  artifacts: ArtifactSection[];
}

const typeIcons = {
  prisma: Database,
  zod: Braces,
  action: FileCode,
  route: FileCode,
  form: FormInput,
  workflow: Workflow,
};

export function ArtifactsPanel({ artifacts }: ArtifactsPanelProps) {
  const normalizedArtifacts = normalizeArtifacts(artifacts);
  if (normalizedArtifacts.length === 0) {
    return (
      <div className="flex h-full w-full min-w-0 flex-1 items-center justify-center p-8">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileCode className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No artifacts yet</h3>
          <p className="max-w-sm text-muted-foreground text-sm">
            Artifacts will appear here as they're generated. Start by describing
            your project in the chat.
          </p>
        </div>
      </div>
    );
  }

  const groupedArtifacts = normalizedArtifacts.reduce(
    (acc, artifact) => {
      if (!acc[artifact.type]) {
        acc[artifact.type] = [];
      }
      acc[artifact.type].push(artifact);
      return acc;
    },
    {} as Record<string, VersionedArtifact[]>,
  );

  const tabs = Object.keys(groupedArtifacts);
  const defaultTab = tabs[0];

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
      <ScrollArea className="h-[calc(100vh-3rem)] w-full">
        <div className="border-border border-b p-6">
          <h2 className="font-semibold text-xl">Generated Artifacts</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            {normalizedArtifacts.length} file
            {normalizedArtifacts.length !== 1 ? "s" : ""} generated
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="flex flex-1 flex-col">
          <TabsList className="mx-6 mt-4 grid w-auto grid-cols-5">
            {tabs.map((type) => {
              const Icon = typeIcons[type as keyof typeof typeIcons];
              return (
                <TabsTrigger
                  key={type}
                  value={type}
                  className="gap-2 capitalize"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {type}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.map((type) => (
            <TabsContent key={type} value={type} className="mt-0 flex-1">
              <div className="p-6">
                <div className="space-y-4">
                  {groupedArtifacts[type].map((artifact, index) => (
                    <ArtifactCard
                      key={`${artifact.filePath}-${index}`}
                      versions={artifact.versions}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </ScrollArea>
    </div>
  );
}
