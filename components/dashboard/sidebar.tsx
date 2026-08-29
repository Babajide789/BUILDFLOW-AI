import {
  SidebarFooter,
  SidebarHeader,
  SidebarNavigation,
} from "@/components/navigation";


export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background lg:flex">
      <div className="flex w-full flex-col">
        <SidebarHeader />

        <SidebarNavigation />

        <SidebarFooter />
      </div>
    </aside>
  );
}