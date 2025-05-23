import { useState } from "react";
import { format } from "date-fns";
import {
  HeartIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";
import { useGetArticlesQuery } from "~/features/articles/articleService";
import Pagination from "~/сomponents/Pagination/Pagination";

export default function Articles() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const offset = (currentPage - 1) * 5;

  const { data, isLoading, isError } = useGetArticlesQuery(offset);

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
          <p className="text-xl">Loading articles...</p>
        </div>
      ) : (
        <div className="pt-[26px]">
          <ul className="flex flex-col gap-[26px] px-[251px] py-[6px]">
            {data.articles.map((article: any) => (
              <li
                key={`${article.slug}-${article.createdAt}`}
                className="bg-white p-[16px] shadow-md"
              >
                <div className="flex flex-row justify-between items-center overflow-hidden">
                  <div className="flex flex-col gap-[4px]">
                    {" "}
                    <h1
                      className="flex flex-row text-[#1890FF] text-xl items-center gap-[13px]
"
                    >
                      <Link to={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                      <p
                        className="flex flex-row text-black text-xs items-center gap-[5px]
"
                      >
                        <HeartIcon className="size-[16px]" />

                        {article.favoritesCount}
                      </p>
                    </h1>
                    <div className="flex flex-row gap-[8px] ">
                      {article.tagList.map((tag: string, i: number) => (
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
                      <h2
                        className="text-xs text-gray-500
"
                      >
                        {format(new Date(article.createdAt), "PPP")}
                      </h2>
                    </div>
                    <img
                      src={
                        article.author.image
                          ? article.author.image
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl9tmItyQlUn7ktlHH10GC4cu_-znWFXXW-w&s"
                      }
                      alt="avatar"
                      className="rounded-[50%] block size-[46px] object-cover
"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-[4px]">
                  {article.description}
                </p>
              </li>
            ))}
          </ul>

          <Pagination
            totalCount={data?.articlesCount}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}
    </>
  );
}
