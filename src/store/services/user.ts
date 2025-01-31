import { api } from "./core";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<User[], string>({
      query: (token: string) => ({
        url: "/userslist/",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["Users"],
      transformResponse: (response: UsersResponse) => response.data.users,
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
    getUserStats: build.query({
      query: (token: string) => ({
        url: "/user_stats/",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
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
    getStatsGraph: build.query({
      query: ({ time, token }: { time: string; token: string }) => ({
        url: `/stats_graph/?period=${time}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
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
} = userApi;
