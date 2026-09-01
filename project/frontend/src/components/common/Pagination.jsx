export default function Pagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <div className="pagination">
      <span>{total} total result{total === 1 ? '' : 's'}</span>
      <div className="pages">
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</button>
        {pages.map((p) => (
          <button key={p} className={p === page ? 'active' : ''} onClick={() => onPageChange(p)}>
            {p}
          </button>
        ))}
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </div>
  );
}
