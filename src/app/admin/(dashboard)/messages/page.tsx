import { getContactMessages } from "@/lib/supabase/data-service";
import { MessagesManager } from "@/components/admin/messages-manager";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Inquiries & Contact Messages
        </h1>
        <p className="text-sm text-muted-foreground">
          Review visitor messages, project inquiries, and client collaboration requests submitted via your public portfolio.
        </p>
      </div>

      <MessagesManager initialMessages={messages} />
    </div>
  );
}
