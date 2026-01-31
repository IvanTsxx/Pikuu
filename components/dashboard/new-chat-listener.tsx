"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { createChat } from "@/lib/db/actions";

export function NewChatListener() {
  const router = useRouter();
  const processedRef = useRef(false);

  useEffect(() => {
    const checkPrompt = async () => {
      if (processedRef.current) return;

      const prompt = localStorage.getItem("pikuu_initial_prompt");
      if (!prompt) return;

      processedRef.current = true;
      // NOTE: We intentionally do NOT remove the prompt from localStorage here
      // The chat component will read it and remove it when it mounts
      // This prevents race conditions and ensures the prompt is sent properly

      try {
        const toastId = toast.loading("Iniciando tu proyecto...", {
          duration: 10000,
        });

        // Create new chat
        const chatId = await createChat();

        toast.dismiss(toastId);

        router.push(`/dashboard/chat/${chatId}`);
      } catch (error) {
        console.error("Error creating chat from landing prompt:", error);
        toast.error("Ocurrió un error al iniciar el proyecto");
      }
    };

    checkPrompt();
  }, [router]);

  return null;
}
