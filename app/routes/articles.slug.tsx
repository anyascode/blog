import { format } from "date-fns";
import Markdown from "markdown-to-jsx";
import type { Route } from "./+types/route-name";
import { useGetArticleQuery } from "~/features/articles/articleService";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }: Route.LoaderArgs) {
  const postSlug = params.slug;
  return { postSlug };
}

export default function ArticleSlug({ loaderData }: Route.ComponentProps) {
  const { data, isLoading, isError } = useGetArticleQuery(loaderData?.postSlug);

  if (isError) {
    return (
      <div className="text-red-600 flex flex-row justify-center items-center pt-[251px]">
        <ExclamationCircleIcon className="size-5" />{" "}
        <p className="text-xl">{isError}</p>
      </div>
    );
  }
  return (
    <>
      {isLoading ? (
        <div className="text-[#1890FF] flex flex-row justify-center items-center pt-[251px]">
          <ArrowPathIcon className="animate-spin  size-5  " />{" "}
          <p className="text-xl">Loading article...</p>
        </div>
      ) : (
        <article className="py-[26px] px-[251px]">
          <div className="bg-white p-[16px] shadow-md flex flex-col gap-[25px]">
            <div className="flex flex-row justify-between items-center overflow-hidden">
              <div className="flex flex-col gap-[4px]">
                {" "}
                <h1
                  className="flex flex-row text-sky-500 text-xl items-center gap-[13px]
  "
                >
                  {data?.article.title}
                  <p
                    className="flex flex-row text-black text-xs items-center gap-[5px]
  "
                  >
                    <img src="/Vector.svg" alt="" />
                    {data?.article.favoritesCount}
                  </p>
                </h1>
                <div className="flex flex-row gap-[8px] ">
                  {data?.article.tagList?.map((tag: string, i: number) => (
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
                    {data?.article.author?.username}
                  </h1>
                  <h2 className="text-xs text-gray-500">
                    {data?.createdAt
                      ? format(new Date(data?.article.createdAt), "PPP")
                      : ""}
                  </h2>
                </div>
                <img
                  src={
                    data?.article.author?.image
                      ? data.article.author?.image
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl9tmItyQlUn7ktlHH10GC4cu_-znWFXXW-w&s"
                  }
                  alt="avatar"
                  className="rounded-[50%] block size-[46px]  object-cover
  "
                />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-[4px]">
              {data?.article.description}
            </p>
            <section className="flex flex-wrap overflow-hidden">
              <Markdown>{data?.article.body}</Markdown>
            </section>
          </div>
        </article>
      )}
    </>
  );
}
