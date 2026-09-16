'use client';

import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ isLight, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={onToggle}
      className={`theme-toggle ${isLight ? 'is-light' : ''}`}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-icon theme-toggle-sun" aria-hidden="true">
          <Sun size={11} strokeWidth={2.5} />
        </span>
        <span className="theme-toggle-icon theme-toggle-moon" aria-hidden="true">
          <Moon size={11} strokeWidth={2.5} />
        </span>
        <span className="theme-toggle-thumb" />
      </span>
    </button>
  );
}