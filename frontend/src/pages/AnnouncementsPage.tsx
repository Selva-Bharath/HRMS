import React, { useState, useEffect } from "react";
import { socket } from "../socket";

const AnnouncementsPage = () => {
  const [title, setTitle] = useState("");
  const [targetRole, setTargetRole] = useState("all");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canSendAnnouncement =
    user.access_level === "admin" || user.access_level === "hr";

  useEffect(() => {
    fetchAnnouncements();
    socket.on("receive_announcement", (newAnnouncement) => {
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    });
    return () => {
      socket.off("receive_announcement");
    };
  }, []);

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    setIsLoading(true);
    socket.emit("send_announcement", {
      sender_name: user.first_name || "HR Admin",
      title,
      target_role: targetRole,
      message,
    });
    setTimeout(() => {
      setShowSuccess(true);
      setTitle("");
      setMessage("");
      setTargetRole("all");
      setIsLoading(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 500);
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(
        "/api/communications/announcements",
      );
      const data = await response.json();
      if (data.success && data.announcements) {
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const t = item.title || "";
    const m = item.message || "";
    const role = item.target_role || "all";
    const matchesSearch =
      t.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    if (role === "employee")
      return { label: "Employees", bg: "#DCFCE7", color: "#15803D" };
    if (role === "manager")
      return { label: "Managers", bg: "#DBEAFE", color: "#1D4ED8" };
    return { label: "Everyone", bg: "#F3E8FF", color: "#7E22CE" };
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + "Z").toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .ann-root {
          min-height: 100vh;
          background: #F1F5F9;
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
          padding: 32px 24px;
        }

        /* ── PAGE HEADER ── */
        .ann-page-header {
          margin-bottom: 28px;
        }
        .ann-page-title {
          font-size: 26px;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.4px;
          margin: 0 0 4px 0;
        }
        .ann-page-sub {
          font-size: 14px;
          color: #64748B;
          margin: 0;
        }

        /* ── SUCCESS TOAST ── */
        .ann-toast {
          position: fixed;
          top: 20px;
          right: 24px;
          background: #0F172A;
          color: #fff;
          padding: 14px 22px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 8px 30px rgba(0,0,0,0.18);
          z-index: 9999;
          animation: slideIn 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ann-toast-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22C55E;
          flex-shrink: 0;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── TWO-COLUMN LAYOUT ── */
        .ann-grid {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .ann-grid { grid-template-columns: 1fr; }
        }

        /* ── CARD ── */
        .ann-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          overflow: hidden;
        }
        .ann-card-header {
          padding: 20px 24px 18px;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .ann-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }
        .ann-card-body {
          padding: 24px;
        }

        /* ── COMPOSE FORM ── */
        .ann-form-group {
          margin-bottom: 18px;
        }
        .ann-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .ann-input,
        .ann-select,
        .ann-textarea {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 14px;
          color: #0F172A;
          background: #F8FAFC;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: inherit;
        }
        .ann-input:focus,
        .ann-select:focus,
        .ann-textarea:focus {
          border-color: #334155;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(51,65,85,0.08);
        }
        .ann-textarea {
          resize: vertical;
          min-height: 140px;
          line-height: 1.6;
        }
        .ann-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 38px;
        }

        /* ── AUDIENCE PILLS ── */
        .ann-audience-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ann-audience-pill {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1.5px solid #E2E8F0;
          font-size: 13px;
          font-weight: 600;
          color: #64748B;
          background: #F8FAFC;
          cursor: pointer;
          transition: all 0.15s;
        }
        .ann-audience-pill:hover {
          border-color: #334155;
          color: #0F172A;
        }
        .ann-audience-pill.active {
          background: #0F172A;
          border-color: #0F172A;
          color: #fff;
        }

        /* ── SEND BUTTON ── */
        .ann-btn {
          width: 100%;
          padding: 13px;
          background: #0F172A;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          letter-spacing: 0.01em;
          margin-top: 4px;
        }
        .ann-btn:hover:not(:disabled) {
          background: #1E293B;
        }
        .ann-btn:active:not(:disabled) {
          transform: scale(0.99);
        }
        .ann-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ── CHAR COUNT ── */
        .ann-char {
          font-size: 11px;
          color: #94A3B8;
          text-align: right;
          margin-top: 5px;
        }

        /* ── SEARCH / FILTER BAR ── */
        .ann-toolbar {
          display: flex;
          gap: 10px;
          padding: 16px 24px;
          border-bottom: 1px solid #F1F5F9;
        }
        .ann-search-wrap {
          flex: 1;
          position: relative;
        }
        .ann-search-input {
          width: 100%;
          padding: 9px 14px 9px 14px;
          border: 1.5px solid #E2E8F0;
          border-radius: 8px;
          font-size: 13px;
          color: #0F172A;
          background: #F8FAFC;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }
        .ann-search-input:focus {
          border-color: #334155;
          background: #fff;
        }
        .ann-filter-select {
          padding: 9px 36px 9px 12px;
          border: 1.5px solid #E2E8F0;
          border-radius: 8px;
          font-size: 13px;
          color: #64748B;
          background: #F8FAFC;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .ann-filter-select:focus {
          border-color: #334155;
          background-color: #fff;
        }

        /* ── COUNT BADGE ── */
        .ann-count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
          background: #F1F5F9;
          color: #475569;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
        }

        /* ── ANNOUNCEMENT LIST ── */
        .ann-list {
          padding: 16px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: calc(100vh - 220px);
          overflow-y: auto;
        }
        .ann-list::-webkit-scrollbar {
          width: 4px;
        }
        .ann-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .ann-list::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 4px;
        }

        /* ── ANNOUNCEMENT ITEM ── */
        .ann-item {
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 18px 20px;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
          position: relative;
        }
        .ann-item::before {
          content: "";
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 3px;
          background: #0F172A;
          border-radius: 0 3px 3px 0;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .ann-item:hover {
          border-color: #CBD5E1;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .ann-item:hover::before {
          opacity: 1;
        }
        .ann-item-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .ann-item-title {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 6px 0;
          line-height: 1.3;
        }
        .ann-role-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.03em;
          white-space: nowrap;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .ann-item-message {
          font-size: 13.5px;
          color: #475569;
          line-height: 1.65;
          margin: 0 0 14px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ann-item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid #F1F5F9;
        }
        .ann-item-by {
          font-size: 12px;
          color: #64748B;
        }
        .ann-item-by strong {
          color: #0F172A;
          font-weight: 600;
        }
        .ann-item-date {
          font-size: 11.5px;
          color: #94A3B8;
          white-space: nowrap;
        }

        /* ── EMPTY STATE ── */
        .ann-empty {
          text-align: center;
          padding: 60px 20px;
          color: #94A3B8;
        }
        .ann-empty-icon {
          width: 56px;
          height: 56px;
          background: #F1F5F9;
          border-radius: 14px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ann-empty-icon span {
          font-size: 24px;
        }
        .ann-empty-title {
          font-size: 15px;
          font-weight: 600;
          color: #475569;
          margin: 0 0 6px 0;
        }
        .ann-empty-sub {
          font-size: 13px;
          color: #94A3B8;
          margin: 0;
        }

        /* ── READ-ONLY NOTICE ── */
        .ann-readonly-card {
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          overflow: hidden;
        }
      `}</style>

      <div className="ann-root">
        {/* Success Toast */}
        {showSuccess && (
          <div className="ann-toast">
            <div className="ann-toast-dot" />
            Announcement sent successfully
          </div>
        )}

        {/* Page Header */}
        <div className="ann-page-header">
          <h1 className="ann-page-title">Announcements</h1>
          <p className="ann-page-sub">
            {canSendAnnouncement
              ? "Compose and broadcast company-wide messages"
              : "Stay up to date with the latest from your team"}
          </p>
        </div>

        <div className="ann-grid">
          {/* ── LEFT: COMPOSE or READ-ONLY CARD ── */}
          {canSendAnnouncement ? (
            <div className="ann-card">
              <div className="ann-card-header">
                <h2 className="ann-card-title">New Announcement</h2>
              </div>
              <div className="ann-card-body">
                {/* Title */}
                <div className="ann-form-group">
                  <label className="ann-label">Title</label>
                  <input
                    className="ann-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Office closed on Friday"
                    maxLength={120}
                  />
                </div>

                {/* Audience */}
                <div className="ann-form-group">
                  <label className="ann-label">Audience</label>
                  <div className="ann-audience-group">
                    {[
                      { value: "all", label: "Everyone" },
                      { value: "employee", label: "Employees" },
                      { value: "manager", label: "Managers" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`ann-audience-pill${targetRole === opt.value ? " active" : ""}`}
                        onClick={() => setTargetRole(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="ann-form-group">
                  <label className="ann-label">Message</label>
                  <textarea
                    className="ann-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your announcement here..."
                    maxLength={2000}
                  />
                  <p className="ann-char">{message.length} / 2000</p>
                </div>

                {/* Send Button */}
                <button
                  className="ann-btn"
                  onClick={handleSend}
                  disabled={isLoading || !title.trim() || !message.trim()}
                >
                  {isLoading ? "Sending..." : "Send Announcement"}
                </button>
              </div>
            </div>
          ) : (
            /* Non-HR: show a simple info panel instead */
            <div className="ann-card">
              <div className="ann-card-header">
                <h2 className="ann-card-title">About Announcements</h2>
              </div>
              <div className="ann-card-body">
                <p
                  style={{
                    fontSize: 14,
                    color: "#64748B",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  This page shows all official announcements from HR and
                  management. New messages appear here in real time. Check back
                  regularly to stay informed about company updates, policy
                  changes, and events.
                </p>
                <div
                  style={{
                    marginTop: 20,
                    padding: "14px 16px",
                    background: "#F8FAFC",
                    borderRadius: 10,
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Total Announcements
                  </p>
                  <p
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: "#0F172A",
                      margin: 0,
                    }}
                  >
                    {announcements.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── RIGHT: ANNOUNCEMENTS LIST ── */}
          <div className="ann-card" style={{ minWidth: 0 }}>
            {/* Card Header */}
            <div className="ann-card-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 className="ann-card-title">All Announcements</h2>
                <span className="ann-count-badge">
                  {filteredAnnouncements.length}
                </span>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="ann-toolbar">
              <div className="ann-search-wrap">
                <input
                  className="ann-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or message..."
                />
              </div>
              <select
                className="ann-filter-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All audiences</option>
                <option value="employee">Employees</option>
                <option value="manager">Managers</option>
              </select>
            </div>

            {/* List */}
            {filteredAnnouncements.length === 0 ? (
              <div className="ann-empty">
                <div className="ann-empty-icon">
                  <span>📭</span>
                </div>
                <p className="ann-empty-title">
                  {searchTerm || filterRole !== "all"
                    ? "No results found"
                    : "No announcements yet"}
                </p>
                <p className="ann-empty-sub">
                  {searchTerm || filterRole !== "all"
                    ? "Try adjusting your search or filter"
                    : "Announcements will appear here once posted"}
                </p>
              </div>
            ) : (
              <div className="ann-list">
                {filteredAnnouncements.map((item: any) => {
                  const badge = getRoleBadge(item.target_role);
                  return (
                    <div key={item.id} className="ann-item">
                      <div className="ann-item-top">
                        <div style={{ minWidth: 0 }}>
                          <h3 className="ann-item-title">{item.title}</h3>
                          <span
                            className="ann-role-badge"
                            style={{ background: badge.bg, color: badge.color }}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      <p className="ann-item-message">{item.message}</p>

                      <div className="ann-item-footer">
                        <span className="ann-item-by">
                          Posted by <strong>{item.created_by}</strong>
                        </span>
                        <span className="ann-item-date">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnouncementsPage;
