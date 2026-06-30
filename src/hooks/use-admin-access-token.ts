import { useState } from "react";

import { getAdminAccessToken } from "@/lib/admin-auth";

export const useAdminAccessToken = () => {
  const [accessToken] = useState(() => getAdminAccessToken());

  return accessToken;
};
