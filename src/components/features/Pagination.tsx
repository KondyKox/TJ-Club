"use client";

import { ImageProps } from "@/types/ImageProps";
import { PaginationProps } from "@/types/PaginationProps";
import { QuoteProps } from "@/types/QuoteProps";
import { useState } from "react";

const Pagination = <T extends QuoteProps | ImageProps>({
  items,
  itemsPerPage = 6,
  renderItem,
}: PaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Check if items are Album Images
  const isImageProps = currentItems.length > 0 && "src" in currentItems[0];

  return (
    <div className="flex flex-col items-center">
      <div
        className={`grid place-items-center gap-4 ${
          isImageProps ? "" : "md:grid-cols-2"
        }`}
      >
        {currentItems.map((item, index) => (
          <div key={index} className="w-full">
            {renderItem(item)}
          </div>
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
