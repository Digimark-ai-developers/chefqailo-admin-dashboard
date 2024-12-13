import { useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Power } from "lucide-react";
import { useLocation } from "react-router-dom";

import LogoImage from "@/assets/img/login2.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { items } from "@/lib/constants";
import { cn, truncateString } from "@/lib/utils";

import { Button } from "./ui/button";
import WarningModal from "./warning-modal";

const AppSidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useKindeAuth();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <WarningModal
        open={open}
        setOpen={setOpen}
        message="Logout"
        cta={logout}
      />
      <Sidebar>
        <SidebarHeader className="bg-sidebar-background border-b">
          <div className="flex w-full items-center justify-center">
            <img src={LogoImage} alt="logo" className="size-28" />
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-sidebar-background">
          <SidebarGroup>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={cn("", {
                    "rounded-md bg-primary/15 text-primary": pathname.includes(
                      item.url
                    ),
                  })}
                >
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-sidebar-background border-t">
          <div className="flex w-full items-center justify-center gap-2.5">
            <img
              src="https://ui.shadcn.com/avatars/04.png"
              alt="dp"
              className="size-10 rounded-full"
            />
            <div className="flex w-full flex-col items-center justify-center gap-1">
              <span className="w-full overflow-hidden truncate text-left text-sm font-semibold">
                {user?.given_name}&nbsp;{user?.family_name}
              </span>
              <span className="flex-1 overflow-hidden truncate text-left text-xs font-light">
                {truncateString(`${user?.email}`, 19)}
              </span>
            </div>
            <Button
              onClick={() => setOpen(true)}
              variant="ghost"
              className="text-red-500"
            >
              <Power className="size-full" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
