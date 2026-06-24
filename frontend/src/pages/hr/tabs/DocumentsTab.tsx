import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Panel from '../components/Panel';
import { theme, HR_LETTERS } from '../data/hrMockData';

const DOCS = [
  "Corporate Policy Handbook v2026.pdf",
  "Employee Onboarding Pack.zip",
  "Leave Management Policy v3.pdf",
  "Code of Conduct 2026.pdf",
  "Salary Structure Template.xlsx",
  "Q2 Performance Review Template.docx",
];

const DocumentsTab: React.FC = () => {
  return (
    <Panel>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>HR Documents & Templates</div>
      <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 20 }}>Download policies, templates, and corporate letters</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DOCS.map((doc, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: theme.surface2, borderRadius: 10, border: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, background: `${theme.accent}18`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DocumentTextIcon style={{ width: 20, height: 20, color: theme.accent }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{doc}</div>
                <div style={{ fontSize: 11, color: theme.textMuted }}>HR Department</div>
              </div>
            </div>
            <button
              style={{ background: theme.accent, color: "#fff", padding: "8px 16px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none" }}
              onClick={() => alert(`Downloading ${doc}...`)}
            >
              Download
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${theme.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>HR Letter Generator</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {HR_LETTERS.map((letter, i) => (
            <button
              key={i}
              onClick={() => alert(`Generating ${letter}...`)}
              style={{ padding: 14, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, cursor: "pointer", textAlign: "center", fontSize: 12, fontWeight: 600 }}
            >
              📄 {letter}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
};

export default DocumentsTab;