import { useEffect, useState } from "react";
import { cancelBooking } from "../../../services/meetingRoomService";

interface BookingTableProps {
  bookings: any[];
  onRefresh: () => void;
}

const BookingTable = ({ bookings, onRefresh }: BookingTableProps) => {

    const handleCancel = async (id: number) => {
  try {
    await cancelBooking(id);

    alert("Booking Cancelled");

    onRefresh();   // ✅ CORRECT
  } catch (error) {
    console.error(error);
    alert("Failed to cancel booking");
  }
};
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({
      show: true,
      type,
      message,
    });
  };


  const getStatusStyles = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
      case "confirmed":
      case "completed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      case "in progress":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const canCancel = (status: string) => {
    const normalized = (status || "").toLowerCase();
    return normalized === "confirmed" || normalized === "approved";
  };

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-800">Bookings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Track meeting room reservations and schedule activity.
          </p>
        </div>

        <div className="p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <svg
              className="h-8 w-8 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            No bookings found
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            New booking entries will appear here once meetings are scheduled.
          </p>
        </div>
      </div>
    );
  }

  

  return (
    <>
      {toast.show && (
        <div className="fixed right-5 top-5 z-[100]">
          <div
            className={`flex min-w-[320px] items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                toast.type === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {toast.type === "success" ? (
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">
                {toast.type === "success" ? "Success" : "Error"}
              </p>
              <p className="text-sm opacity-90">{toast.message}</p>
            </div>

            <button
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className="text-lg leading-none opacity-60 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Bookings</h2>
            <p className="mt-1 text-sm text-slate-500">
              Track meeting room reservations and daily schedule status.
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            Total: {bookings.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Meeting
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Organizer
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Start
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  End
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking: any) => (
                <tr
                  key={booking.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {booking.meeting_title || "-"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Booking ID: {booking.id}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {booking.organizer_name || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {booking.meeting_date || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {booking.start_time || "-"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {booking.end_time || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                        booking.status
                      )}`}
                    >
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-current opacity-70"></span>
                      {booking.status || "Unknown"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {canCancel(booking.status) ? (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                Cancel Booking
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Are you sure you want to cancel this booking?
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Meeting</p>
                <p className="font-semibold text-slate-800">
                  {selectedBooking.meeting_title || "-"}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Organizer</p>
                    <p className="font-medium text-slate-700">
                      {selectedBooking.organizer_name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Date</p>
                    <p className="font-medium text-slate-700">
                      {selectedBooking.meeting_date || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                onClick={() => setSelectedBooking(null)}
                disabled={isCancelling}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Keep Booking
              </button>

              <button
  onClick={() => handleCancel(selectedBooking.id)}
  disabled={isCancelling}
  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isCancelling ? "Cancelling..." : "Yes, Cancel"}
</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingTable;