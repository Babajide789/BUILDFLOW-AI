export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center">
        <span className="text-sm font-medium">
          Dashboard
        </span>
      </div>
    </header>
  );
}