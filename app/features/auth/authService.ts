import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "~/store";

interface User {
  bio?: string;
  email: string;
  image: string | null;
  username: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://blog-platform.kata.academy/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.userToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
        return headers;
      }
    },
  }),
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
    }),
    updateUser: builder.mutation<
      { user: User },
      { user: Partial<User> & { password?: string } }
    >({
      query: (data) => ({
        url: "/user",
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetUserDetailsQuery, useUpdateUserMutation } = authApi;
