import type { NavGroup as NavGroupConfig } from "@/components/dashboard/nav-config";

import { NavItem } from "./nav-item";

interface NavGroupProps {
  group: NavGroupConfig;
}

export function NavGroup({ group }: NavGroupProps) {
  return (
    <section className="space-y-2">
      <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {group.title}
      </h2>

      <div className="space-y-1">
        {group.items.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </div>
    </section>
  );
}