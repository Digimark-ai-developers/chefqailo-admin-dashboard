import { useState } from "react";

import { Power } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
import { clearAdminSession, getAdminSession } from "@/lib/admin-auth";
import { items } from "@/lib/constants";
import { cn, truncateString } from "@/lib/utils";

import { Button } from "./ui/button";
import WarningModal from "./warning-modal";

const AppSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const session = getAdminSession();
  const [open, setOpen] = useState<boolean>(false);
  const logout = () => {
    clearAdminSession();
    navigate("/", { replace: true });
  };

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
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
                Admin
              </span>
              <span className="w-full overflow-hidden truncate text-left text-xs font-light">
                {truncateString(`${session?.email ?? "admin"}`, 19)}
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
