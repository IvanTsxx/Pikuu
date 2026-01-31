import { type ClassValue, clsx } from "clsx";
import type { BundledLanguage } from "shiki";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguage(filePath: string): BundledLanguage {
  if (filePath.endsWith(".ts") || filePath.endsWith(".tsx"))
    return "typescript";
  if (filePath.endsWith(".js") || filePath.endsWith(".jsx"))
    return "javascript";
  if (filePath.endsWith(".prisma")) return "prisma";
  if (filePath.endsWith(".json")) return "json";
  if (filePath.endsWith(".md")) return "markdown";
  if (filePath.endsWith(".css")) return "css";
  if (filePath.endsWith(".html")) return "html";
  return "typescript";
}
