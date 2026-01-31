"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  mapDBPartToUIMessagePart,
  mapUIMessagePartsToDBParts,
} from "@/lib/utils/message-mapping";
import type { MyUIMessage } from "../message-types";
import { getCurrentUser } from "./queries/auth";

export const createChat = async () => {
  const user = await getCurrentUser();

  if (!user?.id) {
    throw new Error("User not found");
  }

  const chat = await prisma.chat.create({
    data: {
      userId: user.id,
      name: "New Chat",
    },
  });
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/chat/${chat.id}`);

  return chat.id;
};

export const upsertMessage = async ({
  chatId,
  message,
  id,
}: {
  id: string;
  chatId: string;
  message: MyUIMessage;
}) => {
  const mappedDBUIParts = mapUIMessagePartsToDBParts(message.parts, id);

  await prisma.$transaction(async (tx) => {
    await tx.message.upsert({
      where: { id },
      create: {
        id,
        chatId,
        role: message.role,
      },
      update: {
        chatId,
      },
    });

    await tx.part.deleteMany({
      where: { messageId: id },
    });

    if (mappedDBUIParts.length > 0) {
      await tx.part.createMany({
        data: mappedDBUIParts,
      });
    }
  });

  revalidatePath(`/dashboard/chat/${chatId}`);
};

export const loadChat = async (chatId: string): Promise<MyUIMessage[]> => {
  const messages = await prisma.message.findMany({
    where: { chatId },
    include: {
      parts: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return messages.map((message) => ({
    id: message.id,
    role: message.role as MyUIMessage["role"],
    parts: message.parts
      .map((part) => mapDBPartToUIMessagePart(part))
      .filter((part) => part !== null),
  }));
};

export const getUserChats = async (userId: string) => {
  return await prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      updatedAt: true,
      createdAt: true,
      prismaSchema: true, // Para mostrar si tiene schema generado
    },
  });
};

export const deleteChat = async (chatId: string) => {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
  });
  if (!chat) return;

  await prisma.chat.delete({
    where: { id: chatId },
  });
  revalidatePath(`/dashboard/chat/${chatId}`);
  redirect("/dashboard");
};

export const updateChatName = async (chatId: string, name: string) => {
  await prisma.chat.update({
    where: { id: chatId },
    data: { name },
  });
  revalidatePath(`/dashboard/chat/${chatId}`);
};

export const deleteMessage = async (messageId: string) => {
  await prisma.$transaction(async (tx) => {
    const targetMessage = await tx.message.findUnique({
      where: { id: messageId },
    });

    if (!targetMessage) return;

    await tx.message.deleteMany({
      where: {
        chatId: targetMessage.chatId,
        createdAt: { gt: targetMessage.createdAt },
      },
    });

    await tx.message.delete({
      where: { id: messageId },
    });
  });
};
