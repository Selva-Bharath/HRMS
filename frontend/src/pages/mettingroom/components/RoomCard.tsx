interface RoomCardProps {
  rooms: any[];
}

const RoomCard = ({ rooms }: RoomCardProps) => {
  const getStatusStyles = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-700 border border-green-200";
      case "booked":
        return "bg-red-100 text-red-700 border border-red-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  if (!Array.isArray(rooms) || rooms.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
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
              d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1v-9.5z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-slate-800">No rooms available</h3>
        <p className="mt-2 text-sm text-slate-500">
          Create a new meeting room to start managing bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {rooms.map((room: any) => (
        <div
          key={room.id}
          className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {room.room_name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Meeting space overview
              </p>
            </div>

            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                room.status
              )}`}
            >
              <span className="mr-1.5 h-2 w-2 rounded-full bg-current opacity-70"></span>
              {room.status || "Unknown"}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {room.location || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 21h18M6 18h12M8 18V7h3v11M13 18V3h3v15"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Floor
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {room.floor || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5V4H2v16h5M9 20h6M12 17v3M7 8h10M7 12h6"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Capacity
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {room.capacity || 0} People
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-400">Room ID: {room.id}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomCard;