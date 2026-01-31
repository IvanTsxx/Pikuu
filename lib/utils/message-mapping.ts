/** biome-ignore-all lint/suspicious/noExplicitAny: <false positive> */

import type { Part } from "@/app/generated/prisma/client";
import type { ArtifactData, MyUIMessagePart } from "../message-types";

export function mapUIMessagePartsToDBParts(
  parts: MyUIMessagePart[],
  messageId: string,
) {
  return parts.map((part, index) => {
    const basePart = {
      messageId,
      type: part.type,
      order: index,
    };

    // Text part
    if (part.type === "text") {
      return {
        ...basePart,
        text_text: part.text,
      };
    }

    // Reasoning part
    if (part.type === "reasoning") {
      return {
        ...basePart,
        reasoning_text: part.text,
        providerMetadata: part.providerMetadata
          ? (part.providerMetadata as any)
          : undefined,
      };
    }

    // File part
    if (part.type === "file") {
      return {
        ...basePart,
        file_mediaType: part.mediaType,
        file_filename: part.filename,
        file_url: part.url,
      };
    }

    // Source URL part
    if (part.type === "source-url") {
      return {
        ...basePart,
        source_url_sourceId: part.sourceId,
        source_url_url: part.url,
        source_url_title: part.title,
        providerMetadata: part.providerMetadata
          ? (part.providerMetadata as any)
          : undefined,
      };
    }

    // Source Document part
    if (part.type === "source-document") {
      return {
        ...basePart,
        source_document_sourceId: part.sourceId,
        source_document_mediaType: part.mediaType,
        source_document_title: part.title,
        source_document_filename: part.filename,
        providerMetadata: part.providerMetadata
          ? (part.providerMetadata as any)
          : undefined,
      };
    }

    // Tool: generatePrisma
    if (part.type === "tool-generatePrisma") {
      return {
        ...basePart,
        tool_toolCallId: part.toolCallId,
        tool_state: part.state,
        tool_errorText: part.errorText,
        tool_generatePrisma_input:
          part.state === "input-available" ||
          part.state === "output-available" ||
          part.state === "output-error"
            ? (part.input as any)
            : undefined,
        tool_generatePrisma_output:
          part.state === "output-available" ? (part.output as any) : undefined,
      };
    }

    // Tool: generateZod
    if (part.type === "tool-generateZod") {
      return {
        ...basePart,
        tool_toolCallId: part.toolCallId,
        tool_state: part.state,
        tool_errorText: part.errorText,
        tool_generateZod_input:
          part.state === "input-available" ||
          part.state === "output-available" ||
          part.state === "output-error"
            ? (part.input as any)
            : undefined,
        tool_generateZod_output:
          part.state === "output-available" ? (part.output as any) : undefined,
      };
    }

    // Tool: generateCrud
    if (part.type === "tool-generateCrud") {
      return {
        ...basePart,
        tool_toolCallId: part.toolCallId,
        tool_state: part.state,
        tool_errorText: part.errorText,
        tool_generateCrud_input:
          part.state === "input-available" ||
          part.state === "output-available" ||
          part.state === "output-error"
            ? (part.input as any)
            : undefined,
        tool_generateCrud_output:
          part.state === "output-available" ? (part.output as any) : undefined,
      };
    }

    // Tool: generateForms
    if (part.type === "tool-generateForms") {
      return {
        ...basePart,
        tool_toolCallId: part.toolCallId,
        tool_state: part.state,
        tool_errorText: part.errorText,
        tool_generateForms_input:
          part.state === "input-available" ||
          part.state === "output-available" ||
          part.state === "output-error"
            ? (part.input as any)
            : undefined,
        tool_generateForms_output:
          part.state === "output-available" ? (part.output as any) : undefined,
      };
    }

    // Tool: generateWorkflow
    if (part.type === "tool-generateWorkflow") {
      return {
        ...basePart,
        tool_toolCallId: part.toolCallId,
        tool_state: part.state,
        tool_errorText: part.errorText,
        tool_generateWorkflow_input:
          part.state === "input-available" ||
          part.state === "output-available" ||
          part.state === "output-error"
            ? (part.input as any)
            : undefined,
        tool_generateWorkflow_output:
          part.state === "output-available" ? (part.output as any) : undefined,
      };
    }

    // Data: artifact - CORREGIDO: ahora accede a part.data directamente
    if (part.type === "data-artifact") {
      return {
        ...basePart,
        data_artifact_name: part.data.name,
        data_artifact_type: part.data.type,
        data_artifact_filePath: part.data.filePath,
        data_artifact_code: part.data.code,
        data_artifact_previousCode: part.data.previousCode,
        data_artifact_diff: part.data.diff,
        data_artifact_isNew: part.data.isNew,
      };
    }

    return basePart;
  });
}

export function mapDBPartToUIMessagePart(part: Part): MyUIMessagePart {
  // Text part
  if (part.type === "text" && part.text_text) {
    return {
      type: "text",
      text: part.text_text,
    };
  }

  // Reasoning part
  if (part.type === "reasoning" && part.reasoning_text) {
    return {
      type: "reasoning",
      text: part.reasoning_text,
      providerMetadata: part.providerOptions
        ? (part.providerOptions as any)
        : undefined,
    };
  }

  // File part
  if (part.type === "file" && part.file_mediaType && part.file_url) {
    return {
      type: "file",
      mediaType: part.file_mediaType,
      filename: part.file_filename ?? undefined,
      url: part.file_url,
    };
  }

  // Source URL part
  if (
    part.type === "source-url" &&
    part.source_url_sourceId &&
    part.source_url_url
  ) {
    return {
      type: "source-url",
      sourceId: part.source_url_sourceId,
      url: part.source_url_url,
      title: part.source_url_title ?? undefined,
      providerMetadata: part.providerOptions
        ? (part.providerOptions as any)
        : undefined,
    };
  }

  // Source Document part
  if (
    part.type === "source-document" &&
    part.source_document_sourceId &&
    part.source_document_mediaType &&
    part.source_document_title
  ) {
    return {
      type: "source-document",
      sourceId: part.source_document_sourceId,
      mediaType: part.source_document_mediaType,
      title: part.source_document_title,
      filename: part.source_document_filename ?? undefined,
      providerMetadata: part.providerOptions
        ? (part.providerOptions as any)
        : undefined,
    };
  }

  // Tool: generatePrisma
  if (
    part.type === "tool-generatePrisma" &&
    part.tool_toolCallId &&
    part.tool_state
  ) {
    switch (part.tool_state) {
      case "input-streaming":
        return {
          type: "tool-generatePrisma",
          state: "input-streaming",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generatePrisma_input as any,
        };
      case "input-available":
        return {
          type: "tool-generatePrisma",
          state: "input-available",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generatePrisma_input as any,
        };
      case "output-available":
        return {
          type: "tool-generatePrisma",
          state: "output-available",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generatePrisma_input as any,
          output: part.tool_generatePrisma_output as any,
        };
      case "output-error":
        return {
          type: "tool-generatePrisma",
          state: "output-error",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generatePrisma_input as any,
          errorText: part.tool_errorText ?? "",
        };
    }
  }

  // Tool: generateZod
  if (
    part.type === "tool-generateZod" &&
    part.tool_toolCallId &&
    part.tool_state
  ) {
    switch (part.tool_state) {
      case "input-streaming":
        return {
          type: "tool-generateZod",
          state: "input-streaming",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateZod_input as any,
        };
      case "input-available":
        return {
          type: "tool-generateZod",
          state: "input-available",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateZod_input as any,
        };
      case "output-available":
        return {
          type: "tool-generateZod",
          state: "output-available",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateZod_input as any,
          output: part.tool_generateZod_output as any,
        };
      case "output-error":
        return {
          type: "tool-generateZod",
          state: "output-error",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateZod_input as any,
          errorText: part.tool_errorText ?? "",
        };
    }
  }

  // Tool: generateCrud
  if (
    part.type === "tool-generateCrud" &&
    part.tool_toolCallId &&
    part.tool_state
  ) {
    switch (part.tool_state) {
      case "input-streaming":
        return {
          type: "tool-generateCrud",
          state: "input-streaming",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateCrud_input as any,
        };
      case "input-available":
        return {
          type: "tool-generateCrud",
          state: "input-available",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateCrud_input as any,
        };
      case "output-available":
        return {
          type: "tool-generateCrud",
          state: "output-available",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateCrud_input as any,
          output: part.tool_generateCrud_output as any,
        };
      case "output-error":
        return {
          type: "tool-generateCrud",
          state: "output-error",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateCrud_input as any,
          errorText: part.tool_errorText ?? "",
        };
    }
  }

  // Tool: generateForms
  if (
    part.type === "tool-generateForms" &&
    part.tool_toolCallId &&
    part.tool_state
  ) {
    switch (part.tool_state) {
      case "input-streaming":
        return {
          type: "tool-generateForms",
          state: "input-streaming",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateForms_input as any,
        };
      case "input-available":
        return {
          type: "tool-generateForms",
          state: "input-available",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateForms_input as any,
        };
      case "output-available":
        return {
          type: "tool-generateForms",
          state: "output-available",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateForms_input as any,
          output: part.tool_generateForms_output as any,
        };
      case "output-error":
        return {
          type: "tool-generateForms",
          state: "output-error",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateForms_input as any,
          errorText: part.tool_errorText ?? "",
        };
    }
  }

  // Tool: generateWorkflow
  if (
    part.type === "tool-generateWorkflow" &&
    part.tool_toolCallId &&
    part.tool_state
  ) {
    switch (part.tool_state) {
      case "input-streaming":
        return {
          type: "tool-generateWorkflow",
          state: "input-streaming",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateWorkflow_input as any,
        };
      case "input-available":
        return {
          type: "tool-generateWorkflow",
          state: "input-available",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateWorkflow_input as any,
        };
      case "output-available":
        return {
          type: "tool-generateWorkflow",
          state: "output-available",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateWorkflow_input as any,
          output: part.tool_generateWorkflow_output as any,
        };
      case "output-error":
        return {
          type: "tool-generateWorkflow",
          state: "output-error",
          toolCallId: part.tool_toolCallId,
          input: part.tool_generateWorkflow_input as any,
          errorText: part.tool_errorText ?? "",
        };
    }
  }

  // Data: artifact - CORREGIDO: devuelve con estructura `data`
  if (
    part.type === "data-artifact" &&
    part.data_artifact_name &&
    part.data_artifact_type &&
    part.data_artifact_filePath &&
    part.data_artifact_code
  ) {
    return {
      type: "data-artifact",
      data: {
        id: part.data_artifact_id ?? part.id,
        name: part.data_artifact_name,
        type: part.data_artifact_type as ArtifactData["type"],
        filePath: part.data_artifact_filePath,
        code: part.data_artifact_code,
        previousCode: part.data_artifact_previousCode ?? undefined,
        diff: part.data_artifact_diff ?? undefined,
        isNew: part.data_artifact_isNew ?? undefined,
      },
      id: part.data_artifact_id ?? part.id,
    };
  }

  // Fallback
  return null as any;
}
