import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Button } from "../ui/button";

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => (
  <div className="flex justify-center mt-10">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <PaginationPrevious />
          </Button>
        </PaginationItem>
        <span className="px-4 py-2 text-gray-700">
          Σελίδα {currentPage} από {totalPages}
        </span>
        <PaginationItem>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <PaginationNext />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
);

export default PaginationControls;
