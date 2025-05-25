import { redirect } from "react-router";
import type { Route } from "./+types/home";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  return redirect("/sign-in");
}

export default function Home() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  // If user is authenticated, redirect to articles
  if (userInfo) {
    return redirect("/articles");
  }
  return null;
}
