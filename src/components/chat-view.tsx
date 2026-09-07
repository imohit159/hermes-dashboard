"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: assistantContent } : m
          )
        );
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            Start a conversation with Hermes
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[80%] rounded-lg px-4 py-2 text-sm",
              msg.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
            <div className="text-xs opacity-50 mt-1">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-muted rounded-lg px-4 py-2 text-sm inline-block">
            <span className="animate-pulse">...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
