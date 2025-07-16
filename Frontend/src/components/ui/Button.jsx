import React from "react";
import { Button as BootstrapButton } from "react-bootstrap";
import "../../index.css";

const Button = ({ className = "", style = {}, children, ...props }) => {
  return (
    <BootstrapButton
      {...props}
      className={`kalam-btn ${className}`}
      style={style}
    >
      {children}
    </BootstrapButton>
  );
};

export default Button;

// Kalam custom button styles
// Add this to index.css or a CSS module:
/*
.kalam-btn {
  background-color: var(--color-accent-primary) !important;
  color: #fff !important;
  border: none !important;
  font-weight: 500;
  transition: background 0.2s;
}
.kalam-btn:hover, .kalam-btn:focus {
  background-color: var(--color-accent-hover) !important;
  color: #fff !important;
}
*/ 