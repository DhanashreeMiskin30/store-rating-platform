import Pagination from '../common/Pagination';

/**
 * Generic server-driven data table.
 * columns: [{ key, label, sortable }]
 * sort: { sortBy, sortOrder }
 */
export default function DataTable({
  columns,
  rows,
  renderRow,
  sort,
  onSortChange,
  pagination,
  onPageChange,
  loading,
  emptyMessage = 'No records found'
}) {
  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sort.sortBy === col.key) {
      onSortChange({ sortBy: col.key, sortOrder: sort.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange({ sortBy: col.key, sortOrder: 'asc' });
    }
  };

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={() => handleSort(col)}
              >
                {col.label}
                {col.sortable && sort.sortBy === col.key && (
                  <span className="sort-arrow">{sort.sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} className="loading-state">Loading...</td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="empty-state">{emptyMessage}</td>
            </tr>
          )}
          {!loading && rows.map((row) => renderRow(row))}
        </tbody>
      </table>
      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
