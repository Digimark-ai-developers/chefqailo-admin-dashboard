import { api } from "./core";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: () => ({
        url: "/userslist/",
        method: "GET",
      }),
      providesTags: ["Users"],
      transformResponse: (response: UsersResponse) => response.data.users,
    }),
    getUser: build.query({
      query: (id: string) => ({
        url: `/get-user-data/${id}/`,
        method: "GET",
      }),
      providesTags: ["User"],
      transformResponse: (response: {
        status_code: number;
        message: string;
        data: User;
      }) => response.data,
    }),
    getUserStats: build.query({
      query: () => ({
        url: "/user_stats/",
        method: "GET",
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
      query: (data: FormData) => ({
        url: "/add_user/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users", "Stats"],
    }),
    editUser: build.mutation({
      query: ({ id, data }: { id: string; data: FormData }) => ({
        url: `/edit_user/${id}/`,
        method: "PUT",
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
      query: (id: string) => ({
        url: "/toggle-active/",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["Users"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            "getAllUsers",
            undefined,
            (draft: User[]) => {
              const user = draft.find((p: User) => p.id === parseInt(arg));
              if (user) {
                user.status = user.status ? false : true;
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
    toggleUserPaidStatus: build.mutation({
      query: (id: string) => ({
        url: "/toggle-paid/",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: ["Users"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            "getAllUsers",
            undefined,
            (draft: User[]) => {
              const user = draft.find((p: User) => p.id === parseInt(arg));
              if (user) {
                user.is_paid = user.is_paid ? false : true;
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
  useToggleUserPaidStatusMutation,
} = userApi;
