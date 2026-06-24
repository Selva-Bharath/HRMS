import React from 'react';

interface AvatarProps {
  initials: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ initials, size = 36 }) => {
  const colors = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#3B82F6", "#8B5CF6"];
  const idx = initials.charCodeAt(0) % colors.length;
  const c = colors[idx];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${c}18`, border: `2px solid ${c}66`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: c,
    }}>
      {initials}
    </div>
  );
};

export default Avatar;