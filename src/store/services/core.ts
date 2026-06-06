import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { clearAdminSession } from "@/lib/admin-auth";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL,
});

const baseQueryWith401Handling: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    clearAdminSession();
    window.location.replace("/?intent=terminated");
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWith401Handling,
  keepUnusedDataFor: 5,
  tagTypes: [
    "Users",
    "User",
    "Stats",
    "Plan",
    "Plans",
    "Influencers",
    "Influencer",
    "ReferralCodes",
    "ReferralCode",
    "InfluencerAnalytics",
  ],
  endpoints: () => ({}),
});
