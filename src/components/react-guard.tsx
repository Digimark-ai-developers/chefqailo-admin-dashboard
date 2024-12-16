import { ReactNode, useEffect } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

const RouteGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, getToken } = useKindeAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (getToken) {
        getToken().then((token) => {
          if (token) {
            localStorage.setItem("token", token);
          }
        });
      }
    }
  }, [isAuthenticated, getToken]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-background">
        <Loader2 className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RouteGuard;
