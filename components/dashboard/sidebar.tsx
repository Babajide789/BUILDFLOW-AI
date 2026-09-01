"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import {
  SidebarFooter,
  SidebarHeader,
  SidebarNavigation,
} from "@/components/navigation";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 hidden border-r bg-background lg:flex",
        "transition-[width] duration-200 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      ].join(" ")}
    >
      <div className="flex w-full flex-col">
        <SidebarHeader isCollapsed={isCollapsed} />

        <SidebarNavigation isCollapsed={isCollapsed} />

        <SidebarFooter isCollapsed={isCollapsed} />

        <button
          type="button"
          onClick={() => setIsCollapsed((current) => !current)}
          aria-label={
            isCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="absolute -right-3 top-20 z-10 flex size-6 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {isCollapsed ? (
            <PanelLeftOpen
              className="size-3.5"
              aria-hidden="true"
            />
          ) : (
            <PanelLeftClose
              className="size-3.5"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </aside>
  );
}