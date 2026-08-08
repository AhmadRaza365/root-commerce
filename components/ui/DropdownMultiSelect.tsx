import React, { useEffect, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';

export type DropdownMultiSelectOption = {
  label: string | React.ReactNode;
  value: string;
};

type Props = {
  selectedOptions: DropdownMultiSelectOption[];
  options: DropdownMultiSelectOption[];
  label: string;
  onSelect: (options: DropdownMultiSelectOption[]) => void;
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
  showAddOption?: boolean;
  showSelectAll?: boolean;
  selectAllText?: string;
  deselectAllText?: string;
};

function DropdownMultiSelect({
  selectedOptions,
  options,
  label,
  onSelect,
  classNames = { container: '', button: 'btn-active', list: '', item: '', itemButton: '' },
  showSearch = false,
  searchPlaceholder = 'Search...',
  noOptionsText = 'No options found',
  showSelectAll = false,
  showAddOption = false,
  selectAllText = 'Select All',
  deselectAllText = 'Deselect All',
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const toggleSelect = (option: DropdownMultiSelectOption) => {
    const alreadySelected = selectedOptions.some((o) => o.value === option.value);
    if (alreadySelected) {
      onSelect(selectedOptions.filter((o) => o.value !== option.value));
    } else {
      onSelect([...selectedOptions, option]);
    }
  };

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
        role="button"
        type="button"
        className={`btn btn-block btn-outline m-1 font-normal flex items-center justify-between gap-2 ${classNames.button}`}
        onClick={() => setOpenDropdown(!openDropdown)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setOpenDropdown(!openDropdown);
          }
        }}
      >
        <span className="truncate w-full text-left">
          {selectedOptions.length > 0 ? selectedOptions.map((opt) => opt.label).join(', ') : label}
        </span>

        <IoChevronDown className="text-lg" />
      </button>
      {openDropdown && (
        <ul
          className={`z-5 absolute top-full left-0 flex flex-col gap-2 divide-y divide-base-content/20 p-2 shadow-md ~shadow-base-content/15 bg-base-100 rounded-box w-full border border-base-content/20 ${classNames.list}`}
        >
          {options.length === 0 ? (
            <div className="p-2">
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
                  />
                </div>
              )}
              {showSelectAll && (
                <li className={classNames.item}>
                  <button
                    type="button"
                    onClick={() => {
                      const allSelected = options.filter((opt) =>
                        selectedOptions.some((s) => s.value === opt.value)
                      );
                      if (allSelected.length === options.length) {
                        onSelect([]);
                      } else {
                        onSelect(options);
                      }
                    }}
                    className={`justify-start flex w-full items-center ${classNames.itemButton} peer`}
                  >
                    <span>
                      {selectedOptions.length === options.length ? deselectAllText : selectAllText}
                    </span>
                  </button>
                </li>
              )}
              {options
                .filter((option) =>
                  option?.label?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((option, index) => {
                  const isSelected = selectedOptions.some((o) => o.value === option.value);
                  return (
                    <li key={index} className={classNames.item}>
                      <button
                        type="button"
                        onClick={() => {
                          toggleSelect(option);
                        }}
                        className={`justify-start flex gap-2.5 pb-1.5 w-full items-center ${classNames.itemButton} peer`}
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-xs"
                          readOnly
                          checked={isSelected}
                          tabIndex={-1}
                        />

                        <span>{option.label}</span>
                      </button>
                    </li>
                  );
                })}
              {options.filter((option) =>
                option?.label?.toString().toLowerCase().includes(searchTerm.toLowerCase())
              )?.length === 0 && (
                <>
                  <div className="p-2">
                    <button className={`justify-start ${classNames.itemButton}`} disabled>
                      {noOptionsText}
                    </button>
                  </div>

                  {showAddOption && searchTerm && (
                    <li className={classNames.item}>
                      <button
                        onClick={() => {
                          toggleSelect({ label: searchTerm, value: searchTerm });
                          (document.activeElement as HTMLElement)?.blur();
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

export default DropdownMultiSelect;
