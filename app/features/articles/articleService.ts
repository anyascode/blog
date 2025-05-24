import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";

interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface ArticleResponse {
  article: Article;
}

interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

interface UpdateArticleRequest {
  slug: string;
  article: Partial<
    Omit<Article, "slug" | "author" | "createdAt" | "updatedAt">
  >;
}

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  tagTypes: ["Article"],
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
    getArticles: builder.query<ArticlesResponse, number>({
      query: (offset = 0) => `/articles?limit=5&offset=${offset}`,
    }),
    getArticle: builder.query<ArticleResponse, string>({
      query: (slug: string) => `/articles/${slug}`,
    }),
    createArticle: builder.mutation<ArticleResponse, Partial<Article>>({
      query: (article) => ({
        url: "/articles",
        method: "POST",
        body: { article },
      }),
      async onQueryStarted(article, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            articlesApi.util.updateQueryData("getArticles", 0, (draft) => {
              draft.articles.unshift(data.article);
            })
          );
        } catch (err) {
          console.log(err);
        }
      },
      invalidatesTags: ["Article"],
    }),
    updateArticle: builder.mutation<ArticleResponse, UpdateArticleRequest>({
      query: ({ slug, article }) => ({
        url: `/articles/${slug}`,
        method: "PUT",
        body: { article },
      }),
      async onQueryStarted({ slug, article }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            articlesApi.util.updateQueryData("getArticle", slug, (draft) => {
              Object.assign(draft.article, data.article);
            })
          );

          dispatch(
            articlesApi.util.updateQueryData("getArticles", 0, (draft) => {
              const index = draft.articles.findIndex((a) => a.slug === slug);
              if (index !== -1) {
                draft.articles[index] = data.article;
              }
            })
          );
        } catch (err) {
          console.log(err);
        }
      },
      invalidatesTags: (result, error, { slug }) => [
        { type: "Article", id: "LIST" },
        { type: "Article", id: slug },
      ],
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, slug) => [
        { type: "Article", id: slug },
        { type: "Article", id: "LIST" },
      ],
      async onQueryStarted(slug, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            articlesApi.util.updateQueryData("getArticles", 0, (draft) => {
              draft.articles = draft.articles.filter(
                (article: Article & { slug: string }) => article.slug !== slug
              );
            })
          );
        } catch (err) {
          console.error("Delete failed:", err);
        }
      },
    }),
    likeArticle: builder.mutation<ArticleResponse, string>({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: "POST",
      }),
      async onQueryStarted(slug, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            articlesApi.util.updateQueryData("getArticles", 0, (draft) => {
              const article = draft.articles.find((a) => a.slug === slug);
              if (article) {
                article.favorited = true;
                article.favoritesCount = (article.favoritesCount || 0) + 1;
              }
            })
          );
          dispatch(
            articlesApi.util.updateQueryData("getArticle", slug, (draft) => {
              if (draft?.article) {
                draft.article.favorited = true;
                draft.article.favoritesCount =
                  (draft.article.favoritesCount || 0) + 1;
              }
            })
          );
        } catch (err) {
          console.error("Like failed:", err);
        }
      },
    }),
    removeLike: builder.mutation<ArticleResponse, string>({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: "DELETE",
      }),
      async onQueryStarted(slug, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            articlesApi.util.updateQueryData("getArticles", 0, (draft) => {
              const article = draft.articles.find((a) => a.slug === slug);
              if (article) {
                article.favorited = false;
                article.favoritesCount = Math.max(
                  (article.favoritesCount || 0) - 1,
                  0
                );
              }
            })
          );
          dispatch(
            articlesApi.util.updateQueryData("getArticle", slug, (draft) => {
              if (draft?.article) {
                draft.article.favorited = false;
                draft.article.favoritesCount = Math.max(
                  (draft.article.favoritesCount || 0) - 1,
                  0
                );
              }
            })
          );
        } catch (err) {
          console.error("Unlike failed:", err);
        }
      },
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useLikeArticleMutation,
  useRemoveLikeMutation,
} = articlesApi;
