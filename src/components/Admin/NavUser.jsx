import { LogOut } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser({ onLogout }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={onLogout}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-neutral-800 text-sidebar-primary-foreground flex aspect-square w-8 h-8 items-center justify-center rounded-lg">
            <LogOut className="w-4 h-4 " />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate"> Log out</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
