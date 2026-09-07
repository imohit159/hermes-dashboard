"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const profiles = [
  { id: "chief", name: "Orchestrator", nickname: "chief", icon: "◎" },
  { id: "scribe", name: "Scribe", nickname: "echo", icon: "✦" },
  { id: "guidance", name: "Guidance", nickname: "pulse", icon: "◈" },
  { id: "career", name: "Career", nickname: "atlas", icon: "⬡" },
  { id: "builder", name: "Builder", nickname: "forge", icon: "⬢" },
];

export function Sidebar() {
  const [active, setActive] = useState("chief");

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-semibold tracking-tight">Hermes</h1>
        <p className="text-xs text-muted-foreground">AI Agent Orchestration</p>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              active === p.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="text-base">{p.icon}</span>
            <div className="text-left">
              <div className="font-medium">{p.name}</div>
              <div className="text-xs opacity-70">{p.nickname}</div>
            </div>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">M</div>
          <div className="text-sm">
            <div className="font-medium">Mohit</div>
            <div className="text-xs text-muted-foreground">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
