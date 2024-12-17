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
    getUserStats: build.query({
      query: () => ({
        url: "/user_stats/",
        method: "GET",
      }),
      providesTags: ["Stats"],
      transformResponse: (response: UsersResponse) => response.data.users,
    }),
    getPaidUserStats: build.query({
      query: () => ({
        url: "/users_payment_stats/",
        method: "GET",
      }),
      providesTags: ["Stats"],
      transformResponse: (response: PaidUserStats) => response.data,
    }),
    getActiveUserStats: build.query({
      query: () => ({
        url: "/usesr_active_stats/",
        method: "GET",
      }),
      providesTags: ["Stats"],
      transformResponse: (response: ActiveUserStats) => response.data,
    }),
    postUser: build.mutation({
      query: (data: PostUser) => ({
        url: "/add_user/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users", "Stats"],
    }),
    editUser: build.mutation({
      query: (data: EditUser) => ({
        url: `/edit_user/${data.id}/`,
        method: "PUT",
        body: data.body,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: build.mutation({
      query: (id: number) => ({
        url: `/delete_user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Stats"],
    }),
  }),
});

export const { useGetAllUsersQuery } = userApi;
