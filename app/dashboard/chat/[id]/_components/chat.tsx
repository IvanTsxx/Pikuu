"use client";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type ToolUIPart,
} from "ai";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

import { deleteChat } from "@/lib/db/actions";
import type { MyUIMessage } from "@/lib/message-types";
import type { ArtifactSection } from "@/lib/types";

// Helper para truncar inputs largos en la UI
const sanitizeInput = (input: unknown): unknown => {
  if (typeof input === "string") {
    return input.length > 200 ? `${input.slice(0, 200)}... (truncated)` : input;
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === "object" && input !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return input;
};

const ToolRenderer = ({ part }: { part: ToolUIPart }) => {
  const isCompleted = part.state === "output-available";
  const isError = part.state === "output-error";
  const hasResponse = isCompleted || isError;

  const displayInput = sanitizeInput(part.input);

  return (
    <Tool defaultOpen={hasResponse}>
      <ToolHeader
        state={part.state}
        type={part.type}
        title={part.title ?? part.type}
      />
      <ToolContent>
        {/* Siempre mostramos el input (parámetros) sanitizado */}
        <ToolInput input={displayInput} />
        <ToolOutput errorText={part.errorText} output={part.output} />
      </ToolContent>
    </Tool>
  );
};

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) {
    return null;
  }
  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

interface ChatProps {
  onArtifactsChange?: (artifacts: ArtifactSection[]) => void;
  id: string;
  initialMessages?: MyUIMessage[];
}

const Chat = ({ onArtifactsChange, id, initialMessages }: ChatProps) => {
  const artifactsMapRef = useRef<Map<string, ArtifactSection>>(new Map());
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop, regenerate } =
    useChat<MyUIMessage>({
      id, // use the provided chatId
      messages: initialMessages, // initial messages if provided
      transport: new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => {
          // send only the last message and chat id
          // we will then fetch message history (for our chatId) on server
          // and append this message for the full context to send to the model
          const lastMessage = messages[messages.length - 1];
          return {
            body: {
              message: lastMessage,
              chatId: id,
            },
          };
        },
      }),
      onError: async (error) => {
        stop();
        try {
          // Intentar parsear el error si viene como JSON string
          const errorObj = JSON.parse(error.message);
          if (errorObj.error === "Insufficient credits") {
            // ELiminar el chat y mandarlo al dashboard
            await deleteChat(id);
            router.push("/dashboard");
            const description = errorObj.missingCredits
              ? `Te faltan ${errorObj.missingCredits} créditos. Te recomendamos comprar el ${errorObj.recommendedPackage}.`
              : "No tienes suficientes créditos para realizar esta acción.";

            toast.error("Créditos insuficientes", {
              description,
              action: {
                label: `Comprar ${errorObj.recommendedPackage || "Créditos"}`,
                onClick: () => router.push("/dashboard/pricing"),
              },
              duration: 10000,
            });

            return;
          }
        } catch {
          // Si no es JSON, checkear el status o mensaje directo
        }

        if (
          error.message.includes("Insufficient credits") ||
          error.message.includes("402")
        ) {
          toast.error("Créditos insuficientes", {
            description:
              "No tienes suficientes créditos para realizar esta acción.",
            action: {
              label: "Comprar",
              onClick: () => router.push("/dashboard/pricing"),
            },
            duration: 10000,
          });
        } else {
          toast.error("Ha ocurrido un error", {
            description:
              "No se pudo procesar tu mensaje. Por favor intenta de nuevo.",
          });
        }
      },
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      onData: ({ data, type }) => {
        if (type !== "data-artifact") return;

        const artifact = data;

        if (!artifact?.filePath) return;

        const map = artifactsMapRef.current;

        const prev = map.get(artifact.filePath);

        // Merge incremental (streaming-safe)
        map.set(artifact.filePath, {
          ...prev,
          ...artifact,
          // evita borrar code si viene vacío en una fase temprana
          code: artifact.code || prev?.code || "",
        });

        onArtifactsChange?.(Array.from(map.values()));
      },
    });

  // Auto-send message from landing page using localStorage
  // This is more reliable than checking initialMessages
  const hasProcessedLandingPromptRef = useRef(false);
  useEffect(() => {
    // Prevent duplicate processing
    if (hasProcessedLandingPromptRef.current) return;
    hasProcessedLandingPromptRef.current = true;

    // Check if there's a pending prompt from the landing page
    const pendingPrompt = localStorage.getItem("pikuu_initial_prompt");

    if (pendingPrompt && pendingPrompt.trim()) {
      // Remove it immediately to prevent double-sending
      localStorage.removeItem("pikuu_initial_prompt");

      // Send the message after a small delay to ensure chat is ready
      sendMessage({
        text: pendingPrompt,
      });
    }
  }, [sendMessage]);

  const router = useRouter();
  const [hasRefreshedName, setHasRefreshedName] = useState(false);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant") {
      const chatNamePart = lastMessage.parts.find(
        (part) => part.type === "data-chatName",
      );

      if (chatNamePart && !hasRefreshedName) {
        setHasRefreshedName(true);
        router.refresh();
      }
    }
  }, [messages, router, hasRefreshedName]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);
    if (!(hasText || hasAttachments)) {
      return;
    }
    sendMessage({
      text: message.text || "Sent with attachments",
      files: message.files,
    });
    setInput("");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <Conversation className="flex-1 overflow-hidden">
        <ConversationContent className="px-4 py-6 md:px-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-10 flex flex-col gap-4 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {message.role === "assistant" &&
                message.parts.filter((part) => part.type === "source-url")
                  .length > 0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          (part) => part.type === "source-url",
                        ).length
                      }
                    />
                    {message.parts
                      .filter((part) => part.type === "source-url")
                      .map((part, i) => (
                        <SourcesContent key={`${message.id}-${i}`}>
                          <Source
                            key={`${message.id}-${i}`}
                            href={part.url}
                            title={part.url}
                          />
                        </SourcesContent>
                      ))}
                  </Sources>
                )}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text": {
                    // Skip text parts that contain raw tool call syntax
                    // These should be rendered as tool-ui parts instead
                    const hasToolCallSyntax =
                      part.text.includes("<tool_call>") ||
                      part.text.includes("</tool_call>") ||
                      part.text.includes('"name":');

                    if (hasToolCallSyntax) {
                      return null;
                    }

                    return (
                      <Message
                        key={`${message.id}-${i}`}
                        role={message.role}
                        from={message.role}
                      >
                        <MessageContent>
                          <MessageResponse isAnimating mode="streaming">
                            {part.text}
                          </MessageResponse>
                        </MessageContent>
                        {message.role === "assistant" &&
                          status !== "streaming" && (
                            <MessageActions>
                              <MessageAction
                                onClick={() => regenerate()}
                                label="Retry"
                                className="rounded-md p-1 hover:bg-accent"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                                className="rounded-md p-1 hover:bg-accent"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                      </Message>
                    );
                  }

                  case "reasoning":
                    return (
                      <Reasoning
                        key={`${message.id}-${i}`}
                        className="w-full max-w-[85%] border-primary/20 border-l-2 py-2 pl-4"
                        isStreaming={
                          status === "streaming" &&
                          i === message.parts.length - 1 &&
                          message.id === messages.at(-1)?.id
                        }
                      >
                        <ReasoningTrigger className="font-bold text-primary/60 text-xs uppercase tracking-widest" />
                        <ReasoningContent className="text-muted-foreground text-sm italic">
                          {part.text}
                        </ReasoningContent>
                      </Reasoning>
                    );

                  case "data-artifact":
                  case "data-chatName":
                    return null;

                  default:
                    if (part.type.startsWith("tool-")) {
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="w-full max-w-[85%]"
                        >
                          <ToolRenderer part={part as ToolUIPart} />
                        </div>
                      );
                    }
                    return null;
                }
              })}
            </div>
          ))}

          {(status === "submitted" || status === "streaming") && <Loader />}
          {status === "error" && (
            <div className="flex items-center justify-center">
              <p className="text-red-500">Error al generar la respuesta</p>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="bg-linear-to-t from-background via-background to-transparent p-4 pt-10 md:p-6">
        <PromptInput
          onSubmit={handleSubmit}
          className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow transition-all duration-300 focus-within:border-primary/50"
          globalDrop
          multiple
        >
          <PromptInputHeader>
            <PromptInputAttachmentsDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Hazme una pregunta sobre tu proyecto..."
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
            </PromptInputTools>
            <PromptInputSubmit
              onStop={stop}
              disabled={!input && !status}
              status={status}
              className="rounded-xl px-6 font-bold shadow-vercel-sm transition-transform active:scale-95"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};
export default Chat;
