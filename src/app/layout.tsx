import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { AppThemeProvider } from "@/providers/theme-provider";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hermes Dashboard",
  description: "AI agent orchestration for your life",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex bg-background text-foreground">
        <AppThemeProvider>
          <Sidebar />
          <main className="flex-1 flex flex-col min-h-screen">
            {children}
          </main>
          <Toaster />
        </AppThemeProvider>
      </body>
    </html>
  );
}
