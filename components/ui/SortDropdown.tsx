'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoChevronDown } from 'react-icons/io5';

type Props = {
  currentPage?: string;
  selectedSort?: string;
};

type SortOption = {
  label: string;
  value: string;
};

const sortOptions: SortOption[] = [
  { label: 'Sort by', value: 'default' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Name: A-Z', value: 'name-asc' },
  { label: 'Name: Z-A', value: 'name-desc' },
];

function SortDropdown({ selectedSort = 'default', currentPage }: Props) {
  const router = useRouter();
  const selectedOption = sortOptions.find((option) => option.value === selectedSort);

  return (
    <div className="dropdown dropdown-end w-full sm:w-52">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-active btn-block  m-1 flex items-center justify-between gap-2"
      >
        {selectedOption ? selectedOption.label : 'Sort by'}
        <IoChevronDown className="text-lg" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-11 menu p-2 shadow bg-base-100 rounded-box w-full sm:w-52"
      >
        {sortOptions.map((option) => (
          <li key={option.value}>
            <button
              onClick={() => {
                router.push(`${currentPage}?pageNumber=1&sort=${option.value}`);
                (document.activeElement as HTMLElement)?.blur();
              }}
              className="justify-start"
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SortDropdown;
