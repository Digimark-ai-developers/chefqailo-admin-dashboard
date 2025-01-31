import { api } from "./core";

export const statisticsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOverallStats: build.query({
      query: (time: string) => ({
        url: `/overall-statistics/?period=${time}`,
        method: "GET",
      }),
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: OverallStats[];
      }) => response.data,
    }),
    getFeatureUsageGraph: build.query({
      query: (params: string) => ({
        url: `/get-feature-plans/${params}`,
        method: "GET",
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
      query: (feature: string) => ({
        url: `/get-peak-plans/?feature=${feature}`,
        method: "GET",
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
