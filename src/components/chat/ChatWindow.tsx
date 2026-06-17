"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";
import { Send } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  onSend: (text: string) => void;
  title?: string;
}

export function ChatWindow({ messages, currentUserId, onSend, title }: ChatWindowProps) {
  const [text, setText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full min-h-[400px] card overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-black/5 dark:border-white/5 bg-secondary/5">
          <h3 className="font-semibold text-title text-sm">{title}</h3>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E5DDD5]/30 dark:bg-[#0F172A]">
        {messages.length === 0 ? (
          <p className="text-center text-muted text-sm py-8">No hay mensajes aún. ¡Inicia la conversación!</p>
        ) : (
          messages.map((msg) => {
            const isSent = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={cn("flex", isSent ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] px-4 py-2 text-sm",
                    isSent ? "chat-bubble-sent" : "chat-bubble-received"
                  )}
                >
                  <p>{msg.text}</p>
                  <p className={cn("text-[10px] mt-1", isSent ? "text-green-700 dark:text-blue-200" : "text-muted")}>
                    {new Date(msg.createdAt).toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-black/5 dark:border-white/5 bg-card">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="input flex-1 !py-2"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
