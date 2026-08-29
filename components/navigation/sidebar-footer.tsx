export function SidebarFooter() {
  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-3 rounded-md px-2 py-2">
        <div
          className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium"
          aria-hidden="true"
        >
          B
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            BuildFlow User
          </p>

          <p className="truncate text-xs text-muted-foreground">
            Construction Team
          </p>
        </div>
      </div>
    </div>
  );
}