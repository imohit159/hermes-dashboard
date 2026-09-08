"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const profiles = [
  { id: "chief", name: "Orchestrator", nickname: "chief", icon: "◎", status: "running", activeTask: "Coordinating job search workflow" },
  { id: "scribe", name: "Scribe", nickname: "echo", icon: "✦", status: "idle", activeTask: "Last: drafted LinkedIn post 2h ago" },
  { id: "guidance", name: "Guidance", nickname: "pulse", icon: "◈", status: "running", activeTask: "Adjusting meal plan for training" },
  { id: "career", name: "Career", nickname: "atlas", icon: "⬡", status: "running", activeTask: "Qualifying 12 new job listings" },
  { id: "builder", name: "Builder", nickname: "forge", icon: "⬢", status: "idle", activeTask: "Last: scaffolded React project 5h ago" },
];

const workflows = [
  { id: 1, name: "Job Search", profile: "Career", progress: 67, stage: "Qualifying listings", status: "running" },
  { id: 2, name: "Content Pipeline", profile: "Scribe", progress: 30, stage: "Researching topics", status: "running" },
  { id: 3, name: "Health Tracker", profile: "Guidance", progress: 85, stage: "Finalizing meal plan", status: "running" },
  { id: 4, name: "Portfolio Update", profile: "Builder", progress: 100, stage: "Completed", status: "completed" },
];

const approvals = [
  { id: 1, name: "Resume variant for Stripe", profile: "Career", type: "Resume", priority: "high", createdAt: "1h ago" },
  { id: 2, name: "LinkedIn post draft", profile: "Scribe", type: "Content", priority: "medium", createdAt: "2h ago" },
  { id: 3, name: "Job application prep (3 roles)", profile: "Career", type: "Application", priority: "high", createdAt: "3h ago" },
  { id: 4, name: "Blog post: React 19 features", profile: "Scribe", type: "Content", priority: "low", createdAt: "5h ago" },
];

const artifacts = [
  { id: 1, name: "job-tracker-2026-09-07.md", profile: "Career", type: "Tracker", size: "24 KB", createdAt: "30m ago" },
  { id: 2, name: "resume-stripe-v3.pdf", profile: "Career", type: "Resume", size: "156 KB", createdAt: "1h ago" },
  { id: 3, name: "linkedin-post-draft.md", profile: "Scribe", type: "Draft", size: "2.4 KB", createdAt: "2h ago" },
  { id: 4, name: "meal-plan-week38.pdf", profile: "Guidance", type: "Plan", size: "8 KB", createdAt: "5h ago" },
  { id: 5, name: "project-scaffold.tar.gz", profile: "Builder", type: "Archive", size: "42 KB", createdAt: "1d ago" },
];

export default function CommandCenter() {
  const [tab, setTab] = useState<"today" | "chat" | "preview" | "tasks">("today");

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Command Center</h2>
            <p className="text-sm text-muted-foreground">Real-time overview of your agent fleet</p>
          </div>
          <div className="flex gap-1 bg-muted rounded-md p-1">
            {(["today", "chat", "preview", "tasks"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded transition-colors capitalize",
                  tab === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-auto">
        {tab === "today" && <TodayView />}
        {tab === "chat" && <ChatPlaceholder />}
        {tab === "preview" && <PreviewPlaceholder />}
        {tab === "tasks" && <TasksPlaceholder />}
      </div>
    </div>
  );
}

function TodayView() {
  return (
    <div className="space-y-6">
      {/* Agent Fleet Status */}
      <section>
        <h3 className="text-sm font-semibold mb-3">Agent Fleet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {profiles.map((p) => (
            <div
              key={p.id}
              className={cn(
                "border rounded-lg p-3 bg-card",
                p.status === "running" ? "border-green-500/30" : "border-border"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{p.icon}</span>
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.nickname}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  p.status === "running" ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                )} />
                <span className="text-xs text-muted-foreground capitalize">{p.status}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{p.activeTask}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Active Workflows with Progress */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Active Workflows</h3>
          <span className="text-xs text-muted-foreground">{workflows.filter(w => w.status === "running").length} running</span>
        </div>
        <div className="space-y-2">
          {workflows.map((w) => (
            <div key={w.id} className="border border-border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{w.name}</span>
                  <span className="text-xs text-muted-foreground">{w.profile}</span>
                </div>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  w.status === "completed" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                )}>{w.status}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      w.status === "completed" ? "bg-green-500" : "bg-blue-500"
                    )}
                    style={{ width: `${w.progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">{w.progress}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{w.stage}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Two columns: Approvals + Artifacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Queue */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Needs Approval</h3>
            <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full">{approvals.length}</span>
          </div>
          <div className="border border-border rounded-md divide-y divide-border">
            {approvals.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="text-sm">{a.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{a.profile}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{a.type}</span>
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded",
                      a.priority === "high" ? "bg-red-500/10 text-red-500" :
                      a.priority === "medium" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-gray-500/10 text-gray-500"
                    )}>{a.priority}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{a.createdAt}</span>
                  <button className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded">Review</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Artifacts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Recent Outputs</h3>
            <button className="text-xs text-primary hover:underline">View all</button>
          </div>
          <div className="border border-border rounded-md divide-y divide-border">
            {artifacts.map((art) => (
              <div key={art.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-6">{art.type === "Resume" ? "📄" : art.type === "Draft" ? "📝" : art.type === "Tracker" ? "📊" : art.type === "Plan" ? "🥗" : "📦"}</span>
                  <div>
                    <div className="text-sm truncate max-w-[180px]">{art.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{art.profile}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{art.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{art.createdAt}</span>
                  <button className="text-xs px-2 py-1 border border-border rounded hover:bg-muted">Open</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ChatPlaceholder() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">Chat interface</p>
          <p className="text-sm">Select a profile and start chatting</p>
        </div>
      </div>
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewPlaceholder() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="border border-border rounded-md p-4">
          <p className="text-xs text-muted-foreground mb-2">Editor (Markdown)</p>
          <textarea
            className="w-full h-full resize-none bg-transparent text-sm font-mono focus:outline-none"
            placeholder="Write markdown here..."
          />
        </div>
        <div className="border border-border rounded-md p-4">
          <p className="text-xs text-muted-foreground mb-2">Preview</p>
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
            <p className="text-muted-foreground">Preview will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TasksPlaceholder() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Active tasks across all profiles</p>
      </div>
      <div className="border border-border rounded-md divide-y divide-border">
        <TaskRow title="Qualify 12 new job listings" profile="Career" status="in progress" />
        <TaskRow title="Draft Hashnode article" profile="Scribe" status="pending" />
        <TaskRow title="Adjust meal plan for training" profile="Guidance" status="pending" />
        <TaskRow title="Scout React 19 features" profile="Builder" status="completed" />
      </div>
    </div>
  );
}

function TaskRow({ title, profile, status }: { title: string; profile: string; status: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm">{title}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">{profile}</span>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          status === "completed" ? "bg-green-500/10 text-green-500" :
          status === "in progress" ? "bg-blue-500/10 text-blue-500" :
          "bg-yellow-500/10 text-yellow-500"
        )}>{status}</span>
      </div>
    </div>
  );
}
