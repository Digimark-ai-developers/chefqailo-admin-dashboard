import { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { isAdminAuthenticated } from "@/lib/admin-auth";

const RouteGuard = ({ children }: { children: ReactNode }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RouteGuard;
