'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';

type Props = {
  currentPageNumber: number;
  currentPageUrl: string;
  totalPages: number;
  currentSort?: string;
};

const Pagination = ({ currentPageNumber, totalPages, currentPageUrl, currentSort }: Props) => {
  const router = useRouter();
  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Less pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // Always show first page

      if (currentPageNumber > 3) {
        pages.push('...');
      }

      const startPage = Math.max(2, currentPageNumber - 1);
      const endPage = Math.min(totalPages - 1, currentPageNumber + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPageNumber < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages); // Always show last page
    }

    return pages;
  };

  const onPageChange = (page: number) => {
    router.push(
      `${currentPageUrl}?pageNumber=${page}${currentSort ? `&sort=${currentSort}` : ''}`,
      { scroll: true } // Prevent scroll to top
    );
  };

  const pages = generatePageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        className="btn btn-md btn-square btn-ghost"
        onClick={() => onPageChange(currentPageNumber - 1)}
        disabled={currentPageNumber === 1}
      >
        <IoIosArrowForward className="rotate-180" size={20} />
      </button>

      <div className="flex gap-1">
        {pages.map((page, index) => (
          <button
            key={index}
            className={`btn btn-md btn-square ${
              page === currentPageNumber ? 'btn-active' : 'btn-ghost'
            } ${page === '...' ? 'cursor-default pointer-events-none' : ''}`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="btn btn-square btn-ghost"
        onClick={() => onPageChange(currentPageNumber + 1)}
        disabled={currentPageNumber === totalPages}
      >
        <IoIosArrowForward size={20} />
      </button>
    </div>
  );
};

export default Pagination;
