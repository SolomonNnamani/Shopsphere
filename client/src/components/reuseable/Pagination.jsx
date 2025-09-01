import { useState, useRef } from "react";

const Pagination = ({ currentPage, total, setCurrentPage }) => {
  const pageRefs = useRef({});

  const pagesNumbers = [];
  for (let i = 1; i <= total; i++) {
    pagesNumbers.push(i); // this controls paginated litreation( p1, p2)
  }

  const goToPage = (page) => {
    if (page < 1 || page > total) return;
    setCurrentPage(page);
    pageRefs.current[page]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div className="flex justify-center w-full px-2 pt-6">
      <div className="flex gap-2 ">
        {/*Prev*/}
        <button
          onClick={() => goToPage(currentPage - 1)} //current page minus 1
          disabled={currentPage === 1} //if current value is equals to 1 then return true
          className="px-3 h-10 rounded-lg bg-gray-100 hover:bg-gray-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {/*current page*/}
        <div className="w-40 overflow-x-auto hide-scrollbar-lg ">
          <div className="flex gap-2 min-w-max ">
            {pagesNumbers.map((page) => (
              <button
                key={page}
                ref={(el) => (pageRefs.current[page] = el)}
                onClick={() => goToPage(page)}
                className={`w-10 h-10 rounded-full flex items-center justify-center
				${
          currentPage === page
            ? "bg-amber-700 text-white"
            : "bg-gray-200 text-black hover:bg-gray-300"
        }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        {/*Next*/}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === total}
          className="px-3 h-10 rounded-lg bg-gray-100 hover:bg-gray-200
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
