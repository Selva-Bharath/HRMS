import React from 'react';

interface ChipProps {
  type: string;
}

const Chip: React.FC<ChipProps> = ({ type }) => {
  const status = (type || "").toLowerCase();
  const styles: Record<string, { bg: string; c: string; txt: string }> = {
    active:   { bg: "#D1FAE5", c: "#10B981", txt: "ACTIVE" },
    pending:  { bg: "#FEF3C7", c: "#F59E0B", txt: "PENDING" },
    approved: { bg: "#D1FAE5", c: "#10B981", txt: "APPROVED" },
    rejected: { bg: "#FEE2E2", c: "#EF4444", txt: "REJECTED" },
    present:  { bg: "#D1FAE5", c: "#10B981", txt: "PRESENT" },
    absent:   { bg: "#FEE2E2", c: "#EF4444", txt: "ABSENT" },
    late:     { bg: "#FEF3C7", c: "#F59E0B", txt: "LATE" },
    on_leave: { bg: "#DBEAFE", c: "#3B82F6", txt: "ON LEAVE" },
  };
  const s = styles[status] || styles.absent;
  return (
    <span style={{ background: s.bg, color: s.c, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>
      {s.txt}
    </span>
  );
};

export default Chip;