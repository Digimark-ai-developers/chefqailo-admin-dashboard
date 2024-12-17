import { ReactNode } from "react";

import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import store from "@/store";

import { Toaster } from "./ui/sonner";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <KindeProvider
      clientId={`${import.meta.env.VITE_KINDE_CLIENT_ID}`}
      domain={`${import.meta.env.VITE_KINDE_AUTH_DOMAIN}`}
      logoutUri={window.location.origin}
      redirectUri={`${window.location.origin}/dashboard`}
      isDangerouslyUseLocalStorage={true}
    >
      <Provider store={store}>
        <BrowserRouter>
          <Toaster />
          {children}
        </BrowserRouter>
      </Provider>
    </KindeProvider>
  );
};

export default Providers;
