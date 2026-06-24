import React from 'react';
import Panel from '../components/Panel';
import { theme } from '../data/hrMockData';

const SETTINGS = [
  { label: "System Notifications", sub: "Receive dashboard notifications", default: true },
  { label: "Email Alerts for Leave Requests", sub: "Get notified when leaves are requested", default: true },
  { label: "Auto-approve Leaves under 2 days", sub: "Automatically approve short leaves", default: false },
  { label: "Daily Attendance Report", sub: "Receive daily attendance summary", default: true },
  { label: "Performance Review Reminders", sub: "Get reminded before review deadlines", default: true },
];

const SettingsTab: React.FC = () => {
  return (
    <Panel>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>HR Admin Settings</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {SETTINGS.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: theme.surface2, borderRadius: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>{s.sub}</div>
            </div>
            <input type="checkbox" defaultChecked={s.default} style={{ width: 20, height: 20, cursor: "pointer" }} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button style={{ flex: 1, padding: 14, background: theme.accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
            Save All Settings
          </button>
          <button style={{ padding: 14, background: "transparent", color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
            Reset to Defaults
          </button>
        </div>
      </div>
    </Panel>
  );
};

export default SettingsTab;