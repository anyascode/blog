import { useEffect, useState } from "react";
import { format } from "date-fns";
import { HeartIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router";

export default function Articles() {
  const [articles, setArticles] = useState<
    {
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
    }[]
  >([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchArticles() {
      const offset = (currentPage - 1) * 5;
      setLoading(true);
      let response = await fetch(
        `https://blog-platform.kata.academy/api/articles?limit=5&offset=${offset}`
      );
      let data = await response.json();
      setLoading(false);
      setArticles(data.articles);
      setTotalCount(data.articlesCount);
    }
    fetchArticles();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / 5);

  const visiblePages = 5;

  const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  const pages = [];

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="pt-[26px]">
        <ul className="flex flex-col gap-[26px] px-[251px] py-[6px]">
          {articles.map((article) => (
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
                    <h2
                      className="text-xs text-gray-500
"
                    >
                      {format(new Date(article.createdAt), "PPP")}
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
              <p className="text-xs text-gray-600 mt-[4px]">
                {article.description}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-center items-center space-x-2 py-[26px]">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            <ChevronLeftIcon
              className={`size-[14px] ${
                currentPage === 1
                  ? `text-gray-500 cursor-default
`
                  : "text-black"
              }`}
            />
          </button>
          {startPage > 1 && (
            <button
              className="px-[8px] py-[3px] rounded text-xs"
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
          )}
          {startPage > 2 && <span className="px-2">...</span>}
          {pages.map((page) => (
            <button
              key={page}
              className={`px-[8px] py-[3px] rounded text-xs ${
                currentPage === page ? "bg-[#1890FF] text-white" : ""
              }`}
              onClick={() => {
                setCurrentPage(page);
              }}
            >
              {page}
            </button>
          ))}
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          {endPage < totalPages && (
            <button
              className="px-[8px] py-[3px] rounded text-xs"
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          )}
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            <ChevronRightIcon
              className={`size-[14px] ${
                currentPage === endPage
                  ? `text-gray-500 cursor-default
`
                  : "text-black"
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
}
