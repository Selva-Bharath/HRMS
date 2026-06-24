import React from 'react';
import { theme } from '../data/hrMockData';

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  style?: React.CSSProperties;
}

const Btn: React.FC<BtnProps> = ({ children, onClick, variant = "primary", style = {} }) => {
  const bg = variant === "primary" ? "#4C5C68" : "transparent";
  const color = variant === "primary" ? "#fff" : theme.textMuted;
  const border = variant === "primary" ? "none" : `1px solid ${theme.border}`;
  return (
    <button
      onClick={onClick}
      style={{
        background: bg, color, border,
        padding: "10px 16px", borderRadius: 8, fontWeight: 700,
        cursor: "pointer", display: "inline-flex", alignItems: "center",
        gap: 6, fontSize: 12, ...style,
      }}
    >
      {children}
    </button>
  );
};

export default Btn;