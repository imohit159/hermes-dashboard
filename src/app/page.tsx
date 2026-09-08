"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const HERMES_API = "/api/hermes";

interface Session {
  id: string;
  source: string;
  title: string;
  message_count: number;
  last_active: number;
  preview: string;
}

interface Profile {
  name: string;
  skills: string[];
}

export default function CommandCenter() {
  const [tab, setTab] = useState<"today" | "sessions" | "skills" | "chat">("today");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${HERMES_API}/sessions`)
      .then((r) => r.json())
      .then((d) => setSessions(d.data || []))
      .catch(console.error);
    fetch(`${HERMES_API}/profiles`)
      .then((r) => r.json())
      .then((d) => setProfiles(d.profiles || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const telegramSessions = sessions.filter((s) => s.source === "telegram");
  const desktopSessions = sessions.filter((s) => s.source === "desktop");
  const cliSessions = sessions.filter((s) => s.source === "cli");

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Command Center</h2>
            <p className="text-sm text-muted-foreground">AI agent orchestration system</p>
          </div>
          <div className="flex gap-1 bg-muted rounded-md p-1">
            {(["today", "sessions", "skills", "chat"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded transition-colors capitalize",
                  tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>
        ) : (
          <>
            {tab === "today" && <TodayView sessions={sessions} profiles={profiles} />}
            {tab === "sessions" && (
              <div className="space-y-6">
                <SessionSection title="Telegram" sessions={telegramSessions} />
                <SessionSection title="Desktop" sessions={desktopSessions} />
                <SessionSection title="CLI" sessions={cliSessions} />
              </div>
            )}
            {tab === "skills" && <SkillsView profiles={profiles} />}
            {tab === "chat" && <ChatView />}
          </>
        )}
      </div>
    </div>
  );
}

function TodayView({ sessions, profiles }: { sessions: Session[]; profiles: Profile[] }) {
  const activeSessions = sessions.filter((s) => !s.title?.includes("greeting") && s.message_count > 5).slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card title="Active Agents" subtitle={`${profiles.length} profiles`}>
        <div className="space-y-2">
          {profiles.map((p) => (
            <div key={p.name} className="flex items-center justify-between text-sm">
              <span className="capitalize">{p.name}</span>
              <span className="text-xs text-muted-foreground">{p.skills.length} skills</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Recent Sessions" subtitle={`${sessions.length} total`}>
        <div className="space-y-2">
          {activeSessions.map((s) => (
            <div key={s.id} className="text-sm">
              <div className="truncate">{s.title || "Untitled"}</div>
              <div className="text-xs text-muted-foreground">
                {s.source} · {s.message_count} msgs
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Quick Stats" subtitle="Last 24h">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Sessions</span>
            <span className="text-muted-foreground">{sessions.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Telegram</span>
            <span className="text-muted-foreground">{sessions.filter((s) => s.source === "telegram").length}</span>
          </div>
          <div className="flex justify-between">
            <span>Desktop</span>
            <span className="text-muted-foreground">{sessions.filter((s) => s.source === "desktop").length}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SessionSection({ title, sessions }: { title: string; sessions: Session[] }) {
  if (sessions.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">{title} ({sessions.length})</h3>
      <div className="border border-border rounded-md divide-y divide-border">
        {sessions.slice(0, 10).map((s) => (
          <div key={s.id} className="flex items-center justify-between px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm truncate">{s.title || "Untitled"}</div>
              <div className="text-xs text-muted-foreground truncate">{s.preview}</div>
            </div>
            <div className="text-xs text-muted-foreground ml-4 shrink-0">
              {s.message_count} msgs
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsView({ profiles }: { profiles: Profile[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {profiles.map((p) => (
        <Card key={p.name} title={p.name} subtitle={`${p.skills.length} skills`}>
          <div className="flex flex-wrap gap-1">
            {p.skills.map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 bg-muted rounded">
                {s}
              </span>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function ChatView() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/hermes/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "hermes-agent",
          messages: newMessages,
          stream: true,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        setMessages([...newMessages, { role: "assistant", content: `Error ${res.status}: ${text}` }]);
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setMessages([...newMessages, { role: "assistant", content: "No response body" }]);
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let content = "";
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const json = JSON.parse(line.replace("data: ", ""));
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              content += delta;
              setMessages([...newMessages, { role: "assistant", content }]);
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: `Error: ${error}` }]);
    } finally {
      setIsLoading(false);
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
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[80%] rounded-lg px-4 py-2 text-sm",
              m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button onClick={send} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
