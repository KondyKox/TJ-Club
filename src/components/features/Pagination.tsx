"use client";

import { PaginationProps } from "@/types/PaginationProps";
import { useState } from "react";

const Pagination = <T,>({
  items,
  itemsPerPage = 6,
  renderItem,
}: PaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col items-center">
      <div className="grid place-items-center md:grid-cols-2 gap-4">
        {currentItems.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className="page-btn"
            style={{
              backgroundColor:
                index + 1 === currentPage ? "var(--clr-akcent)" : "",
              color: index + 1 === currentPage ? "var(--clr-secondary)" : "",
            }}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
