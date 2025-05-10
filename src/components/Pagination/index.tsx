import { getPageNumbers } from "@/utils/getPageNumbers";
import { GrNext, GrPrevious } from "react-icons/gr";

interface IProps {
  changePageFromPagination: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

const Pagination = ({
  changePageFromPagination,
  currentPage,
  totalPages,
}: IProps) => {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="pagination">
      <button
        onClick={() => changePageFromPagination(Math.max(currentPage - 1, 0))}
        disabled={currentPage === 0}
      >
        <GrPrevious />
      </button>

      {pages.map((page, i) =>
        page === -1 ? (
          <span key={i} className="pagination-dots">
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => changePageFromPagination(page)}
            disabled={page === currentPage}
            style={{
              fontWeight: page === currentPage ? "bold" : "normal",
            }}
          >
            {page + 1}
          </button>
        )
      )}

      <button
        onClick={() =>
          changePageFromPagination(Math.min(currentPage + 1, totalPages - 1))
        }
        disabled={currentPage >= totalPages - 1}
      >
        <GrNext />
      </button>
    </div>
  );
};

export default Pagination;
