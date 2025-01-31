import { api } from "./core";

export const statisticsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOverallStats: build.query({
      query: ({ time, token }: { time: string; token: string }) => ({
        url: `/overall-statistics/?period=${time}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: OverallStats[];
      }) => response.data,
    }),
    getFeatureUsageGraph: build.query({
      query: ({ params, token }: { params: string; token: string }) => ({
        url: `/get-feature-plans/${params}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: {
          date: string;
          count: number;
        }[];
      }) => response.data,
    }),
    getPeakUsageGraph: build.query({
      query: ({ feature, token }: { feature: string; token: string }) => ({
        url: `/get-peak-plans/?feature=${feature}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: {
          date: string;
          count: number;
        }[];
      }) => response.data,
    }),
  }),
});

export const {
  useGetOverallStatsQuery,
  useGetFeatureUsageGraphQuery,
  useGetPeakUsageGraphQuery,
} = statisticsApi;
