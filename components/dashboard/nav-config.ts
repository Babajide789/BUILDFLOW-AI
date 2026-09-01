export type NavIcon =
  | "layout-dashboard"
  | "folder-kanban"
  | "file-text"
  | "users"
  | "building-2"
  | "bell"
  | "settings";

export interface NavItem {
  title: string;
  href: string;
  icon: NavIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const mainNavigation: NavGroup[] = [
  {
    title: "Main",
    items: [
      {
        title: "Overview",
        href: "/",
        icon: "layout-dashboard",
      },
      {
        title: "Projects",
        href: "/projects",
        icon: "folder-kanban",
      },
      {
        title: "Documents",
        href: "/documents",
        icon: "file-text",
      },
      {
        title: "Team",
        href: "/team",
        icon: "users",
      },
      {
        title: "Vendors",
        href: "/vendors",
        icon: "building-2",
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        title: "Notifications",
        href: "/notifications",
        icon: "bell",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: "settings",
      },
    ],
  },
];