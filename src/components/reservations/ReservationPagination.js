import { Button } from "../ui/button";

const ReservationPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  // Αν δεν υπάρχει ανάγκη για pagination, μην εμφανίζεις τίποτα
  if (totalItems <= itemsPerPage || totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-6 text-base sm:text-base text-gray-700">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ⬅ Προηγούμενη
      </Button>

      <span>
        Σελίδα <strong>{currentPage}</strong> από <strong>{totalPages}</strong>
      </span>

      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Επόμενη ➡
      </Button>
    </div>
  );
};

export default ReservationPagination;
