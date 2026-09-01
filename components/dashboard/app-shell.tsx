import type { ReactNode } from "react";
import { Topbar } from "./topbar";
import { Sidebar } from "./sidebar";


interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="min-h-screen lg:pl-64">
        <Topbar />

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}