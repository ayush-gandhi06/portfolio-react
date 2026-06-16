import React from "react";
import { useTheme } from "./ThemeContext";
import "../styles/themeToggle.css";

const SunIcon = () => (
  <svg
    className="theme-toggle__icon theme-toggle__icon--sun"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm-.83 6.16H2v2h3.93v-2zm2.92 8.24l-1.79 1.8 1.41 1.41 1.8-1.79-1.42-1.42zm8.24-2.92V22h2v-3.93h-2zm6.16-2.92l1.8-1.79-1.41-1.41-1.79 1.8 1.4 1.4zM18.1 5.1l1.79-1.8-1.41-1.41-1.8 1.79L18.1 5.1zM12 4.07V2h-2v2.07h2zm0 15.86V22h2v-2.07h-2zM19.93 12H22v-2h-2.07v2zM4.07 12H2v2h2.07v-2zM12 17.93A5.93 5.93 0 116.07 12 5.94 5.94 0 0112 17.93zm0-2A3.93 3.93 0 108.07 12 3.94 3.94 0 0012 15.93z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="theme-toggle__icon theme-toggle__icon--moon"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
    />
  </svg>
);

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb">
          {isDark ? <MoonIcon /> : <SunIcon />}
        </span>
      </span>
      <span className="theme-toggle__label">
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}
