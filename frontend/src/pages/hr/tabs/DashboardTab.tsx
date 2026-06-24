import React, { useState } from 'react';
import Panel from '../components/Panel';
import { theme } from '../data/hrMockData';

interface DashboardTabProps {
  counts: {
    total: number;
    active: number;
    onLeave: number;
    pendingLeaves: number;
  };
  employees: any[];
}

const DashboardTab: React.FC<DashboardTabProps> = ({ counts, employees }) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const statCards = [
    { label: "Total Employees", value: counts.total, sub: "All departments" },
    { label: "Active Today", value: counts.active, sub: "Working today" },
    { label: "On Leave", value: counts.onLeave, sub: "Away from work" },
    { label: "Pending Leaves", value: counts.pendingLeaves, sub: "Need approval" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 24 }}>
        {statCards.map((card) => (
          <Panel key={card.label} style={{ padding: 24, borderLeft: "4px solid #46494C", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {card.label}
            </div>
            <div style={{ fontSize: 38, fontWeight: 800, color: "#46494C", marginTop: 12 }}>
              {card.value}
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#94A3B8" }}>{card.sub}</div>
          </Panel>
        ))}
      </div>

      {/* Team Overview */}
      <Panel>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: theme.text, display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Team Overview
        </div>

        {[...new Set(employees.map((emp) => emp.designation))].filter(Boolean).map((team: any) => {
          const teamEmployees = employees.filter((emp) => emp.designation === team);
          const empCount = teamEmployees.length;
          const totalTeamSalary = teamEmployees.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);
          const isActive = selectedTeam === team;

          return (
            <div key={team}>
              <div
                onClick={() => setSelectedTeam(isActive ? null : team)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 18px",
                  background: isActive ? "#4362EE08" : theme.surface2,
                  border: isActive ? "2px solid #4362EE" : "1px solid #E5E7EB",
                  borderRadius: 14, marginBottom: 12, cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isActive ? "0 2px 8px rgba(67,98,234,0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#1F7A8C", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>
                    {team.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: theme.text }}>{team}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{empCount} {empCount === 1 ? "Member" : "Members"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ background: "#4362EE15", color: "#4362EE", padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                    {empCount}
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive ? "#4362EE" : theme.textMuted} strokeWidth="2"
                    style={{ transition: "transform 0.2s ease", transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {isActive && (
                <div style={{ marginBottom: 20, padding: "16px 18px", background: theme.surface2, borderRadius: 12, border: "1px solid #E5E7EB", animation: "fadeIn 0.3s ease" }}>
                  <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                    <span style={{ background: "#1F7A8C", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                      Members: {empCount}
                    </span>
                    <span style={{ background: "#16A34A", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                      Total Salary: ₹{totalTeamSalary.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                      <thead>
                        <tr style={{ background: "#F9FAFB", borderBottom: "2px solid #E5E7EB" }}>
                          {["Employee Name", "Role", "Reporting Manager", "Salary"].map((h) => (
                            <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: theme.text, fontSize: 13 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {teamEmployees.map((emp, idx) => (
                          <tr key={emp.id} style={{ borderBottom: idx !== teamEmployees.length - 1 ? "1px solid #F3F4F6" : "none", background: idx % 2 === 0 ? "#fff" : theme.surface2 }}>
                            <td style={{ padding: "12px 14px", color: theme.text }}>{emp.first_name} {emp.last_name}</td>
                            <td style={{ padding: "12px 14px", color: theme.text }}>{emp.role}</td>
                            <td style={{ padding: "12px 14px", color: theme.text }}>{emp.reporting_manager}</td>
                            <td style={{ padding: "12px 14px", color: theme.text, fontWeight: 500 }}>₹{Number(emp.salary || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </Panel>
    </div>
  );
};

export default DashboardTab;