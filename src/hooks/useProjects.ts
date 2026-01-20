import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Project, SortConfig, FilterConfig, ProjectStatus } from '../types';
import { getCachedProjects } from '../data/mockData';

interface UseProjectsReturn {
  projects: Project[];
  filteredProjects: Project[];
  isLoading: boolean;
  error: string | null;
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
  setSortConfig: (config: SortConfig) => void;
  setFilterConfig: (config: FilterConfig) => void;
  handleSort: (key: keyof Project) => void;
  handleSearch: (search: string) => void;
  handleStatusFilter: (status: ProjectStatus | 'All') => void;
}

export const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null
  });

  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    search: '',
    status: 'All'
  });

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simulate async loading with cached data
        await new Promise(resolve => setTimeout(resolve, 200));
        const data = getCachedProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Memoized filtered and sorted projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Apply search filter
    if (filterConfig.search) {
      const searchLower = filterConfig.search.toLowerCase();
      result = result.filter(project =>
        project.projectName.toLowerCase().includes(searchLower) ||
        project.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filterConfig.status !== 'All') {
      result = result.filter(project => project.status === filterConfig.status);
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [projects, sortConfig, filterConfig]);

  // Handle sort column click
  const handleSort = useCallback((key: keyof Project) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        // Cycle through: asc -> desc -> null
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return { key: null, direction: null };
        }
      }
      return { key, direction: 'asc' };
    });
  }, []);

  // Handle search input
  const handleSearch = useCallback((search: string) => {
    setFilterConfig(prev => ({ ...prev, search }));
  }, []);

  // Handle status filter
  const handleStatusFilter = useCallback((status: ProjectStatus | 'All') => {
    setFilterConfig(prev => ({ ...prev, status }));
  }, []);

  return {
    projects,
    filteredProjects,
    isLoading,
    error,
    sortConfig,
    filterConfig,
    setSortConfig,
    setFilterConfig,
    handleSort,
    handleSearch,
    handleStatusFilter
  };
};
