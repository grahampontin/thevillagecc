import React, { useState } from 'react';

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
  className,
}) => {
  const [filter, setFilter] = useState('');

  const filtered = options.filter(o => {
    if (o.value === value) return true;
    if (!filter.trim()) return true;
    return o.label.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Type to search…"
        aria-label="Filter options"
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen mb-1"
      />
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={className ?? 'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-villageGreen'}
      >
        <option value="">{placeholder}</option>
        {filtered.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
};

export default SearchableSelect;
