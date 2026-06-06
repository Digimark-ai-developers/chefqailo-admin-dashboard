export const ADMIN_SESSION_KEY = "chefqailo_admin_session";

export type AdminSession = {
  accessToken: string;
  refreshToken?: string;
  email?: string;
};

export const getAdminSession = (): AdminSession | null => {
  const rawSession = window.localStorage.getItem(ADMIN_SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AdminSession;
  } catch {
    clearAdminSession();
    return null;
  }
};

export const getAdminAccessToken = () => getAdminSession()?.accessToken ?? "";

export const setAdminSession = (session: AdminSession) => {
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
};

export const clearAdminSession = () => {
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const isAdminAuthenticated = () => Boolean(getAdminAccessToken());

export const extractAdminAccessToken = (response: unknown): string => {
  if (!response || typeof response !== "object") {
    return "";
  }

  const data = response as Record<string, unknown>;
  const token =
    data.access ??
    data.access_token ??
    data.token ??
    data.accessToken ??
    (data.tokens as Record<string, unknown> | undefined)?.access ??
    (data.data as Record<string, unknown> | undefined)?.access ??
    (data.data as Record<string, unknown> | undefined)?.access_token ??
    (data.data as Record<string, unknown> | undefined)?.token ??
    ((data.data as Record<string, unknown> | undefined)?.tokens as
      | Record<string, unknown>
      | undefined)?.access;

  return typeof token === "string" ? token : "";
};

export const extractAdminRefreshToken = (response: unknown): string => {
  if (!response || typeof response !== "object") {
    return "";
  }

  const data = response as Record<string, unknown>;
  const token =
    data.refresh ??
    data.refresh_token ??
    (data.tokens as Record<string, unknown> | undefined)?.refresh ??
    (data.data as Record<string, unknown> | undefined)?.refresh ??
    (data.data as Record<string, unknown> | undefined)?.refresh_token ??
    ((data.data as Record<string, unknown> | undefined)?.tokens as
      | Record<string, unknown>
      | undefined)?.refresh;

  return typeof token === "string" ? token : "";
};

export const extractAdminEmail = (
  response: unknown,
  fallbackEmail: string
): string => {
  if (!response || typeof response !== "object") {
    return fallbackEmail;
  }

  const data = response as Record<string, unknown>;
  const email =
    data.email ?? (data.data as Record<string, unknown> | undefined)?.email;

  return typeof email === "string" ? email : fallbackEmail;
};
