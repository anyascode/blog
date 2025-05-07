import { useEffect, useState } from "react";
import { format } from "date-fns";
import Markdown from "markdown-to-jsx";
import type { Route } from "./+types/route-name";

export async function loader({ params }: Route.LoaderArgs) {
  const postSlug = params.slug;
  return { postSlug };
}

export async function action() {}

export default function ArticleSlug({ loaderData }: Route.ComponentProps) {
  const [article, setArticle] = useState<{
    author: { username: string; following: boolean; image: string };
    body: string;
    createdAt: string;
    description: string;
    favorited: boolean;
    favoritesCount: number;
    slug: string;
    tagList: string[];
    title: string;
    updatedAt: string;
  }>({
    author: { username: "", following: false, image: "" },
    body: "",
    createdAt: "",
    description: "",
    favorited: false,
    favoritesCount: 0,
    slug: "",
    tagList: [],
    title: "",
    updatedAt: "",
  });

  useEffect(() => {
    async function fetchArticle(slug: string) {
      let response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`
      );
      let data = await response.json();
      setArticle((prev) => ({ ...prev, ...data.article }));
    }
    fetchArticle(loaderData.postSlug);
  }, []);

  console.log(article);
  return (
    <article className="py-[26px] px-[251px]">
      <div className="bg-white p-[16px] shadow-md flex flex-col gap-[25px]">
        <div className="flex flex-row justify-between items-center overflow-hidden">
          <div className="flex flex-col gap-[4px]">
            {" "}
            <h1
              className="flex flex-row text-sky-500 text-xl items-center gap-[13px]
  "
            >
              {article.title}{" "}
              <p
                className="flex flex-row text-black text-xs items-center gap-[5px]
  "
              >
                <img src="/Vector.svg" alt="" />
                {article.favoritesCount}
              </p>
            </h1>
            <div className="flex flex-row gap-[8px] ">
              {article.tagList.map((tag, i) => (
                <span
                  className="border-[1px] border-black border-solid text-xs px-[5px] py-[2px] text-center rounded-xs"
                  key={i}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-row gap-[12px]">
            <div className="flex flex-col">
              {" "}
              <h1
                className="text-lg
   text-black capitalize"
              >
                {article.author.username}
              </h1>
              <h2 className="text-xs text-gray-500">
                {article.createdAt
                  ? format(new Date(article.createdAt), "PPP")
                  : ""}
              </h2>
            </div>
            <img
              src={article.author.image}
              alt="avatar"
              className="rounded-[50%] block size-[46px]
  "
            />
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-[4px]">{article.description}</p>
        <section className="flex flex-wrap overflow-hidden">
          <Markdown>{article.body}</Markdown>
        </section>
      </div>
    </article>
  );
}
