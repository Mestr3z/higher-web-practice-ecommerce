import ArrowIcon from '../../assets/Arrow.svg?react';
import { getPageNumbers } from '../../lib/pagination';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

const cellBase = 'grid h-9 w-9 place-items-center rounded-md text-sm';
const arrowBase = `${cellBase} border border-border text-text-secondary hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-secondary`;

export function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Пагинация">
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
        className={arrowBase}
      >
        <ArrowIcon className="h-4 w-4" />
      </button>

      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="text-text-secondary px-1">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            aria-current={page === currentPage || undefined}
            className={
              page === currentPage
                ? `${cellBase} bg-accent font-semibold text-white`
                : `${cellBase} border-border text-text hover:border-accent hover:text-accent border`
            }
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
        className={arrowBase}
      >
        <ArrowIcon className="h-4 w-4 rotate-180" />
      </button>
    </nav>
  );
}
