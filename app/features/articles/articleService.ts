import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://blog-platform.kata.academy/api",
  }),
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: (offset = 0) => `/articles?limit=5&offset=${offset}`,
    }),
    getArticle: builder.query({
      query: (slug: string) => `/articles/${slug}`,
    }),
  }),
});

export const { useGetArticlesQuery, useGetArticleQuery } = articlesApi;
