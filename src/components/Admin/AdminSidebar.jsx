// src/components/Admin/AdminSidebar.jsx
import React from "react";
import { Home, Video, List } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";

// DATA ADMIN
const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/admin", icon: Home },
    { title: "Videos", url: "/admin/videos", icon: Video },
    { title: "Playlists", url: "/admin/playlists", icon: List },
  ],
};

export default function AdminSidebar({ onLogout, ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="">
                <div className="bg-neutral-800 text-sidebar-primary-foreground flex aspect-square w-8 h-8 items-center justify-center rounded-lg">
                  <img
                    src="/twice.svg"
                    alt="Logo Twice"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">TWICEFLIX</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} onLogout={onLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
