import { useState, useEffect, useCallback } from 'react';
import type { FilterConfig, ProjectStatus } from '../../types';
import './Filters.css';

interface FiltersProps {
  filterConfig: FilterConfig;
  onSearch: (search: string) => void;
  onStatusFilter: (status: ProjectStatus | 'All') => void;
  totalCount: number;
  filteredCount: number;
}

const statuses: (ProjectStatus | 'All')[] = ['All', 'Active', 'Pending', 'Completed', 'On Hold'];

export const Filters = ({
  filterConfig,
  onSearch,
  onStatusFilter,
  totalCount,
  filteredCount
}: FiltersProps) => {
  const [searchValue, setSearchValue] = useState(filterConfig.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className="filters-container">
      <div className="search-wrapper">
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search projects..."
          value={searchValue}
          onChange={handleSearchChange}
        />
        {searchValue && (
          <button className="clear-button" onClick={handleClearSearch}>
            ×
          </button>
        )}
      </div>

      <div className="status-filters">
        {statuses.map(status => (
          <button
            key={status}
            className={`status-filter ${filterConfig.status === status ? 'active' : ''}`}
            onClick={() => onStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredCount !== totalCount && (
        <div className="filter-info">
          Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()}
        </div>
      )}
    </div>
  );
};
