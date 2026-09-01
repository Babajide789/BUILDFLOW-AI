import type { NavGroup as NavGroupConfig } from "@/components/dashboard/nav-config";
import { NavItem } from "./nav-item";

interface NavGroupProps {
  group: NavGroupConfig;
  isCollapsed: boolean;
}

export function NavGroup({
  group,
  isCollapsed,
}: NavGroupProps) {
  return (
    <section className="mb-6">
      {!isCollapsed && (
        <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group.title}
        </h2>
      )}

      <div className="flex flex-col space-y-1">
        {group.items.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </section>
  );
}