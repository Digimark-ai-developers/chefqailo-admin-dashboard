import { api } from "./core";

export const subscriptionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSubscriptionStats: build.query({
      query: (period: string) => ({
        url: `/get-subscriptions-stats/?period=${period}`,
        method: "GET",
      }),
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: SubscriptionStats[];
      }) => response.data,
    }),
  }),
});

export const { useGetSubscriptionStatsQuery } = subscriptionApi;
