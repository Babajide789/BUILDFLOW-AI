"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { NavItem as NavItemConfig } from "@/components/dashboard/nav-config";

interface NavItemProps {
  item: NavItemConfig;
  isCollapsed: boolean;
}

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  "folder-kanban": FolderKanban,
  "file-text": FileText,
  users: Users,
  "building-2": Building2,
  bell: Bell,
  settings: Settings,
} as const;

export function NavItem({
  item,
  isCollapsed,
}: NavItemProps) {
  const pathname = usePathname();

  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href ||
        pathname.startsWith(`${item.href}/`);

  const Icon = iconMap[item.icon];

return (
  <Tooltip>
    {isCollapsed ? (
      <>
        <TooltipTrigger
          render={
            <Link
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.title}
              className={[
                "flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              ].join(" ")}
            >
              <Icon
                className="size-4 shrink-0"
                aria-hidden="true"
              />
            </Link>
          }
        />

        <TooltipContent side="right">
          {item.title}
        </TooltipContent>
      </>
    ) : (
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={[
          "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        ].join(" ")}
      >
        <Icon
          className="size-4 shrink-0"
          aria-hidden="true"
        />

        <span className="truncate">
          {item.title}
        </span>
      </Link>
    )}
  </Tooltip>
);
}