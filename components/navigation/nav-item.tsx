import Link from "next/link";

import type { NavItem as NavItemConfig } from "@/components/dashboard/nav-config";

interface NavItemProps {
  item: NavItemConfig;
}

export function NavItem({ item }: NavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />

      <span className="truncate">{item.title}</span>
    </Link>
  );
}