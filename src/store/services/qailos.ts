import { api } from "./core";

export type QailosCoefficient = {
  id?: number;
  code: string;
  provider: string;
  model?: string | null;
  component: string;
  unit_type?: string | null;
  qailos_per_token: string;
  eur_per_token: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type QailosCoefficientPayload = {
  code: string;
  provider: string;
  model?: string;
  component: string;
  unit_type?: string;
  qailos_per_token?: string;
  eur_per_token?: string;
  is_active?: boolean;
};

export type QailosCoefficientPatchPayload = Partial<QailosCoefficientPayload>;

type GetQailosCoefficientsArgs =
  | string
  | {
      token: string;
      page?: number;
      pageSize?: number;
    };

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
    page: data.page,
    limit: data.limit,
    previous: data.previous,
    results: data.results ?? [],
    total_pages: data.total_pages,
  };
};

const buildCoefficientsUrl = (args: GetQailosCoefficientsArgs) => {
  if (typeof args === "string") {
    return "/api/qailos/coefficients/";
  }

  const searchParams = new URLSearchParams();

  if (args.page !== undefined) {
    searchParams.set("page", `${Math.max(args.page, 1)}`);
  }

  if (args.pageSize !== undefined) {
    searchParams.set("page_size", `${args.pageSize}`);
  }

  const queryString = searchParams.toString();

  return `/api/qailos/coefficients/${queryString ? `?${queryString}` : ""}`;
};

export const qailosApi = api.injectEndpoints({
  endpoints: (build) => ({
    getQailosCoefficients: build.query<
      PaginatedResponse<QailosCoefficient>,
      GetQailosCoefficientsArgs
    >({
      query: (args) => ({
        url: buildCoefficientsUrl(args),
        method: "GET",
        headers: authHeaders(typeof args === "string" ? args : args.token),
      }),
      providesTags: ["QailosCoefficients"],
      transformResponse: (response: unknown) =>
        normalizePaginated<QailosCoefficient>(
          response as
            | ApiEnvelope<
                PaginatedResponse<QailosCoefficient> | QailosCoefficient[]
              >
            | PaginatedResponse<QailosCoefficient>
            | QailosCoefficient[]
        ),
    }),
    getQailosCoefficient: build.query<
      QailosCoefficient,
      { id: number | string; token: string }
    >({
      query: ({ id, token }) => ({
        url: `/api/qailos/coefficients/${id}/`,
        method: "GET",
        headers: authHeaders(token),
      }),
      providesTags: ["QailosCoefficient"],
      transformResponse: (response: unknown) =>
        unwrapData<QailosCoefficient>(
          response as ApiEnvelope<QailosCoefficient> | QailosCoefficient
        ),
    }),
    createQailosCoefficient: build.mutation<
      QailosCoefficient,
      { data: QailosCoefficientPayload; token: string }
    >({
      query: ({ data, token }) => ({
        url: "/api/qailos/coefficients/",
        method: "POST",
        body: data,
        headers: authHeaders(token),
      }),
      invalidatesTags: ["QailosCoefficients"],
      transformResponse: (response: unknown) =>
        unwrapData<QailosCoefficient>(
          response as ApiEnvelope<QailosCoefficient> | QailosCoefficient
        ),
    }),
    updateQailosCoefficient: build.mutation<
      QailosCoefficient,
      {
        id: number | string;
        data: QailosCoefficientPayload;
        token: string;
      }
    >({
      query: ({ id, data, token }) => ({
        url: `/api/qailos/coefficients/${id}/`,
        method: "PUT",
        body: data,
        headers: authHeaders(token),
      }),
      invalidatesTags: ["QailosCoefficients", "QailosCoefficient"],
      transformResponse: (response: unknown) =>
        unwrapData<QailosCoefficient>(
          response as ApiEnvelope<QailosCoefficient> | QailosCoefficient
        ),
    }),
    patchQailosCoefficient: build.mutation<
      QailosCoefficient,
      {
        id: number | string;
        data: QailosCoefficientPatchPayload;
        token: string;
      }
    >({
      query: ({ id, data, token }) => ({
        url: `/api/qailos/coefficients/${id}/`,
        method: "PATCH",
        body: data,
        headers: authHeaders(token),
      }),
      invalidatesTags: ["QailosCoefficients", "QailosCoefficient"],
      transformResponse: (response: unknown) =>
        unwrapData<QailosCoefficient>(
          response as ApiEnvelope<QailosCoefficient> | QailosCoefficient
        ),
    }),
    disableQailosCoefficient: build.mutation<
      QailosCoefficient,
      { id: number | string; token: string }
    >({
      query: ({ id, token }) => ({
        url: `/api/qailos/coefficients/${id}/`,
        method: "PATCH",
        body: { is_active: false },
        headers: authHeaders(token),
      }),
      invalidatesTags: ["QailosCoefficients", "QailosCoefficient"],
      transformResponse: (response: unknown) =>
        unwrapData<QailosCoefficient>(
          response as ApiEnvelope<QailosCoefficient> | QailosCoefficient
        ),
    }),
  }),
});

export const {
  useGetQailosCoefficientsQuery,
  useGetQailosCoefficientQuery,
  useCreateQailosCoefficientMutation,
  useUpdateQailosCoefficientMutation,
  usePatchQailosCoefficientMutation,
  useDisableQailosCoefficientMutation,
} = qailosApi;
