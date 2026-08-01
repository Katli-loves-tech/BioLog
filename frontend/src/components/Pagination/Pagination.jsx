import "./Pagination.css";

const MAX_PAGE_BUTTONS = 4;

/**
 * currentPage: 1-indexed
 * totalItems: total row count across all pages
 * pageSize: rows per page (spec: 6)
 * onPageChange(nextPage)
 */
export default function Pagination({ currentPage, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Window of up to MAX_PAGE_BUTTONS page numbers, centred-ish on currentPage
  let windowStart = Math.max(1, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
  let windowEnd = Math.min(totalPages, windowStart + MAX_PAGE_BUTTONS - 1);
  windowStart = Math.max(1, windowEnd - MAX_PAGE_BUTTONS + 1);
  const pageNumbers = [];
  for (let p = windowStart; p <= windowEnd; p++) pageNumbers.push(p);

  return (
    <div className="pagination">
      <span className="pagination-summary">
        Showing {startItem} to {endItem} of {totalItems} entries
      </span>
      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-arrow"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          &lsaquo;
        </button>
        {pageNumbers.map((p) => (
          <button
            key={p}
            type="button"
            className={`pagination-page ${p === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          className="pagination-arrow"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          &rsaquo;
        </button>
      </div>
    </div>
  );
}
