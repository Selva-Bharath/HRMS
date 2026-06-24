import React from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import Panel from '../components/Panel';
import Btn from '../components/Btn';
import { theme } from '../data/hrMockData';
import { useState } from 'react';

interface DirectoryTabProps {
  filteredEmps: any[];
  search: string;
  onSearchChange: (val: string) => void;
  onAddEmployee: () => void;
  BASE_URL: string;
}

const DirectoryTab: React.FC<DirectoryTabProps> = ({
  filteredEmps,
  search,
  onSearchChange,
  onAddEmployee,
  BASE_URL
}) => {


const [loadingEmployee, setLoadingEmployee] =
  useState(false);

  const [selectedEmployee, setSelectedEmployee] =
  useState<any>(null);

  const fetchEmployeeDetails = async (employeeId: number) => {
  try {
    setLoadingEmployee(true);

    console.log("BASE_URL =", BASE_URL);
    console.log(
      "URL =",
      `${BASE_URL}/employee-details/${employeeId}`
    );

    const response = await fetch(
      `${BASE_URL}/employee-details/${employeeId}`
    );

    const text = await response.text();

    console.log("Response Text:", text);

    const data = JSON.parse(text);

    setSelectedEmployee(data.employee);

  } catch (error) {
    console.error(error);
  } finally {
    setLoadingEmployee(false);
  }
};
  return (
    <Panel>

      {loadingEmployee && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px"
      }}
    >
      Loading Employee Details...
    </div>
  </div>
)}

      {selectedEmployee && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.55)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      padding: "16px"
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "720px",
        background: "#ffffff",
        borderRadius: "12px",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.25)"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid #e5e7eb",
          background: "#f8f9fa"
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#2c3e50",
            margin: 0
          }}
        >
          Employee Details
        </h2>
        <button
          onClick={() => setSelectedEmployee(null)}
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "6px 10px",
            fontSize: "14px",
            color: "#666",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "18px 20px",
          overflowY: "auto",
          flex: 1
        }}
      >
        {/* Basic Information */}
        <div style={{ marginBottom: "18px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#444",
              marginBottom: "10px",
              textTransform: "uppercase"
            }}
          >
            Basic Information
          </h3>
          
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px"
            }}
          >
            {[
              { label: "Name", value: selectedEmployee.name },
              { label: "Role", value: selectedEmployee.role },
              { label: "Designation", value: selectedEmployee.designation },
              { label: "Manager", value: selectedEmployee.reporting_manager },
              { label: "Shift", value: selectedEmployee.shift }
            ].map((item) => (
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #eee"
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "#888",
                    fontWeight: "600",
                    marginBottom: "3px",
                    textTransform: "uppercase"
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#333",
                    fontWeight: "600"
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary */}
        <div style={{ marginBottom: "18px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#444",
              marginBottom: "10px",
              textTransform: "uppercase"
            }}
          >
            Attendance Summary
          </h3>
          
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px"
            }}
          >
            <div
              style={{
                background: "#e8f5e9",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #c8e6c9"
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#2e7d32",
                  fontWeight: "600",
                  marginBottom: "4px"
                }}
              >
                Present
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1b5e20"
                }}
              >
                {selectedEmployee.present_days || 0}
              </div>
            </div>

            <div
              style={{
                background: "#ffebee",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #ffcdd2"
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#c62828",
                  fontWeight: "600",
                  marginBottom: "4px"
                }}
              >
                Absent
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#b71c1c"
                }}
              >
                {selectedEmployee.absent_days || 0}
              </div>
            </div>

            <div
              style={{
                background: "#fff9c4",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "center",
                border: "1px solid #fff59d"
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#757575",
                  fontWeight: "600",
                  marginBottom: "4px"
                }}
              >
                Leave
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#5d4037"
                }}
              >
                {selectedEmployee.leave_days || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Summary */}
        <div style={{ marginBottom: "18px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#444",
              marginBottom: "10px",
              textTransform: "uppercase"
            }}
          >
            Leave Summary
          </h3>
          
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px"
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #eee",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  color: "#999",
                  fontWeight: "600",
                  marginBottom: "3px"
                }}
              >
                Total
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#666"
                }}
              >
                {selectedEmployee.total_leave_requests || 0}
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #eee",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  color: "#999",
                  fontWeight: "600",
                  marginBottom: "3px"
                }}
              >
                Approved
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#2e7d32"
                }}
              >
                {selectedEmployee.approved_leaves || 0}
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #eee",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  color: "#999",
                  fontWeight: "600",
                  marginBottom: "3px"
                }}
              >
                Rejected
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#c62828"
                }}
              >
                {selectedEmployee.rejected_leaves || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Attendance Table */}
        <div>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#444",
              marginBottom: "10px",
              textTransform: "uppercase"
            }}
          >
            Recent Attendance
          </h3>
          
          <div
            style={{
              border: "1px solid #eee",
              borderRadius: "8px",
              overflow: "hidden"
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px"
              }}
            >
              <thead
                style={{
                  background: "#f8f9fa"
                }}
              >
                <tr>
                  {["Date", "In", "Out", "Status"].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: "10px 8px",
                        textAlign: "left",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#666",
                        borderBottom: "1px solid #eee"
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedEmployee.recent_attendance?.map((att: any, index: number) => (
                  <tr
                    key={index}
                    style={{
                      background: index % 2 === 0 ? "#fff" : "#f8f9fa",
                      borderBottom: "1px solid #eee"
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 8px",
                        color: "#444"
                      }}
                    >
                      {att.date}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        color: "#444"
                      }}
                    >
                      {att.check_in}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        color: "#444"
                      }}
                    >
                      {att.check_out}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px"
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: "600",
                          background: att.status === "Present" 
                            ? "#e8f5e9" 
                            : att.status === "Absent" 
                              ? "#ffebee" 
                              : "#fff9c4",
                          color: att.status === "Present" 
                            ? "#2e7d32" 
                            : att.status === "Absent" 
                              ? "#c62828" 
                              : "#757575"
                        }}
                      >
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.text, margin: "0 0 4px 0" }}>Employee Directory</h1>
          <p style={{ fontSize: 14, color: theme.textMuted, margin: 0 }}>View and manage all employees</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 14px" }}>
            <MagnifyingGlassIcon style={{ width: 18, height: 18, color: theme.textMuted }} />
            <input
              placeholder="Search by name, dept, or role..."
              value={search}
              onChange={(e: any) => onSearchChange(e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, width: 250, color: theme.text }}
            />
          </div>
          <Btn onClick={onAddEmployee}>
            <PlusIcon style={{ width: 14, height: 14 }} /> Add Employee
          </Btn>
        </div>
      </div>

      <div style={{ overflowX: "auto", background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", textAlign: "left", fontSize: 13, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${theme.border}`, color: theme.textMuted, background: theme.surface }}>
              {["Employee", "Role", "Reporting Manager", "Team/Designation","Shift", "Status"].map((h) => (
                <th key={h} style={{ padding: "16px 16px", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEmps.map((emp, index) => (
              <tr
  key={emp.id}
  onClick={() =>
  fetchEmployeeDetails(emp.user_id)
}
  style={{
    cursor: "pointer",
    borderBottom: `1px solid ${theme.border}`,
    background:
      index % 2 === 0
        ? theme.surface2
        : theme.surface,
    transition: "background 0.15s ease"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background =
      "#F0F4FF";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background =
      index % 2 === 0
        ? theme.surface2
        : theme.surface;
  }}
>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1F7A8C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white" }}>
                      {(emp.first_name?.[0] || "E") + (emp.last_name?.[0] || "")}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{emp.first_name} {emp.last_name}</div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>{emp.role || "N/A"}</span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 13, color: theme.textMuted }}>{emp.reporting_manager || "—"}</span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>{emp.designation || "N/A"}</span>
                </td>
                <td style={{ padding: "14px 16px" }}>
  {emp.shift_timing || "-"}
</td>
                <td style={{ padding: "14px 16px" }}>
  {emp.status === "Present" ? (
    <span
      style={{
        background: "#dcfce7",
        color: "#166534",
        padding: "6px 12px",
        borderRadius: 6,
        fontWeight: 600
      }}
    >
      Present
    </span>
  ) : (
    <span
      style={{
        background: "#fee2e2",
        color: "#991b1b",
        padding: "6px 12px",
        borderRadius: 6,
        fontWeight: 600
      }}
    >
      Absent
    </span>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEmps.length === 0 && (
          <div style={{ textAlign: "center", padding: "50px 20px", color: theme.textMuted }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 6 }}>No employees found</div>
            <div style={{ fontSize: 13, marginBottom: 16 }}>Try adjusting your search terms</div>
          </div>
        )}
      </div>
      {filteredEmps.length > 0 && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: theme.textMuted }}>
          <span>Showing <strong style={{ color: theme.text }}>{filteredEmps.length}</strong> {filteredEmps.length === 1 ? "employee" : "employees"}</span>
          <span>Last updated: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      )}
    </Panel>
  );
};



export default DirectoryTab;