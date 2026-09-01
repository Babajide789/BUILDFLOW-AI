interface SidebarHeaderProps {
  isCollapsed: boolean;
}

export function SidebarHeader({
  isCollapsed,
}: SidebarHeaderProps) {
  return (
    <div
      className={[
        "flex h-16 items-center border-b",
        isCollapsed ? "justify-center px-2" : "px-4",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground"
          aria-hidden="true"
        >
          B
        </div>

        {!isCollapsed && (
          <span className="whitespace-nowrap text-lg font-semibold tracking-tight">
            BuildFlow AI
          </span>
        )}
      </div>
    </div>
  );
}