"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MarkdownPreview } from "@/components/markdown-preview";
import { ChatView } from "@/components/chat-view";

const tabs = ["Today", "Chat", "Preview", "Tasks"] as const;
type Tab = (typeof tabs)[number];

export default function CommandCenter() {
  const [tab, setTab] = useState<Tab>("Today");

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Command Center</h2>
            <p className="text-sm text-muted-foreground">Today's overview and active workflows</p>
          </div>
          <div className="flex gap-1 bg-muted rounded-md p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded transition-colors",
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
        {tab === "Today" && <TodayView />}
        {tab === "Chat" && <ChatView />}
        {tab === "Preview" && <PreviewView />}
        {tab === "Tasks" && <TasksView />}
      </div>
    </div>
  );
}

function TodayView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card title="Active Workflows" subtitle="3 running">
        <div className="space-y-2 text-sm">
          <WorkflowItem name="Job Search" profile="Career" status="running" />
          <WorkflowItem name="Content Pipeline" profile="Scribe" status="idle" />
          <WorkflowItem name="Health Tracker" profile="Guidance" status="running" />
        </div>
      </Card>

      <Card title="Needs Approval" subtitle="2 items">
        <div className="space-y-2 text-sm">
          <ApprovalItem name="Resume variant for Stripe" profile="Career" />
          <ApprovalItem name="LinkedIn post draft" profile="Scribe" />
        </div>
      </Card>

      <Card title="Recent Outputs" subtitle="Last 24h">
        <div className="space-y-2 text-sm">
          <OutputItem name="Job tracker updated" profile="Career" time="2h ago" />
          <OutputItem name="Blog post draft" profile="Scribe" time="5h ago" />
          <OutputItem name="Diet plan adjusted" profile="Guidance" time="1d ago" />
        </div>
      </Card>
    </div>
  );
}

function PreviewView() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <MarkdownPreview initial="# Welcome to Hermes Dashboard\n\nWrite markdown here and see it rendered in real-time." />
      </div>
    </div>
  );
}

function TasksView() {
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

function WorkflowItem({ name, profile, status }: { name: string; profile: string; status: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{name}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{profile}</span>
        <span className={cn("w-2 h-2 rounded-full", status === "running" ? "bg-green-500" : "bg-yellow-500")} />
      </div>
    </div>
  );
}

function ApprovalItem({ name, profile }: { name: string; profile: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{name}</span>
      <span className="text-xs text-muted-foreground">{profile}</span>
    </div>
  );
}

function OutputItem({ name, profile, time }: { name: string; profile: string; time: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{name}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{profile}</span>
        <span className="text-xs text-muted-foreground">{time}</span>
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
