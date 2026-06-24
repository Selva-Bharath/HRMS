import React, { useState } from "react";
import Panel from "../components/Panel";
import { theme } from "../data/hrMockData";

// ─── Types ────────────────────────────────────────────────────────────────────

type Rating = "Excellent" | "Good" | "Average" | "Poor";

interface EmployeePerformance {
  id: number;
  name: string;
  department: string;
  designation: string;
  reviewPeriod: string;
  efficiency: number;
  quality: number;
  productivity: number;
  attendance: number;
  rating: Rating;
  goals: string;
  feedback: string;
  reviewer: string;
  reviewDate: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialRecords: EmployeePerformance[] = [
  {
    id: 1,
    name: "Arun Kumar",
    department: "Engineering",
    designation: "Software Developer",
    reviewPeriod: "Q1 2025",
    efficiency: 87,
    quality: 92,
    productivity: 94,
    attendance: 96,
    rating: "Excellent",
    goals: "Complete module delivery before deadline",
    feedback: "Consistently delivers quality work and leads team discussions effectively.",
    reviewer: "Priya Menon",
    reviewDate: "2025-04-01",
  },
  {
    id: 2,
    name: "Divya Nair",
    department: "HR",
    designation: "HR Executive",
    reviewPeriod: "Q1 2025",
    efficiency: 78,
    quality: 85,
    productivity: 80,
    attendance: 90,
    rating: "Good",
    goals: "Reduce onboarding time by 20%",
    feedback: "Good communicator, needs to improve documentation turnaround.",
    reviewer: "Suresh Babu",
    reviewDate: "2025-04-02",
  },
  {
    id: 3,
    name: "Karthik Raj",
    department: "Finance",
    designation: "Accounts Manager",
    reviewPeriod: "Q1 2025",
    efficiency: 65,
    quality: 70,
    productivity: 68,
    attendance: 82,
    rating: "Average",
    goals: "Improve monthly report accuracy",
    feedback: "Needs more attention to detail in audit preparation.",
    reviewer: "Meena Krishnan",
    reviewDate: "2025-04-03",
  },
  {
    id: 4,
    name: "Shalini Venkatesan",
    department: "Operations",
    designation: "Operations Lead",
    reviewPeriod: "Q1 2025",
    efficiency: 91,
    quality: 89,
    productivity: 93,
    attendance: 98,
    rating: "Excellent",
    goals: "Streamline vendor coordination workflow",
    feedback: "Outstanding leadership and proactive problem-solving across departments.",
    reviewer: "Ramesh Iyer",
    reviewDate: "2025-04-04",
  },
];

const ratingColors: Record<Rating, string> = {
  Excellent: "#10B981",
  Good: "#3B82F6",
  Average: "#F59E0B",
  Poor: "#EF4444",
};

const ratingBg: Record<Rating, string> = {
  Excellent: "#D1FAE5",
  Good: "#DBEAFE",
  Average: "#FEF3C7",
  Poor: "#FEE2E2",
};

const metricColors = {
  efficiency: "#1F7A8C",
  quality: "#10B981",
  productivity: "#3B82F6",
  attendance: "#8B5CF6",
};

// ─── Score Bar ────────────────────────────────────────────────────────────────

const ScoreBar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div
      style={{
        flex: 1,
        height: 8,
        background: "#E5E7EB",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: color,
          borderRadius: 4,
          transition: "width 0.4s ease",
        }}
      />
    </div>
    <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32 }}>{value}%</span>
  </div>
);

// ─── Rating Badge ─────────────────────────────────────────────────────────────

const RatingBadge: React.FC<{ rating: Rating }> = ({ rating }) => (
  <span
    style={{
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background: ratingBg[rating],
      color: ratingColors[rating],
      border: `1px solid ${ratingColors[rating]}30`,
    }}
  >
    {rating}
  </span>
);

// ─── View Modal ───────────────────────────────────────────────────────────────

const ViewModal: React.FC<{ record: EmployeePerformance; onClose: () => void }> = ({
  record,
  onClose,
}) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: 32,
        width: 560,
        maxHeight: "85vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{record.name}</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
            {record.designation} — {record.department}
          </div>
        </div>
        <RatingBadge rating={record.rating} />
      </div>

      {/* Score Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          background: "#F9FAFB",
          borderRadius: 10,
          padding: 16,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Efficiency", value: record.efficiency, color: metricColors.efficiency },
          { label: "Quality", value: record.quality, color: metricColors.quality },
          { label: "Productivity", value: record.productivity, color: metricColors.productivity },
          { label: "Attendance", value: record.attendance, color: metricColors.attendance },
        ].map((m) => (
          <div key={m.label}>
            <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{m.label}</div>
            <ScoreBar value={m.value} color={m.color} />
          </div>
        ))}
      </div>

      {/* Details */}
      {[
        { label: "Review Period", value: record.reviewPeriod },
        { label: "Reviewer", value: record.reviewer },
        { label: "Review Date", value: record.reviewDate },
        { label: "Goals", value: record.goals },
        { label: "Feedback", value: record.feedback },
      ].map(({ label, value }) => (
        <div key={label} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 3 }}>
            {label}
          </div>
          <div style={{ fontSize: 13, color: "#374151" }}>{value}</div>
        </div>
      ))}

      <button
        onClick={onClose}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "10px 0",
          background: "#1F7A8C",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  </div>
);

// ─── Add / Edit Form ──────────────────────────────────────────────────────────

const emptyForm = (): Omit<EmployeePerformance, "id"> => ({
  name: "",
  department: "",
  designation: "",
  reviewPeriod: "",
  efficiency: 0,
  quality: 0,
  productivity: 0,
  attendance: 0,
  rating: "Good",
  goals: "",
  feedback: "",
  reviewer: "",
  reviewDate: "",
});

const FormModal: React.FC<{
  initial: Omit<EmployeePerformance, "id"> | EmployeePerformance;
  title: string;
  onSave: (data: Omit<EmployeePerformance, "id"> | EmployeePerformance) => void;
  onClose: () => void;
}> = ({ initial, title, onSave, onClose }) => {
  const [form, setForm] = useState({ ...initial });

  const set = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #D1D5DB",
    borderRadius: 7,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 4,
    display: "block",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 32,
          width: 580,
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 22 }}>
          {title}
        </div>

        {/* Two-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { field: "name", label: "Employee Name" },
            { field: "department", label: "Department" },
            { field: "designation", label: "Designation" },
            { field: "reviewPeriod", label: "Review Period" },
            { field: "reviewer", label: "Reviewer" },
            { field: "reviewDate", label: "Review Date", type: "date" },
          ].map(({ field, label, type }) => (
            <div key={field}>
              <label style={labelStyle}>{label}</label>
              <input
                style={inputStyle}
                type={type || "text"}
                value={(form as Record<string, unknown>)[field] as string}
                onChange={(e) => set(field, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Score sliders */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
          {[
            { field: "efficiency", label: "Efficiency (%)", color: metricColors.efficiency },
            { field: "quality", label: "Quality (%)", color: metricColors.quality },
            { field: "productivity", label: "Productivity (%)", color: metricColors.productivity },
            { field: "attendance", label: "Attendance (%)", color: metricColors.attendance },
          ].map(({ field, label, color }) => (
            <div key={field}>
              <label style={labelStyle}>
                {label}{" "}
                <span style={{ color, fontWeight: 800 }}>
                  {(form as Record<string, unknown>)[field] as number}%
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={(form as Record<string, unknown>)[field] as number}
                onChange={(e) => set(field, Number(e.target.value))}
                style={{ width: "100%", accentColor: color }}
              />
            </div>
          ))}
        </div>

        {/* Rating */}
        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>Rating</label>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={form.rating}
            onChange={(e) => set("rating", e.target.value)}
          >
            {(["Excellent", "Good", "Average", "Poor"] as Rating[]).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Text areas */}
        {[
          { field: "goals", label: "Goals" },
          { field: "feedback", label: "Feedback" },
        ].map(({ field, label }) => (
          <div key={field} style={{ marginTop: 14 }}>
            <label style={labelStyle}>{label}</label>
            <textarea
              style={{ ...inputStyle, height: 70, resize: "vertical" }}
              value={(form as Record<string, unknown>)[field] as string}
              onChange={(e) => set(field, e.target.value)}
            />
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button
            onClick={() => onSave(form)}
            style={{
              flex: 1,
              padding: "10px 0",
              background: "#1F7A8C",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Save
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 0",
              background: "#F3F4F6",
              color: "#374151",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PerformanceTab: React.FC = () => {
  const [records, setRecords] = useState<EmployeePerformance[]>(initialRecords);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<string>("All");
  const [viewRecord, setViewRecord] = useState<EmployeePerformance | null>(null);
  const [editRecord, setEditRecord] = useState<EmployeePerformance | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────────

  const filtered = records.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.designation.toLowerCase().includes(search.toLowerCase());
    const matchRating = filterRating === "All" || r.rating === filterRating;
    return matchSearch && matchRating;
  });

  const avgOf = (key: keyof EmployeePerformance) =>
    records.length
      ? Math.round(
          records.reduce((sum, r) => sum + (r[key] as number), 0) / records.length
        )
      : 0;

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleAdd = (data: Omit<EmployeePerformance, "id"> | EmployeePerformance) => {
    const newId = Math.max(0, ...records.map((r) => r.id)) + 1;
    setRecords((prev) => [...prev, { ...(data as Omit<EmployeePerformance, "id">), id: newId }]);
    setShowAdd(false);
  };

  const handleEdit = (data: Omit<EmployeePerformance, "id"> | EmployeePerformance) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === (data as EmployeePerformance).id ? (data as EmployeePerformance) : r))
    );
    setEditRecord(null);
  };

  const handleDelete = (id: number) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setDeleteId(null);
  };

  // ── Styles ────────────────────────────────────────────────────────────────────

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 12,
    padding: "16px 20px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  };

  const actionBtn = (bg: string, color = "#fff"): React.CSSProperties => ({
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    border: "none",
    background: bg,
    color,
    cursor: "pointer",
  });

  // ── Summary Cards ─────────────────────────────────────────────────────────────

  const summaryCards = [
    { label: "Total Employees", value: records.length, color: "#1F7A8C", icon: "👥" },
    { label: "Avg Efficiency", value: `${avgOf("efficiency")}%`, color: metricColors.efficiency, icon: "⚡" },
    { label: "Avg Quality", value: `${avgOf("quality")}%`, color: metricColors.quality, icon: "✅" },
    { label: "Avg Attendance", value: `${avgOf("attendance")}%`, color: metricColors.attendance, icon: "📅" },
    {
      label: "Excellent Ratings",
      value: records.filter((r) => r.rating === "Excellent").length,
      color: "#10B981",
      icon: "⭐",
    },
  ];

  return (
    <Panel>
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>
            Performance Management
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
            View, add, edit and manage employee performance reviews
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: "9px 18px",
            background: "#1F7A8C",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          + Add Review
        </button>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {summaryCards.map((c) => (
          <div key={c.label} style={{ ...cardStyle, borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 20 }}>{c.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.color, marginTop: 4 }}>
              {c.value}
            </div>
            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* ── Search & Filter ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          placeholder="Search by name, department or designation…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #D1D5DB",
            borderRadius: 7,
            fontSize: 13,
            outline: "none",
          }}
        />
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #D1D5DB",
            borderRadius: 7,
            fontSize: 13,
            outline: "none",
            cursor: "pointer",
            background: "#fff",
          }}
        >
          {["All", "Excellent", "Good", "Average", "Poor"].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #E5E7EB" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {[
                "Employee",
                "Department",
                "Period",
                "Efficiency",
                "Quality",
                "Productivity",
                "Attendance",
                "Rating",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "11px 14px",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: 11,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #E5E7EB",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{ textAlign: "center", padding: 32, color: "#9CA3AF", fontSize: 13 }}
                >
                  No performance records found.
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr
                  key={r.id}
                  style={{
                    background: i % 2 === 0 ? "#fff" : "#FAFAFA",
                    transition: "background 0.15s",
                  }}
                >
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ fontWeight: 700, color: "#111827" }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{r.designation}</div>
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6", color: "#374151" }}>
                    {r.department}
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6", color: "#374151" }}>
                    {r.reviewPeriod}
                  </td>
                  {[
                    { v: r.efficiency, c: metricColors.efficiency },
                    { v: r.quality, c: metricColors.quality },
                    { v: r.productivity, c: metricColors.productivity },
                    { v: r.attendance, c: metricColors.attendance },
                  ].map(({ v, c }, idx) => (
                    <td
                      key={idx}
                      style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6", minWidth: 100 }}
                    >
                      <ScoreBar value={v} color={c} />
                    </td>
                  ))}
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6" }}>
                    <RatingBadge rating={r.rating} />
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {/* View */}
                      <button
                        style={actionBtn("#EFF6FF", "#1D4ED8")}
                        onClick={() => setViewRecord(r)}
                      >
                        View
                      </button>
                      {/* Edit */}
                      <button
                        style={actionBtn("#F0FDF4", "#15803D")}
                        onClick={() => setEditRecord(r)}
                      >
                        Edit
                      </button>
                      {/* Delete */}
                      <button
                        style={actionBtn("#FEF2F2", "#DC2626")}
                        onClick={() => setDeleteId(r.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 10 }}>
        Showing {filtered.length} of {records.length} records
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}

      {viewRecord && (
        <ViewModal record={viewRecord} onClose={() => setViewRecord(null)} />
      )}

      {showAdd && (
        <FormModal
          title="Add Performance Review"
          initial={emptyForm()}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}

      {editRecord && (
        <FormModal
          title="Edit Performance Review"
          initial={editRecord}
          onSave={handleEdit}
          onClose={() => setEditRecord(null)}
        />
      )}

      {/* ── Delete Confirm ───────────────────────────────────────────────────── */}
      {deleteId !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setDeleteId(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 32,
              width: 380,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
              Delete Review?
            </div>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 24 }}>
              This action cannot be undone. The performance record will be permanently removed.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: "#EF4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: "#F3F4F6",
                  color: "#374151",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
};

export default PerformanceTab;