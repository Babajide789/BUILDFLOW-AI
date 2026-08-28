export interface NavItem {
  title: string;
  href: string;
  icon?: string;
}

export const mainNavigation: NavItem[] = [
  {
    title: "Overview",
    href: "/",
  },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Documents",
    href: "/documents",
  },
  {
    title: "Team",
    href: "/team",
  },
  {
    title: "Vendors",
    href: "/vendors",
  },
];

export const workspaceNavigation: NavItem[] = [
  {
    title: "Notifications",
    href: "/notifications",
  },
  {
    title: "Settings",
    href: "/settings",
  },
];