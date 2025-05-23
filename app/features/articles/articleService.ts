import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";

export const articlesApi = createApi({
  reducerPath: "articlesApi",
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
    getArticles: builder.query({
      query: (offset = 0) => `/articles?limit=5&offset=${offset}`,
    }),
    getArticle: builder.query({
      query: (slug: string) => `/articles/${slug}`,
    }),
    createArticle: builder.mutation({
      query: (article) => ({
        url: '/articles',
        method: 'POST',
        body: { article },
      }),
    }),
  }),
});

export const { useGetArticlesQuery, useGetArticleQuery, useCreateArticleMutation } = articlesApi;
