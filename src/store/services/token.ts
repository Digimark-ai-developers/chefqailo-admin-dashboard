import { api } from "./core";

export const tokenApi = api.injectEndpoints({
  endpoints: (build) => ({
    giftTokens: build.mutation({
      query: ({ id, token }: { id: number; token: string }) => ({
        url: `/add-tokens/${id}/`,
        method: "POST",
        body: {
          tokens_to_add: 10,
        },
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
  }),
});

export const { useGiftTokensMutation } = tokenApi;
