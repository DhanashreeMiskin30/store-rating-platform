import { useCallback, useState } from 'react';

/**
 * Manages the query state (filters, sort, page) for a server-driven table.
 */
export default function useTableQuery(defaults = {}) {
  const [filters, setFilters] = useState(defaults.filters || {});
  const [sort, setSort] = useState(defaults.sort || { sortBy: 'name', sortOrder: 'asc' });
  const [page, setPage] = useState(1);
  const limit = defaults.limit || 8;

  const updateFilter = useCallback((key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateSort = useCallback((next) => {
    setPage(1);
    setSort(next);
  }, []);

  const buildParams = useCallback(
    () => ({ ...filters, sortBy: sort.sortBy, sortOrder: sort.sortOrder, page, limit }),
    [filters, sort, page, limit]
  );

  return { filters, updateFilter, sort, updateSort, page, setPage, limit, buildParams };
}
