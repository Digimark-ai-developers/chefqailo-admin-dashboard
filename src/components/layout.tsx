import { Outlet } from "react-router-dom";

import AppSidebar from "./app-sidebar";
import { ModeToggle } from "./mode-toggle";
import { ThemeProvider } from "./theme-provider";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

const Layout = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="flex h-screen w-full items-center justify-center">
          <AppSidebar />
          <div className="h-full flex-1 transition-[width]">
            <nav className="sticky left-0 top-0 flex h-16 w-full items-center justify-between border-b bg-background px-5">
              <SidebarTrigger />
              <ModeToggle />
            </nav>
            <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center overflow-hidden p-5">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Layout;
