import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchableSelect from './SearchableSelect';

const options = [
  { value: '1', label: 'Alpha Team' },
  { value: '2', label: 'Beta Club' },
  { value: '3', label: 'Gamma XI' },
];

describe('SearchableSelect', () => {
  it('renders with placeholder when no value selected', () => {
    render(
      <SearchableSelect id="test" value="" onChange={jest.fn()} options={options} placeholder="— Select —" />
    );
    expect(screen.getByText('— Select —')).toBeInTheDocument();
  });

  it('shows selected label when value is set', () => {
    render(
      <SearchableSelect id="test" value="2" onChange={jest.fn()} options={options} />
    );
    expect(screen.getByText('Beta Club')).toBeInTheDocument();
  });

  it('opens dropdown with all options when button is clicked', () => {
    render(
      <SearchableSelect id="test" value="" onChange={jest.fn()} options={options} />
    );
    fireEvent.click(screen.getByRole('button', { name: /— Please select —/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('filters options as user types', () => {
    render(
      <SearchableSelect id="test" value="" onChange={jest.fn()} options={options} />
    );
    fireEvent.click(screen.getByRole('button', { name: /— Please select —/i }));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'alp' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'Alpha Team' })).toBeInTheDocument();
  });

  it('shows "No matches" when filter has no results', () => {
    render(
      <SearchableSelect id="test" value="" onChange={jest.fn()} options={options} />
    );
    fireEvent.click(screen.getByRole('button', { name: /— Please select —/i }));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } });
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('calls onChange and closes dropdown when option is selected', () => {
    const handleChange = jest.fn();
    render(
      <SearchableSelect id="test" value="" onChange={handleChange} options={options} />
    );
    fireEvent.click(screen.getByRole('button', { name: /— Please select —/i }));
    fireEvent.click(screen.getByRole('option', { name: 'Gamma XI' }));
    expect(handleChange).toHaveBeenCalledWith('3');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', () => {
    const handleChange = jest.fn();
    render(
      <SearchableSelect id="test" value="1" onChange={handleChange} options={options} />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('closes dropdown on Escape key', () => {
    render(
      <SearchableSelect id="test" value="" onChange={jest.fn()} options={options} />
    );
    fireEvent.click(screen.getByRole('button', { name: /— Please select —/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
