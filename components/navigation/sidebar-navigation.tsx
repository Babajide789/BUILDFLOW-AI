import { mainNavigation } from "@/components/dashboard/nav-config";
import { NavGroup } from "./nav-group";

interface SidebarNavigationProps {
  isCollapsed: boolean;
}

export function SidebarNavigation({
  isCollapsed,
}: SidebarNavigationProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      {mainNavigation.map((group) => (
        <NavGroup
          key={group.title}
          group={group}
          isCollapsed={isCollapsed}
        />
      ))}
    </nav>
  );
}