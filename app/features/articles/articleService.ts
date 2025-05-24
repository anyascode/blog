import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";

interface Article {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

interface UpdateArticleRequest {
  slug: string;
  article: Article;
}

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
        url: "/articles",
        method: "POST",
        body: { article },
      }),
    }),
    updateArticle: builder.mutation<{ article: Article }, UpdateArticleRequest>(
      {
        query: ({ slug, article }) => ({
          url: `/articles/${slug}`,
          method: "PUT",
          body: { article },
        }),
      }
    ),
    deleteArticle: builder.mutation({
      query: (slug) => ({
        url: `/article/${slug}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articlesApi;
