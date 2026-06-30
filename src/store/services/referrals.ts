import { api } from "./core";

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

const unwrapData = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    const payload = (response as ApiEnvelope<T>).data;

    if (payload !== undefined) {
      return payload;
    }
  }

  return response as T;
};

const normalizePaginated = <T>(
  response: ApiEnvelope<PaginatedResponse<T> | T[]> | PaginatedResponse<T> | T[]
): PaginatedResponse<T> => {
  const data = unwrapData<PaginatedResponse<T> | T[]>(response);

  if (Array.isArray(data)) {
    return {
      count: data.length,
      results: data,
    };
  }

  return {
    count: data.count ?? data.results?.length ?? 0,
    next: data.next,
    previous: data.previous,
    results: data.results ?? [],
  };
};

export const referralApi = api.injectEndpoints({
  endpoints: (build) => ({
    createInfluencerOnboarding: build.mutation<
      InfluencerOnboardingApiResponse,
      { data: InfluencerOnboardingPayload; token: string }
    >({
      query: ({ data, token }) => ({
        url: "/api/admin/influencer-onboarding/",
        method: "POST",
        body: data,
        headers: authHeaders(token),
      }),
      invalidatesTags: ["Influencers", "ReferralCodes", "InfluencerAnalytics"],
    }),
    createInfluencer: build.mutation<
      ApiMessage<InfluencerDetail>,
      { data: CreateInfluencerPayload; token: string }
    >({
      query: ({ data, token }) => ({
        url: "/api/admin/influencers/",
        method: "POST",
        body: data,
        headers: authHeaders(token),
      }),
      invalidatesTags: ["Influencers", "Influencer", "InfluencerAnalytics"],
    }),
    getInfluencers: build.query<
      PaginatedResponse<Influencer>,
      { page: number; pageSize: number; token: string }
    >({
      query: ({ page, pageSize, token }) => ({
        url: `/api/admin/influencers/?page=${page}&page_size=${pageSize}`,
        method: "GET",
        headers: authHeaders(token),
      }),
      providesTags: ["Influencers"],
      transformResponse: (response: unknown) =>
        normalizePaginated<Influencer>(
          response as
            | ApiEnvelope<PaginatedResponse<Influencer> | Influencer[]>
            | PaginatedResponse<Influencer>
            | Influencer[]
        ),
    }),
    getInfluencer: build.query<InfluencerDetail, { id: number; token: string }>(
      {
        query: ({ id, token }) => ({
          url: `/api/admin/influencers/${id}/`,
          method: "GET",
          headers: authHeaders(token),
        }),
        providesTags: ["Influencer"],
        transformResponse: (response: unknown) =>
          unwrapData<InfluencerDetail>(
            response as ApiEnvelope<InfluencerDetail> | InfluencerDetail
          ),
      }
    ),
    updateInfluencer: build.mutation<
      ApiMessage<InfluencerDetail>,
      { id: number; data: InfluencerProfilePayload; token: string }
    >({
      query: ({ id, data, token }) => ({
        url: `/api/admin/influencers/${id}/`,
        method: "PUT",
        body: data,
        headers: authHeaders(token),
      }),
      invalidatesTags: ["Influencers", "Influencer", "InfluencerAnalytics"],
    }),
    deactivateInfluencer: build.mutation<
      ApiMessage<InfluencerDetail>,
      { id: number; token: string }
    >({
      query: ({ id, token }) => ({
        url: `/api/admin/influencers/${id}/`,
        method: "DELETE",
        headers: authHeaders(token),
      }),
      invalidatesTags: ["Influencers", "Influencer", "InfluencerAnalytics"],
    }),
    getInfluencerAnalytics: build.query<
      InfluencerAnalytics,
      { id: number; token: string }
    >({
      query: ({ id, token }) => ({
        url: `/api/admin/influencers/${id}/analytics/`,
        method: "GET",
        headers: authHeaders(token),
      }),
      providesTags: ["InfluencerAnalytics"],
      transformResponse: (response: unknown) =>
        unwrapData<InfluencerAnalytics>(
          response as ApiEnvelope<InfluencerAnalytics> | InfluencerAnalytics
        ),
    }),
    createReferralCode: build.mutation<
      ApiMessage<ReferralCodeDetail>,
      { data: ReferralCodePayload; token: string }
    >({
      query: ({ data, token }) => ({
        url: "/api/admin/referral-codes/",
        method: "POST",
        body: data,
        headers: authHeaders(token),
      }),
      invalidatesTags: ["ReferralCodes", "ReferralCode", "InfluencerAnalytics"],
    }),
    getReferralCodes: build.query<
      PaginatedResponse<ReferralCode>,
      { page: number; pageSize: number; token: string }
    >({
      query: ({ page, pageSize, token }) => ({
        url: `/api/admin/referral-codes/?page=${page}&page_size=${pageSize}`,
        method: "GET",
        headers: authHeaders(token),
      }),
      providesTags: ["ReferralCodes"],
      transformResponse: (response: unknown) =>
        normalizePaginated<ReferralCode>(
          response as
            | ApiEnvelope<PaginatedResponse<ReferralCode> | ReferralCode[]>
            | PaginatedResponse<ReferralCode>
            | ReferralCode[]
        ),
    }),
    getReferralCode: build.query<
      ReferralCodeDetail,
      { id: number; token: string }
    >({
      query: ({ id, token }) => ({
        url: `/api/admin/referral-codes/${id}/`,
        method: "GET",
        headers: authHeaders(token),
      }),
      providesTags: ["ReferralCode"],
      transformResponse: (response: unknown) =>
        unwrapData<ReferralCodeDetail>(
          response as ApiEnvelope<ReferralCodeDetail> | ReferralCodeDetail
        ),
    }),
    getReferralCodePerformance: build.query<
      ReferralCodePerformance,
      { id: number; token: string }
    >({
      query: ({ id, token }) => ({
        url: `/api/admin/referral-codes/${id}/performance/`,
        method: "GET",
        headers: authHeaders(token),
      }),
      providesTags: ["ReferralCodePerformance"],
      transformResponse: (response: unknown) =>
        unwrapData<ReferralCodePerformance>(
          response as
            | ApiEnvelope<ReferralCodePerformance>
            | ReferralCodePerformance
        ),
    }),
    updateReferralCode: build.mutation<
      ApiMessage<ReferralCodeDetail>,
      { id: number; data: ReferralCodePayload; token: string }
    >({
      query: ({ id, data, token }) => ({
        url: `/api/admin/referral-codes/${id}/`,
        method: "PUT",
        body: data,
        headers: authHeaders(token),
      }),
      invalidatesTags: [
        "ReferralCodes",
        "ReferralCode",
        "ReferralCodePerformance",
        "InfluencerAnalytics",
      ],
    }),
    deactivateReferralCode: build.mutation<
      ApiMessage<ReferralCodeDetail>,
      { id: number; token: string }
    >({
      query: ({ id, token }) => ({
        url: `/api/admin/referral-codes/${id}/`,
        method: "DELETE",
        headers: authHeaders(token),
      }),
      invalidatesTags: [
        "ReferralCodes",
        "ReferralCode",
        "ReferralCodePerformance",
        "InfluencerAnalytics",
      ],
    }),
    validateReferralCode: build.mutation<
      ReferralValidationResponse,
      { code: string }
    >({
      query: ({ code }) => ({
        url: "/api/referrals/validate/",
        method: "POST",
        body: { code },
        headers: { "Content-Type": "application/json" },
      }),
      transformResponse: (response: unknown) =>
        unwrapData<ReferralValidationResponse>(
          response as
            | ApiEnvelope<ReferralValidationResponse>
            | ReferralValidationResponse
        ),
    }),
  }),
});

export const {
  useCreateInfluencerOnboardingMutation,
  useCreateInfluencerMutation,
  useGetInfluencersQuery,
  useGetInfluencerQuery,
  useUpdateInfluencerMutation,
  useDeactivateInfluencerMutation,
  useGetInfluencerAnalyticsQuery,
  useCreateReferralCodeMutation,
  useGetReferralCodesQuery,
  useGetReferralCodeQuery,
  useGetReferralCodePerformanceQuery,
  useUpdateReferralCodeMutation,
  useDeactivateReferralCodeMutation,
  useValidateReferralCodeMutation,
} = referralApi;
