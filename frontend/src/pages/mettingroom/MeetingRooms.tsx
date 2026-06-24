import { useEffect, useState } from "react";
import DashboardCards from "./components/DashboardCards";
import BookingForm from "./components/BookingForm";
import RoomCard from "./components/RoomCard";
import BookingTable from "./components/BookingTable";

import {
  getRooms,
  getBookings,
  createRoom,
} from "../../services/meetingRoomService";

type ToastType = "success" | "error" | "info";

const MeetingRooms = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const [roomForm, setRoomForm] = useState({
    room_name: "",
    location: "",
    floor: "",
    capacity: "",
    room_type: "Conference Room",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data || response);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch rooms", "error");
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response.data || response);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch bookings", "error");
    }
  };

  const handleCreateRoom = async () => {
    if (
      !roomForm.room_name.trim() ||
      !roomForm.location.trim() ||
      !roomForm.floor.trim() ||
      !roomForm.capacity.trim()
    ) {
      showToast("Please fill all room details", "error");
      return;
    }

    try {
      setIsCreatingRoom(true);

      await createRoom({
        ...roomForm,
        capacity: Number(roomForm.capacity),
      });

      setShowRoomModal(false);

      setRoomForm({
        room_name: "",
        location: "",
        floor: "",
        capacity: "",
        room_type: "Conference Room",
      });

      showToast("Room created successfully", "success");
      fetchRooms();
    } catch (error) {
      console.error(error);
      showToast("Failed to create room", "error");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const toastStyles = {
    success: {
      container: "border-green-200 bg-green-50 text-green-800",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    error: {
      container: "border-red-200 bg-red-50 text-red-800",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    info: {
      container: "border-blue-200 bg-blue-50 text-blue-800",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  };

  const currentToastStyle = toastStyles[toast.type];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-[100] animate-in slide-in-from-top-3 duration-300">
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg min-w-[320px] max-w-md ${currentToastStyle.container}`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${currentToastStyle.iconBg}`}
            >
              {toast.type === "success" && (
                <svg
                  className={`h-5 w-5 ${currentToastStyle.iconColor}`}
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
              )}

              {toast.type === "error" && (
                <svg
                  className={`h-5 w-5 ${currentToastStyle.iconColor}`}
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

              {toast.type === "info" && (
                <svg
                  className={`h-5 w-5 ${currentToastStyle.iconColor}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01"
                  />
                </svg>
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">
                {toast.type === "success"
                  ? "Success"
                  : toast.type === "error"
                  ? "Error"
                  : "Info"}
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

      {/* Header */}
      <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Workspace / Meeting Rooms
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">
              Meeting Room Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage rooms, create bookings, and monitor workplace availability.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {(user?.access_level === "admin" || user?.access_level === "hr") && (
              <button
                onClick={() => setShowRoomModal(true)}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                + Create Room
              </button>
            )}

            <button
              onClick={() => setShowBookingModal(true)}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              + Create Booking
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
          <DashboardCards />
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
          <RoomCard rooms={rooms} />
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
          <BookingTable
  bookings={bookings}
  onRefresh={fetchBookings}
/>
        </div>
      </div>

      {/* Create Room Modal */}
      {showRoomModal &&
        (user?.access_level === "admin" || user?.access_level === "hr") && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Create Meeting Room
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add a new room to your workspace inventory.
                  </p>
                </div>

                <button
                  onClick={() => setShowRoomModal(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                     Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={roomForm.room_name}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        room_name: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={roomForm.location}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        location: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Floor
                  </label>
                  <input
                    type="text"
                    placeholder="Enter floor"
                    value={roomForm.floor}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        floor: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="Enter capacity"
                    value={roomForm.capacity}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        capacity: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Room Type
                  </label>
                  <select
                    value={roomForm.room_type}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        room_type: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white"
                  >
                    <option>Conference Room</option>
                    <option>Board Room</option>
                    <option>Training Room</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateRoom}
                  disabled={isCreatingRoom}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingRoom ? "Saving..." : "Save Room"}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Create Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Create Booking
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Schedule and manage a room reservation.
                </p>
              </div>

              <button
                onClick={() => setShowBookingModal(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <BookingForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRooms;