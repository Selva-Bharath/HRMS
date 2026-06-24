import { useEffect, useState } from "react";
import { getDashboardStats } from "../../../services/meetingRoomService";

const DashboardCards = () => {

  const [stats, setStats] = useState({
    total_rooms: 0,
    available_rooms: 0,
    booked_today: 0,
    pending: 0,
    utilization: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();

      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cards = [
    {
      title: "Total Rooms",
      value: stats.total_rooms,
      color: "text-slate-800",
    },
    {
      title: "Available",
      value: stats.available_rooms,
      color: "text-green-600",
    },
    {
      title: "Booked Today",
      value: stats.booked_today,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      color: "text-amber-600",
    },
    {
      title: "Utilization",
      value: `${stats.utilization}%`,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">
            {item.title}
          </p>

          <h2
            className={`mt-2 text-3xl font-bold ${item.color}`}
          >
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;