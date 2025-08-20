// components/owner/ReservationManagement.jsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Table, TableHead, TableRow, TableCell, TableBody } from "../ui/table";
import { Badge } from "../ui/badge";
import { Check, XCircle, Calendar as CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

import {
  useOwnerFilteredReservations,
  useOwnerConfirmReservation,
  useOwnerCompleteReservation,
  useOwnerCancelReservation,
} from "../../hooks/customer/useReservations";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";

const STATUS_OPTIONS = [
  { value: "pending", label: "Αναμονή" },
  { value: "confirmed", label: "Εγκεκριμένες" },
  { value: "completed", label: "Ολοκληρωμένες" },
  { value: "cancelled", label: "Ακυρωμένες" },
];

const renderBadge = (status) => {
  const cfg =
    {
      confirmed: { text: "✅ Εγκεκριμένη", className: "bg-blue-500 text-white" },
      pending: { text: "⏳ Αναμονή", className: "bg-yellow-500 text-black" },
      completed: { text: "🏁 Ολοκληρωμένη", className: "bg-green-500 text-white" },
      cancelled: { text: "❌ Ακυρωμένη", className: "bg-red-500 text-white" },
    }[status] || { text: "Άγνωστο", className: "bg-gray-500 text-white" };
  return (
    <Badge className={`text-md px-3 py-1.5 font-semibold rounded-md ${cfg.className}`}>
      {cfg.text}
    </Badge>
  );
};

const safeDate = (d) => {
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "—";
    return format(dt, "dd/MM/yyyy");
  } catch {
    return "—";
  }
};

const ReservationManagement = () => {
  const qc = useQueryClient();

  // Filters & pagination
  const [statusFilter, setStatusFilter] = useState(""); // "" means no filter
  const [dateFilter, setDateFilter] = useState("");     // yyyy-MM-dd or ""
  const selectedDate = useMemo(
    () => (dateFilter ? new Date(dateFilter) : null),
    [dateFilter]
  );

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch owner reservations
  const { data, isLoading, isFetching, error } = useOwnerFilteredReservations(
    dateFilter || undefined,
    statusFilter || undefined,
    page,
    pageSize
  );

  const reservations = useMemo(() => data?.reservations ?? [], [data]);
  const pagination = data?.Pagination;

  // Owner actions
  const { mutate: confirmReservation, isPending: confirming } = useOwnerConfirmReservation();
  const { mutate: completeReservation, isPending: completing } = useOwnerCompleteReservation();
  const { mutate: cancelReservation, isPending: canceling } = useOwnerCancelReservation();
  const patching = confirming || completing || canceling;

  // Dialog state
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [actionType, setActionType] = useState(""); // 'approve' | 'complete' | 'cancel'
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (error) {
      const msg = error?.response?.data?.message || "Σφάλμα φόρτωσης κρατήσεων.";
      toast.error(msg);
    }
  }, [error]);

  // Sort: pending first, then newest date
  const sortedReservations = useMemo(() => {
    const arr = [...reservations];
    return arr.sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      const ad = new Date(a.date);
      const bd = new Date(b.date);
      return bd - ad;
    });
  }, [reservations]);

  const openDialog = (reservation, action) => {
    setSelectedReservation(reservation);
    setActionType(action);
    setCancelReason("");
  };
  const closeDialog = () => {
    setSelectedReservation(null);
    setActionType("");
    setCancelReason("");
  };

  const canApprove = (s) => s === "pending";
  const canComplete = (s) => s === "confirmed";
  const canCancel = (s) => s === "pending" || s === "confirmed";

  const handleConfirm = () => {
    if (!selectedReservation || !actionType) return;

    if (actionType === "approve") {
      confirmReservation(selectedReservation.id, {
        onSuccess: () => {
          toast.success("Η κράτηση επιβεβαιώθηκε.");
          qc.invalidateQueries({ queryKey: ["ownerOverview"] });
          closeDialog();
        },
        onError: (err) => {
          const msg = err?.response?.data?.message || "Αποτυχία επιβεβαίωσης.";
          toast.error(msg);
        },
      });
      return;
    }

    if (actionType === "complete") {
      completeReservation(selectedReservation.id, {
        onSuccess: () => {
          toast.success("Η κράτηση ολοκληρώθηκε.");
          qc.invalidateQueries({ queryKey: ["ownerOverview"] });
          closeDialog();
        },
        onError: (err) => {
          const msg = err?.response?.data?.message || "Αποτυχία ολοκλήρωσης.";
          toast.error(msg);
        },
      });
      return;
    }

    if (actionType === "cancel") {
      if (!cancelReason.trim()) {
        toast.error("Απαιτείται λόγος ακύρωσης.");
        return;
      }
      cancelReservation(
        { reservationId: selectedReservation.id, reason: cancelReason.trim() },
        {
          onSuccess: () => {
            toast.success("Η κράτηση ακυρώθηκε.");
            qc.invalidateQueries({ queryKey: ["ownerOverview"] });
            closeDialog();
          },
          onError: (err) => {
            const msg = err?.response?.data?.message || "Αποτυχία ακύρωσης.";
            toast.error(msg);
          },
        }
      );
    }
  };

  return (
    <section className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end gap-3">
        {/* Status (shadcn Select) */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Κατάσταση</label>
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter || undefined} // undefined shows placeholder
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Όλες" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {statusFilter && (
              <Button
                variant="ghost"
                onClick={() => {
                  setStatusFilter("");
                  setPage(1);
                }}
              >
                Καθαρισμός
              </Button>
            )}
          </div>
        </div>

        {/* Date (shadcn Popover + Calendar) */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Ημερομηνία</label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[220px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Επιλέξτε ημερομηνία"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(d) => {
                    if (!d) return;
                    const iso = format(d, "yyyy-MM-dd");
                    setDateFilter(iso);
                    setPage(1);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {dateFilter && (
              <Button
                variant="ghost"
                onClick={() => {
                  setDateFilter("");
                  setPage(1);
                }}
              >
                Καθαρισμός
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1" />

        <div className="text-sm text-gray-600">
          {isFetching ? "Φόρτωση..." : ""}
          {pagination && !isFetching
            ? `Προβολή ${
                pagination.viewedRecords - pagination.recordsOnCurrentPage + 1
              }–${pagination.viewedRecords} από ${pagination.total}`
            : ""}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto hidden md:block">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell>ID Κράτησης</TableCell>
              <TableCell>Ημερομηνία</TableCell>
              <TableCell>Ώρα</TableCell>
              <TableCell>Άτομα</TableCell>
              <TableCell>Κατάσταση</TableCell>
              <TableCell className="text-right">Ενέργειες</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Φόρτωση...
                </TableCell>
              </TableRow>
            ) : sortedReservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Δεν βρέθηκαν κρατήσεις.
                </TableCell>
              </TableRow>
            ) : (
              sortedReservations.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>#{res.id}</TableCell>
                  <TableCell>{safeDate(res.date)}</TableCell>
                  <TableCell>{res.time}</TableCell>
                  <TableCell>{res.guest_count ?? "—"}</TableCell>
                  <TableCell>{renderBadge(res.status)}</TableCell>
                  <TableCell className="text-right">
                    {canApprove(res.status) && (
                      <>
                        <Button
                          className="bg-blue-500 text-white mr-2"
                          onClick={() => openDialog(res, "approve")}
                          disabled={patching}
                        >
                          <Check className="w-4 h-4 mr-1" /> Έγκριση
                        </Button>
                        <Button
                          className="bg-red-500 text-white"
                          onClick={() => openDialog(res, "cancel")}
                          disabled={patching}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Ακύρωση
                        </Button>
                      </>
                    )}
                    {canComplete(res.status) && (
                      <>
                        <Button
                          className="bg-green-500 text-white mr-2"
                          onClick={() => openDialog(res, "complete")}
                          disabled={patching}
                        >
                          <Check className="w-4 h-4 mr-1" /> Ολοκλήρωση
                        </Button>
                        <Button
                          className="bg-red-500 text-white"
                          onClick={() => openDialog(res, "cancel")}
                          disabled={patching}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Ακύρωση
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {isLoading ? (
          <div className="text-center">Φόρτωση...</div>
        ) : sortedReservations.length === 0 ? (
          <div className="text-center text-gray-500">Δεν βρέθηκαν κρατήσεις.</div>
        ) : (
          sortedReservations.map((res) => (
            <div key={res.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Κράτηση #{res.id}</h3>
              <p className="text-gray-600">
                📅 {safeDate(res.date)} | ⏰ {res.time}
              </p>
              <p className="text-gray-600">👥 {res.guest_count ?? "—"} άτομα</p>
              <div className="mt-2">{renderBadge(res.status)}</div>
              <div className="flex gap-2 mt-4">
                {canApprove(res.status) && (
                  <>
                    <Button
                      className="bg-blue-500 text-white flex-1"
                      onClick={() => openDialog(res, "approve")}
                      disabled={patching}
                    >
                      <Check className="w-4 h-4" /> Έγκριση
                    </Button>
                    <Button
                      className="bg-red-500 text-white flex-1"
                      onClick={() => openDialog(res, "cancel")}
                      disabled={patching}
                    >
                      <XCircle className="w-4 h-4" /> Ακύρωση
                    </Button>
                  </>
                )}
                {canComplete(res.status) && (
                  <>
                    <Button
                      className="bg-green-500 text-white flex-1"
                      onClick={() => openDialog(res, "complete")}
                      disabled={patching}
                    >
                      <Check className="w-4 h-4" /> Ολοκλήρωση
                    </Button>
                    <Button
                      className="bg-red-500 text-white flex-1"
                      onClick={() => openDialog(res, "cancel")}
                      disabled={patching}
                    >
                      <XCircle className="w-4 h-4" /> Ακύρωση
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isFetching}
          >
            Προηγούμενη
          </Button>
          <span className="text-sm text-gray-700">Σελίδα {page}</span>
          <Button
            variant="outline"
            onClick={() => {
              const viewed = pagination.viewedRecords ?? 0;
              const total = pagination.total ?? 0;
              if (viewed < total) setPage((p) => p + 1);
            }}
            disabled={isFetching || (pagination.viewedRecords ?? 0) >= (pagination.total ?? 0)}
          >
            Επόμενη
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Έγκριση Κράτησης"
                : actionType === "complete"
                ? "Ολοκλήρωση Κράτησης"
                : "Ακύρωση Κράτησης"}
            </DialogTitle>
            <DialogDescription>
              Είστε σίγουροι ότι θέλετε να προχωρήσετε σε αυτή την ενέργεια;
            </DialogDescription>
          </DialogHeader>

          {actionType === "cancel" && (
            <div className="mt-2">
              <label className="text-sm font-medium mb-1 block">Λόγος Ακύρωσης</label>
              <textarea
                className="w-full border rounded-md px-3 py-2"
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Π.χ. Μη διαθεσιμότητα τραπεζιού"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Άκυρο
            </Button>
            <Button
              className={actionType === "cancel" ? "bg-red-500 text-white" : "bg-green-500 text-white"}
              onClick={handleConfirm}
              disabled={patching}
            >
              {patching ? "Επεξεργασία..." : "Επιβεβαίωση"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReservationManagement;
