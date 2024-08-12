import React from "react";

interface PaginateProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalBids: number;
  PAGE_SIZE: number;
}

const Paginate = ({
  currentPage,
  setCurrentPage,
  totalBids,
  PAGE_SIZE,
}: PaginateProps) => {
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="mt-4 flex justify-center gap-4 md:gap-8 items-center mb-4">
      {currentPage === 1 ? (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === 1 ? "bg-purple-900" : ""
            }`}
          >
            1
          </button>
          <button
            onClick={() => handlePageChange(2)}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === 2 ? "bg-purple-900" : ""
            }`}
          >
            2
          </button>
          <span>...</span>
          <button
            onClick={() => handlePageChange(Math.ceil(totalBids / PAGE_SIZE))}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === Math.ceil(totalBids / PAGE_SIZE)
                ? "bg-purple-900"
                : ""
            }`}
          >
            {Math.ceil(totalBids / PAGE_SIZE)}
          </button>
        </>
      ) : currentPage === 2 ? (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === 1  ? "bg-purple-900" : ""
            }`}
          >
            1
          </button>
          <button
            onClick={() => handlePageChange(2)}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === 2 ? "bg-purple-900" : ""
            }`}
          >
            2
          </button>
          <button
            onClick={() => handlePageChange(3)}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === 3 ? "bg-purple-900" : ""
            }`}
          >
            3
          </button>
          <span>...</span>
          <button
            onClick={() => handlePageChange(Math.ceil(totalBids / PAGE_SIZE))}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === Math.ceil(totalBids / PAGE_SIZE)
                ? "bg-purple-900"
                : ""
            }`}
          >
            {Math.ceil(totalBids / PAGE_SIZE)}
          </button>
        </>
      ) : currentPage === Math.ceil(totalBids / PAGE_SIZE) - 1 ? (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === 1 ? "bg-purple-900" : ""
            }`}
          >
            1
          </button>
          <span>...</span>
          <button
            onClick={() =>
              handlePageChange(Math.ceil(totalBids / PAGE_SIZE) - 2)
            }
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === Math.ceil(totalBids / PAGE_SIZE) - 2
                ? "bg-purple-900"
                : ""
            }`}
          >
            {Math.ceil(totalBids / PAGE_SIZE) - 2}
          </button>
          <button
            onClick={() =>
              handlePageChange(Math.ceil(totalBids / PAGE_SIZE) - 1)
            }
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === Math.ceil(totalBids / PAGE_SIZE) - 1
                ? "bg-purple-900"
                : ""
            }`}
          >
            {Math.ceil(totalBids / PAGE_SIZE) - 1}
          </button>
          <button
            onClick={() => handlePageChange(Math.ceil(totalBids / PAGE_SIZE))}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === Math.ceil(totalBids / PAGE_SIZE)
                ? "bg-purple-900"
                : ""
            }`}
          >
            {Math.ceil(totalBids / PAGE_SIZE)}
          </button>
        </>
      ) : currentPage === Math.ceil(totalBids / PAGE_SIZE) ? (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === 1 ? "bg-purple-900" : ""
            }`}
          >
            1
          </button>
          <span>...</span>
          <button
            onClick={() =>
              handlePageChange(Math.ceil(totalBids / PAGE_SIZE) - 2)
            }
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === Math.ceil(totalBids / PAGE_SIZE) - 2
                ? "bg-purple-900"
                : ""
            }`}
          >
            {Math.ceil(totalBids / PAGE_SIZE) - 2}
          </button>
          <button
            onClick={() =>
              handlePageChange(Math.ceil(totalBids / PAGE_SIZE) - 1)
            }
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === Math.ceil(totalBids / PAGE_SIZE) - 1
                ? "bg-purple-900"
                : ""
            }`}
          >
            {Math.ceil(totalBids / PAGE_SIZE) - 1}
          </button>
          <button
            onClick={() => handlePageChange(Math.ceil(totalBids / PAGE_SIZE))}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === Math.ceil(totalBids / PAGE_SIZE)
                ? "bg-purple-900"
                : ""
            }`}
          >
            {Math.ceil(totalBids / PAGE_SIZE)}
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === 1 ? "bg-purple-900" : ""
            }`}
          >
            1
          </button>
          <span>...</span>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-4 py-2 bg-purple-700 text-white rounded`}
          >
            {currentPage - 1}
          </button>
          <button
            onClick={() => handlePageChange(currentPage)}
            className={`px-4 py-2 text-white rounded bg-purple-900`}
          >
            {currentPage}
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-4 py-2 bg-purple-700 text-white rounded`}
          >
            {currentPage + 1}
          </button>
          <span>...</span>
          <button
            onClick={() => handlePageChange(Math.ceil(totalBids / PAGE_SIZE))}
            className={`px-4 py-2 bg-purple-700 text-white rounded ${
                currentPage === Math.ceil(totalBids / PAGE_SIZE)
                ? "bg-purple-900"
                : ""
            }`}
          >
            {Math.ceil(totalBids / PAGE_SIZE)}
          </button>
        </>
      )}
    </div>
  );
};

export default Paginate;
