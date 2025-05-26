import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface PaginationProps {
  totalCount?: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function Pagination({
  totalCount,
  currentPage,
  setCurrentPage,
}: PaginationProps) {
  const totalPages = Math.ceil((totalCount ?? 0) / 5);

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
  );
}
