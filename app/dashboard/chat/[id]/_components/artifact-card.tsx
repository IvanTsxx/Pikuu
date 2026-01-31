"use client";

import { createTwoFilesPatch } from "diff";
import { Check, Clock, Copy, Download, FileDiff, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact";
import { CodeBlock } from "@/components/ai-elements/code-block";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ArtifactSection } from "@/lib/types";
import { getLanguage } from "@/lib/utils";

interface ArtifactCardProps {
  versions: ArtifactSection[];
}

export function ArtifactCard({ versions }: ArtifactCardProps) {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"code" | "diff">("code");
  // null means "follow latest", otherwise pinned to index
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<
    number | null
  >(null);

  // Filter out empty code versions as requested
  const validVersions =
    versions?.filter((v) => v.code && v.code.trim().length > 0) || [];
  const hasVersions = validVersions.length > 0;

  // Safe defaults for hooks usage
  const currentIndex =
    selectedVersionIndex !== null
      ? selectedVersionIndex
      : hasVersions
        ? validVersions.length - 1
        : 0;

  // Ensure index is within bounds (safety check)
  const safeIndex = hasVersions
    ? Math.min(Math.max(0, currentIndex), validVersions.length - 1)
    : 0;

  const artifact = hasVersions ? validVersions[safeIndex] : undefined;
  const previousArtifact =
    hasVersions && safeIndex > 0 ? validVersions[safeIndex - 1] : undefined;

  // Computed properties
  const isNew = !previousArtifact;
  const previousCode = previousArtifact?.code;
  const showDiffOption = !isNew && !!previousCode;

  const copyToClipboard = async () => {
    if (!artifact) return;
    await navigator.clipboard.writeText(artifact.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    if (!artifact) return;
    const blob = new Blob([artifact.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = artifact.filePath.split("/").pop() || "file.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset view to 'code' if diff is not available for this version
  useEffect(() => {
    if (!showDiffOption && view === "diff") {
      setView("code");
    }
  }, [showDiffOption, view]);

  // If versions array is empty (shouldn't happen), handle gracefully
  if (!hasVersions || !artifact) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Artifact>
        <ArtifactHeader>
          <div className="flex flex-col gap-1">
            <ArtifactTitle className="flex items-center gap-2">
              <span className="truncate">{artifact.name}</span>
              {isNew && (
                <Badge variant="secondary" className="text-xs">
                  New
                </Badge>
              )}
              {!isNew && (
                <Badge variant="outline" className="text-xs">
                  Updated
                </Badge>
              )}
            </ArtifactTitle>
            <ArtifactDescription
              className="max-w-[300px] truncate font-mono text-xs"
              title={artifact.filePath}
            >
              {artifact.filePath}
            </ArtifactDescription>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {validVersions.length > 1 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">Version</span>
                </div>
                <Select
                  value={
                    // If we are following latest (null) OR explicitly selected the last one
                    selectedVersionIndex === null ||
                    safeIndex === validVersions.length - 1
                      ? "latest"
                      : `v${safeIndex + 1}`
                  }
                  onValueChange={(value) => {
                    if (value === "latest") {
                      setSelectedVersionIndex(null); // Follow latest
                    } else {
                      // Parse "v4" -> 4 -> index 3
                      const idx = parseInt((value || "").replace("v", ""), 10);
                      if (!Number.isNaN(idx)) {
                        setSelectedVersionIndex(idx - 1);
                      }
                    }
                  }}
                >
                  <SelectTrigger className="h-7 w-[90px] text-xs">
                    <SelectValue placeholder="Version" />
                  </SelectTrigger>
                  <SelectContent>
                    {validVersions.map((_, idx) => (
                      <SelectItem
                        key={idx}
                        value={
                          idx === validVersions.length - 1
                            ? "latest"
                            : `v${idx + 1}`
                        }
                      >
                        v{idx + 1}{" "}
                        {idx === validVersions.length - 1 ? "(Latest)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showDiffOption && (
              <Tabs
                value={view}
                onValueChange={(v) => setView(v as "code" | "diff")}
                className="h-6"
              >
                <TabsList className="h-6 p-0 text-xs">
                  <TabsTrigger value="code" className="h-full px-2 text-[10px]">
                    <FileText className="mr-1 h-3 w-3" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="diff" className="h-full px-2 text-[10px]">
                    <FileDiff className="mr-1 h-3 w-3" />
                    Changes
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            <Badge
              variant="outline"
              className="hidden shrink-0 capitalize sm:inline-flex"
            >
              {artifact.type}
            </Badge>
            <ArtifactActions>
              <ArtifactAction
                icon={copied ? Check : Copy}
                onClick={copyToClipboard}
                label="Copy code"
              />
              <ArtifactAction
                icon={Download}
                onClick={downloadFile}
                label="Download file"
              />
            </ArtifactActions>
          </div>
        </ArtifactHeader>
        <ArtifactContent className="p-0">
          {view === "code" && (
            <CodeBlock
              code={artifact.code}
              language={getLanguage(artifact.filePath)}
              showLineNumbers
              className="dark rounded-none border-none"
            />
          )}

          {view === "diff" && artifact.code && showDiffOption && (
            <div className="border-t">
              <div className="bg-muted/50 px-4 py-2 font-medium text-muted-foreground text-xs">
                Changes from v{safeIndex}
              </div>
              <CodeBlock
                code={createTwoFilesPatch(
                  artifact.filePath,
                  artifact.filePath,
                  previousCode || "",
                  artifact.code,
                  `v${safeIndex}`,
                  `v${safeIndex + 1}`,
                  {
                    context: 10000,
                    ignoreWhitespace: true,
                  },
                )}
                language="diff"
                showLineNumbers
                className="dark rounded-none border-none"
              />
            </div>
          )}
        </ArtifactContent>
      </Artifact>
    </motion.div>
  );
}
