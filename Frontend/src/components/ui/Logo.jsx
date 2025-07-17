import React from "react";

const Logo = ({ size = 32, color = "var(--color-accent-primary)" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    {/* Simple chat bubble SVG icon */}
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="6" width="24" height="16" rx="6" fill={color} />
      <path
        d="M8 22v2a2 2 0 0 0 2 2h12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    <span
      style={{
        fontWeight: 700,
        fontSize: size / 2,
        color: color,
        letterSpacing: 1,
      }}
    >
      Kalam
    </span>
  </div>
);

export default Logo;
