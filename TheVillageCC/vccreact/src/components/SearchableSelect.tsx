import React, { useEffect, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

const SearchableSelect: React.FC<Props> = ({
  id,
  value,
  onChange,
  options,
  placeholder = '— Please select —',
}) => {
  const selectedOption = options.find(o => o.value === value) ?? null;
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = filter.trim()
    ? options.filter(o => o.label.toLowerCase().includes(filter.toLowerCase()))
    : options;

  const openDropdown = () => {
    setFilter('');
    setIsOpen(true);
  };

  // Focus the filter input when the dropdown opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const selectOption = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    setFilter('');
  };

  const clearSelection = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    setFilter('');
  };

  const handleClearKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      clearSelection(e);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFilter('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setFilter('');
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden input to associate the label's htmlFor with the combobox */}
      <input type="hidden" id={id} value={value} readOnly />

      {isOpen ? (
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type to filter…"
          className="w-full border border-villageGreen rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen"
        />
      ) : (
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded="false"
          onClick={openDropdown}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-left bg-white focus:outline-none focus:ring-1 focus:ring-villageGreen flex items-center justify-between"
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="flex items-center gap-1 shrink-0 ml-2">
            {selectedOption && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear selection"
                onClick={clearSelection}
                onKeyDown={handleClearKeyDown}
                className="material-symbols-outlined text-[16px] leading-none text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                close
              </span>
            )}
            <span className="material-symbols-outlined text-[16px] leading-none text-gray-400">expand_more</span>
          </span>
        </button>
      )}

      {isOpen && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-gray-400 italic">No matches</li>
          ) : (
            filtered.map(o => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                onClick={() => selectOption(o)}
                className={`px-3 py-2 cursor-pointer ${
                  o.value === value
                    ? 'bg-villageGreen text-white'
                    : 'hover:bg-gray-100 text-gray-900'
                }`}
              >
                {o.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
