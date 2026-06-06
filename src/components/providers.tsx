import { ReactNode } from "react";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import store from "@/store";

import { Toaster } from "./ui/sonner";
import { TooltipProvider } from "./ui/tooltip";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          toastOptions={{
            duration: 1500,
          }}
        />
        <TooltipProvider>{children}</TooltipProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default Providers;
