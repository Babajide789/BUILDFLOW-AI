import { mainNavigation } from "@/components/dashboard/nav-config";

import { NavGroup } from "./nav-group";

export function SidebarNavigation() {
  return (
    <nav
      className="flex-1 space-y-6 overflow-y-auto p-4"
      aria-label="Main navigation"
    >
      {mainNavigation.map((group) => (
        <NavGroup key={group.title} group={group} />
      ))}
    </nav>
  );
}