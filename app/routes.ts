import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("articles", "routes/articles.tsx"),
  route("articles/:slug", "routes/articles.slug.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("profile", "routes/profile.tsx"),
  route("new-article", "routes/new-article.tsx"),
  route("articles/:slug/edit", "routes/articles.slug.edit.tsx"),
] satisfies RouteConfig;
