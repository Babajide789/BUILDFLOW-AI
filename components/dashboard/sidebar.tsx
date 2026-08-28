export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background lg:flex">
      <div className="flex w-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-lg font-semibold">
            BuildFlow AI
          </span>
        </div>

        <div className="flex-1 p-4">
          <p className="text-sm text-muted-foreground">
            Navigation
          </p>
        </div>
      </div>
    </aside>
  );
}