import { api } from "./core";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    adminLogin: build.mutation<AdminLoginResponse, AdminLoginPayload>({
      query: (credentials) => ({
        url: "/api/admin_app/login/",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

export const { useAdminLoginMutation } = authApi;
