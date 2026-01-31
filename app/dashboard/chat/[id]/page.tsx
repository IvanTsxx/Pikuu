import { redirect } from "next/navigation";
import { loadChat } from "@/lib/db/actions";
import ChatPageContent from "./_components/chat-page-content";

export default async function Page(props: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await props.params; // get the chat ID from the URL

  if (!id) {
    redirect("/dashboard");
  }

  const messages = await loadChat(id); // load the chat messages

  console.log("messages:");
  console.dir(messages, { depth: null });

  return <ChatPageContent id={id} initialMessages={messages} />; // display the chat
}
