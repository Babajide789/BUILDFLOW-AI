"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import {
  SidebarFooter,
  SidebarNavigation,
} from "@/components/navigation";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/50"
          />

          <aside
            id="mobile-navigation"
            className="absolute inset-y-0 left-0 z-10 flex w-64 flex-col border-r bg-background shadow-xl"
            aria-label="Mobile navigation"
          >
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground"
                  aria-hidden="true"
                >
                  B
                </div>

                <span className="text-lg font-semibold tracking-tight">
                  BuildFlow AI
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div onClick={() => setIsOpen(false)}>
              <SidebarNavigation isCollapsed={false} />
            </div>

            <SidebarFooter isCollapsed={false} />
          </aside>
        </div>
      )}
    </>
  );
}