import React, { useEffect, useState } from "react";

interface NotificationPanelProps {
  notifications: any[];
  showNotifications: boolean;
  onToggle: () => void;
  onClearAll: () => void;
  onDismiss: (id: number) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  showNotifications,
  onToggle,
  onClearAll,
  onDismiss,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleBellClick = () => {
    setExpanded(true);
    onToggle();
  };

  useEffect(() => {
    if (showNotifications) {
      const timer = setTimeout(() => {
        setExpanded(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNotifications]);

  return (
    <>
      {/* Bell Button */}
      <div
        className={`fixed top-5 z-[9999] transition-all duration-500 ${
          expanded ? "right-5" : "-right-7"
        }`}
      >
        <button
          onClick={handleBellClick}
          className="relative bg-white rounded-full p-4 shadow-xl border border-gray-200 hover:scale-105 transition-all"
        >
          <span className="text-2xl">🔔</span>

          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="fixed top-20 right-5 z-[9998] w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">

          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg">
              Notifications
            </h3>

            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-red-600 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Empty State */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-5xl mb-3">
                📭
              </div>

              <h4 className="font-semibold">
                No Notifications
              </h4>

              <p className="text-gray-500 text-sm mt-1">
                You're all clear for now.
              </p>
            </div>
          ) : (
            <div className="max-h-[450px] overflow-y-auto">

              {notifications.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 border-b hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between">

                    <div className="flex-1">

                      <h4 className="font-semibold text-gray-800">
                        {item.title}
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        {item.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        {item.timestamp
                          ? new Date(
                              item.timestamp
                            ).toLocaleString()
                          : "Just now"}
                      </p>

                    </div>

                    <button
                      onClick={() => onDismiss(item.id)}
                      className="text-red-500 ml-3"
                    >
                      ✕
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default NotificationPanel;