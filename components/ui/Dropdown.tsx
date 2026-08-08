import React, { useEffect, useRef, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';

export type DropdownOption = {
  label: string | React.ReactNode;
  value: string;
};

type Props = {
  selectedOption: DropdownOption | null;
  options: DropdownOption[];
  label: string;
  onSelect: (option: DropdownOption) => void;
  classNames?: {
    container?: string;
    button?: string;
    list?: string;
    item?: string;
    itemButton?: string;
  };
  showSearch?: boolean;
  searchPlaceholder?: string;
  noOptionsText?: string;
  hideAddOption?: boolean;
  noSearchResultsText?: string;
};

function Dropdown({
  selectedOption,
  options,
  label,
  onSelect,
  classNames = { container: '', button: 'btn-active', list: '', item: '', itemButton: '' },
  showSearch = false,
  searchPlaceholder = 'Search...',
  noOptionsText = 'No options found',
  noSearchResultsText = 'No option found',
  hideAddOption = false,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div className={`w-full relative ${classNames.container}`} ref={dropdownRef}>
      <button
        type="button"
        role="button"
        className={`btn btn-block border-base-content/30 m-1 flex items-center justify-between gap-2 ${classNames.button}`}
        onClick={() => setOpenDropdown(!openDropdown)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setOpenDropdown(!openDropdown);
          }
        }}
      >
        {selectedOption ? selectedOption.label : label}
        <IoChevronDown className="text-lg" />
      </button>
      {openDropdown && (
        <ul
          className={`z-5 absolute top-full left-0 flex flex-col gap-0 divide-y divide-base-content/20 p-2 shadow-md bg-base-100 rounded-box w-full border border-base-content/20 ${classNames.list}`}
        >
          {options.length === 0 ? (
            <div className={`p-2`}>
              <button className={`justify-start ${classNames.itemButton}`} disabled>
                {noOptionsText}
              </button>
            </div>
          ) : (
            <>
              {showSearch && (
                <div className="sticky top-0 bg-base-100 z-2 mb-2">
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="input input-bordered w-full"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    autoComplete="off"
                  />
                </div>
              )}
              {options
                .filter((option) =>
                  option?.label?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((option, index) => (
                  <li key={index} className={classNames.item}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(option);
                        (document.activeElement as HTMLElement)?.blur();
                        setOpenDropdown(false);
                        setSearchTerm('');
                      }}
                      className={`justify-start w-full btn btn-ghost ${classNames.itemButton} ${
                        selectedOption?.value === option.value ? 'btn-active' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              {options.filter((option) =>
                option?.label?.toString().toLowerCase().includes(searchTerm.toLowerCase())
              )?.length === 0 && (
                <>
                  <div className={`p-2`}>
                    <button className={`justify-start ${classNames.itemButton}`} disabled>
                      {noSearchResultsText}
                    </button>
                  </div>
                  {!hideAddOption && searchTerm && (
                    <li className={classNames.item}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelect({ label: searchTerm, value: searchTerm });
                          (document.activeElement as HTMLElement)?.blur();
                          setOpenDropdown(false);
                          setSearchTerm('');
                        }}
                        className={`justify-start ${classNames.itemButton}`}
                      >
                        Add &quot;{searchTerm}&quot;
                      </button>
                    </li>
                  )}
                </>
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
