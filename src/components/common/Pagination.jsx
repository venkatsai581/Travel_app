import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";

function Pagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    pages.push(page);
  }

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(
            currentPage - 1
          )
        }
      >
        <ChevronLeft size={16} />
      </button>

      <div className="pagination-pages">
        {pages.map((page) => (
          <button
            type="button"
            key={page}
            className={`pagination-number ${
              page === currentPage
                ? "active"
                : ""
            }`}
            onClick={() =>
              onPageChange(page)
            }
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pagination-button"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(
            currentPage + 1
          )
        }
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default Pagination;