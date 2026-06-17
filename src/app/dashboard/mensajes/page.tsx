"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
  getConversations, getConversationMessages, sendMessage,
  getPropertyById, getUserById,
} from "@/lib/storage";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Conversation, Message } from "@/lib/types";
import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

export default function MensajesPage() {
  const { user, allowed } = useAuthGuard(["seller", "buyer"]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const loadConversations = () => {
    if (!user) return;
    const convs = getConversations().filter(
      (c) => c.sellerId === user.id || c.buyerId === user.id
    );
    setConversations(convs.sort((a, b) =>
      new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()
    ));
  };

  useEffect(() => { loadConversations(); }, [user]);

  useEffect(() => {
    if (selected) {
      setMessages(getConversationMessages(selected));
    }
  }, [selected]);

  const handleSend = (text: string) => {
    if (!selected || !user) return;
    sendMessage(selected, user.id, text);
    setMessages(getConversationMessages(selected));
    loadConversations();
  };

  if (!allowed) return null;

  const getConvTitle = (conv: Conversation) => {
    const property = getPropertyById(conv.propertyId);
    const otherId = conv.sellerId === user?.id ? conv.buyerId : conv.sellerId;
    const other = getUserById(otherId);
    return `${other?.firstName || "Usuario"} - ${property?.title?.slice(0, 30) || "Propiedad"}`;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-title">Mensajes</h1>
        <p className="text-muted">Tus conversaciones con compradores y vendedores</p>
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon={<MessageCircle size={32} />}
          title="No hay mensajes"
          description="Cuando contactes a un vendedor o recibas consultas, aparecerán aquí"
          action={{ label: "Ver propiedades", href: "/propiedades" }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <div className="card overflow-hidden !p-0">
            <div className="p-4 border-b border-black/5 dark:border-white/5">
              <h3 className="font-semibold text-title text-sm">Conversaciones</h3>
            </div>
            <div className="overflow-y-auto max-h-[520px]">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv.id)}
                  className={cn(
                    "w-full text-left p-4 border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                    selected === conv.id && "bg-secondary/10"
                  )}
                >
                  <p className="text-sm font-medium text-title truncate">{getConvTitle(conv)}</p>
                  {conv.lastMessage && (
                    <p className="text-xs text-muted truncate mt-1">{conv.lastMessage}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            {selected ? (
              <ChatWindow
                messages={messages}
                currentUserId={user!.id}
                onSend={handleSend}
                title={getConvTitle(conversations.find((c) => c.id === selected)!)}
              />
            ) : (
              <div className="card h-full flex items-center justify-center text-muted">
                Selecciona una conversación
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
