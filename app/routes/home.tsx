import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  useEffect(() => {
    if (userInfo) {
      navigate("/articles");
    } else {
      navigate("/sign-in");
    }
  }, [userInfo, navigate]);

  return null;
}
