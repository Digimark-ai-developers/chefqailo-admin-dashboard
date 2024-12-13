import { ReactNode } from "react";

import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "./ui/sonner";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <KindeProvider
      clientId={`${import.meta.env.VITE_KINDE_CLIENT_ID}`}
      domain={`${import.meta.env.VITE_KINDE_AUTH_DOMAIN}`}
      logoutUri={window.location.origin}
      redirectUri={`${window.location.origin}/dashboard`}
    >
      <BrowserRouter>
        <Toaster />
        {children}
      </BrowserRouter>
    </KindeProvider>
  );
};

export default Providers;
