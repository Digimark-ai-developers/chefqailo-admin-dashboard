import { useState } from "react";

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
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import WarningModal from "./warning-modal";

const AppSidebar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <WarningModal open={open} setOpen={setOpen} message="Logout" />
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
            <div className="size-10 overflow-hidden rounded-md">
              <img
                src="https://ui.shadcn.com/avatars/02.png"
                alt="dp"
                className="size-full"
              />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-1">
              <span className="w-full text-left text-sm font-semibold">
                John Doe
              </span>
              <span className="w-full text-left text-xs font-light">
                johndoe@email.com
              </span>
            </div>
            <div className="flex items-center justify-center">
              <Button
                onClick={() => setOpen(true)}
                variant="ghost"
                className="text-red-500"
              >
                <Power className="size-full" />
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
