import { api } from "./core";

export const subscriptionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSubscriptionStats: build.query({
      query: ({ period, token }: { period: string; token: string }) => ({
        url: `/get-subscriptions-stats/?period=${period}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: SubscriptionStats[];
      }) => response.data,
    }),
    addPlan: build.mutation({
      query: ({
        plan,
        token,
      }: {
        plan: {
          payment_status: string;
          amount: number;
        };
        token: string;
      }) => ({
        url: "/subscription-history/",
        method: "POST",
        body: plan,
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["Plans", "Plan"],
    }),
    deletePlan: build.mutation({
      query: ({ id, token }: { id: string; token: string }) => ({
        url: `/subscription-history/${id}/`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["Plans", "Plan"],
    }),
    editPlan: build.mutation({
      query: ({
        id,
        plan,
        token,
      }: {
        id: string;
        plan: {
          payment_status: string;
          amount: number;
        };
        token: string;
      }) => ({
        url: `/subscription-history/${id}/`,
        method: "PUT",
        body: plan,
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["Plans", "Plan"],
    }),
    getPlan: build.query({
      query: ({ id, token }: { id: string; token: string }) => ({
        url: `/subscription-history/${id}/`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["Plan"],
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: Plan;
      }) => response.data,
    }),
    getPlans: build.query({
      query: (token: string) => ({
        url: "/subscription-history/",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["Plans"],
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: Plan[];
      }) => response.data,
    }),
  }),
});

export const {
  useGetSubscriptionStatsQuery,
  useAddPlanMutation,
  useDeletePlanMutation,
  useEditPlanMutation,
  useGetPlanQuery,
  useGetPlansQuery,
} = subscriptionApi;
