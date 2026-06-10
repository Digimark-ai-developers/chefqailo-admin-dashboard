import { api } from "./core";

const DEFAULT_USERS_START_DATE = "2024-01-01";

type StatsDatePeriod = "weekly" | "monthly" | "yearly";

const getTodayInputDate = () => {
  const today = new Date();

  return formatInputDate(today);
};

const formatInputDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getStatsPeriodStartDate = (period?: StatsDatePeriod) => {
  const today = new Date();
  const startDate = new Date(today);

  if (period === "weekly") {
    const day = today.getDay();
    const daysSinceMonday = day === 0 ? 6 : day - 1;
    startDate.setDate(today.getDate() - daysSinceMonday);
  }

  if (period === "monthly") {
    startDate.setDate(1);
  }

  if (period === "yearly") {
    startDate.setMonth(0, 1);
  }

  return period ? formatInputDate(startDate) : DEFAULT_USERS_START_DATE;
};

type GetAllUsersArgs =
  | string
  | {
      token: string;
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
    };

type GetUserStatsArgs =
  | string
  | {
      token: string;
      period?: StatsDatePeriod;
      startDate?: string;
      endDate?: string;
    };

type GetStatsGraphArgs =
  | string
  | {
      token: string;
      period?: StatsDatePeriod;
      startDate?: string;
      endDate?: string;
    };

type GetPaidGraphArgs =
  | string
  | {
      token: string;
      period?: StatsDatePeriod;
      startDate?: string;
      endDate?: string;
    };

type PaidGraphResponse = {
  chart1: {
    month: string;
    unpaid: number;
    paid: number;
  }[];
  chart2: {
    month: string;
    free: number;
    standard: number;
    premium: number;
  }[];
};

const normalizeUsersResponse = (response: unknown): PaginatedResponse<User> => {
  const getStringValue = (value: unknown) =>
    typeof value === "string" && value.length > 0 ? value : undefined;

  const getNumberValue = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value)
      ? value
      : typeof value === "string" &&
          value.trim() !== "" &&
          !Number.isNaN(Number(value))
        ? Number(value)
        : undefined;

  if (Array.isArray(response)) {
    return {
      count: response.length,
      results: response as User[],
    };
  }

  const payload =
    response && typeof response === "object" && "data" in response
      ? (response as ApiEnvelope<unknown>).data
      : response;

  if (Array.isArray(payload)) {
    return {
      count: payload.length,
      results: payload as User[],
    };
  }

  if (payload && typeof payload === "object") {
    const data = payload as {
      count?: number;
      next?: string | null;
      page?: number;
      limit?: number;
      previous?: string | null;
      results?: User[];
      total?: number;
      total_count?: number;
      total_pages?: number;
      total_users?: number;
      users?: User[];
      pagination?: {
        count?: number;
        page?: number;
        limit?: number;
        next?: string | null;
        previous?: string | null;
        total?: number;
        total_count?: number;
        total_pages?: number;
        total_users?: number;
      };
    };
    const users = data.results ?? data.users ?? [];
    const count =
      getNumberValue(data.count) ??
      getNumberValue(data.total_users) ??
      getNumberValue(data.total_count) ??
      getNumberValue(data.total) ??
      getNumberValue(data.pagination?.count) ??
      getNumberValue(data.pagination?.total_users) ??
      getNumberValue(data.pagination?.total_count) ??
      getNumberValue(data.pagination?.total) ??
      users.length;

    return {
      count,
      page: getNumberValue(data.page) ?? getNumberValue(data.pagination?.page),
      limit:
        getNumberValue(data.limit) ?? getNumberValue(data.pagination?.limit),
      next: data.next ?? getStringValue(data.pagination?.next),
      previous: data.previous ?? getStringValue(data.pagination?.previous),
      results: users,
      total_pages:
        getNumberValue(data.total_pages) ??
        getNumberValue(data.pagination?.total_pages),
    };
  }

  return {
    count: 0,
    results: [],
  };
};

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<PaginatedResponse<User>, GetAllUsersArgs>({
      query: (args) => {
        const params =
          typeof args === "string"
            ? {
                token: args,
                page: 1,
                limit: 10,
                startDate: DEFAULT_USERS_START_DATE,
                endDate: getTodayInputDate(),
              }
            : {
                token: args.token,
                page: args.page ?? 1,
                limit: args.limit ?? 10,
                startDate: args.startDate || DEFAULT_USERS_START_DATE,
                endDate: args.endDate || getTodayInputDate(),
              };
        const searchParams = new URLSearchParams({
          page: `${Math.max(params.page, 1)}`,
          limit: `${params.limit}`,
        });

        searchParams.set("start_date", params.startDate);
        searchParams.set("end_date", params.endDate);

        return {
          url: `/api/admin_app/userslist/?${searchParams.toString()}`,
          method: "GET",
          headers: { Authorization: `Bearer ${params.token}` },
        };
      },
      providesTags: ["Users"],
      transformResponse: normalizeUsersResponse,
    }),
    getUser: build.query({
      query: ({ id, token }: { id: string; token: string }) => ({
        url: `/get-user-data/${id}/`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["User"],
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: User;
      }) => response.data,
    }),
    getUserStats: build.query<Card[], GetUserStatsArgs>({
      query: (args) => {
        const params =
          typeof args === "string"
            ? {
                token: args,
                startDate: DEFAULT_USERS_START_DATE,
                endDate: getTodayInputDate(),
              }
            : {
                token: args.token,
                startDate:
                  args.startDate || getStatsPeriodStartDate(args.period),
                endDate: args.endDate || getTodayInputDate(),
              };
        const searchParams = new URLSearchParams({
          start_date: params.startDate,
          end_date: params.endDate,
        });

        return {
          url: `/api/admin_app/user_stats/?${searchParams.toString()}`,
          method: "GET",
          headers: { Authorization: `Bearer ${params.token}` },
        };
      },
      providesTags: ["Stats"],
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: Card[];
      }) => response.data,
    }),
    getPaidUserStats: build.query({
      query: () => ({
        url: "/user_payment_stats/",
        method: "GET",
      }),
      providesTags: ["Stats"],
      transformResponse: (response: PaidUserStats) => response.data,
    }),
    getActiveUserStats: build.query({
      query: () => ({
        url: "/user_active_stats/",
        method: "GET",
      }),
      providesTags: ["Stats"],
      transformResponse: (response: ActiveUserStats) => response.data,
    }),
    postUser: build.mutation({
      query: ({ data, token }: { data: FormData; token: string }) => ({
        url: "/add_user/",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      }),
      invalidatesTags: ["Users", "Stats"],
    }),
    editUser: build.mutation({
      query: ({
        id,
        data,
        token,
      }: {
        id: string;
        data: FormData;
        token: string;
      }) => ({
        url: `/edit_user/${id}/`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: build.mutation({
      query: ({ id, token }: { id: string; token: string }) => ({
        url: `/delete_user/${id}/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Users", "Stats"],
    }),
    toggleUserStatus: build.mutation({
      query: ({ id, token }: { id: number; token: string }) => ({
        url: "/toggle-active/",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { id },
      }),
      invalidatesTags: ["Users"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            "getAllUsers" as never,
            {} as never,
            (draft: User[]) => {
              const user = draft.find((p: User) => p.id === arg.id);
              if (user) {
                user.is_active = !user.is_active;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    getStatsGraph: build.query<
      {
        date: string;
        active: number;
        inactive: number;
        tablet: number;
      }[],
      GetStatsGraphArgs
    >({
      query: (args) => {
        const params =
          typeof args === "string"
            ? {
                token: args,
                startDate: DEFAULT_USERS_START_DATE,
                endDate: getTodayInputDate(),
              }
            : {
                token: args.token,
                startDate:
                  args.startDate || getStatsPeriodStartDate(args.period),
                endDate: args.endDate || getTodayInputDate(),
              };
        const searchParams = new URLSearchParams({
          start_date: params.startDate,
          end_date: params.endDate,
        });

        return {
          url: `/api/admin_app/stats_graph/?${searchParams.toString()}`,
          method: "GET",
          headers: { Authorization: `Bearer ${params.token}` },
        };
      },
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: {
          date: string;
          inactive: number;
          active: number;
          total: number;
        }[];
      }) => {
        const formattedResponse = response.data.map((item) => {
          return {
            date: item.date,
            active: item.active,
            inactive: item.inactive,
            tablet: item.total,
          };
        });

        return formattedResponse;
      },
    }),
    getPaidGraph: build.query<PaidGraphResponse, GetPaidGraphArgs>({
      query: (args) => {
        const params =
          typeof args === "string"
            ? {
                token: args,
                startDate: DEFAULT_USERS_START_DATE,
                endDate: getTodayInputDate(),
              }
            : {
                token: args.token,
                startDate:
                  args.startDate || getStatsPeriodStartDate(args.period),
                endDate: args.endDate || getTodayInputDate(),
              };
        const searchParams = new URLSearchParams({
          start_date: params.startDate,
          end_date: params.endDate,
        });

        return {
          url: `/api/admin_app/paid_graph/?${searchParams.toString()}`,
          method: "GET",
          headers: { Authorization: `Bearer ${params.token}` },
        };
      },
      providesTags: ["Stats"],
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: PaidGraphResponse;
      }) => response.data,
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetAllUsersQuery,
  useGetUserStatsQuery,
  useGetPaidUserStatsQuery,
  useGetActiveUserStatsQuery,
  usePostUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useGetStatsGraphQuery,
  useGetPaidGraphQuery,
} = userApi;
