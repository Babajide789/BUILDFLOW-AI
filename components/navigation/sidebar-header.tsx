export function SidebarHeader() {
  return (
    <div className="flex h-16 items-center border-b px-6">
      <div className="flex items-center gap-2">
        <div
          className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground"
          aria-hidden="true"
        >
          B
        </div>

        <span className="text-lg font-semibold tracking-tight">
          BuildFlow AI
        </span>
      </div>
    </div>
  );
}