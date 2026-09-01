interface SidebarFooterProps {
  isCollapsed: boolean;
}

export function SidebarFooter({
  isCollapsed,
}: SidebarFooterProps) {
  return (
    <div className="border-t p-4">
      <div
        className={[
          "flex items-center rounded-md py-2",
          isCollapsed
            ? "justify-center px-0"
            : "gap-3 px-2",
        ].join(" ")}
      >
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium"
          aria-hidden="true"
        >
          B
        </div>

        {!isCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              BuildFlow User
            </p>

            <p className="truncate text-xs text-muted-foreground">
              Construction Team
            </p>
          </div>
        )}
      </div>
    </div>
  );
}