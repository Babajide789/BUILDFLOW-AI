"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

import { MobileSidebar } from "./mobile-sidebar";
import { ThemeSwitcher } from "../theme/theme-switcher";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/projects": "Projects",
  "/documents": "Documents",
  "/team": "Team",
  "/vendors": "Vendors",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

function getPageTitle(pathname: string) {
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  if (pathname.startsWith("/projects/")) {
    return "Project";
  }

  return "BuildFlow";
}

export function Topbar() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background/95 px-3 sm:px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <MobileSidebar />

        <h1 className="truncate text-sm font-semibold">
          {pageTitle}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeSwitcher />

        <button
          type="button"
          aria-label="Open notifications"
          className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Bell
            className="size-5"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          aria-label="Open user menu"
          className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span aria-hidden="true">B</span>
        </button>
      </div>
    </header>
  );
}