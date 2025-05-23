import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "~/store";
import { setCredentials } from "./authSlice";

interface User {
  bio?: string;
  email: string;
  image: string | null;
  username: string;
  token?: string;
}

interface LoginCredentials {
  user: {
    email: string;
    password: string;
  };
}

interface RegisterCredentials {
  user: {
    username: string;
    email: string;
    password: string;
  };
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update authSlice state
          dispatch(
            setCredentials({
              ...data.user,
              image: data.user.image === null ? undefined : data.user.image,
            })
          );
          // Update localStorage
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              ...data.user,
              image: data.user.image === null ? undefined : data.user.image,
            })
          );
          if (data.user.token) {
            localStorage.setItem("userToken", data.user.token);
          }
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useGetUserDetailsQuery, useUpdateUserMutation } = authApi;
