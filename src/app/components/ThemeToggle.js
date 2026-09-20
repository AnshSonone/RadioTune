'use client';

import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {

  const [isLight, setIsLight] = useState(true)

  useEffect(() => {
      const savedTheme = window.localStorage.getItem('radiotune-theme');
      const shouldUseLight = savedTheme !== 'dark';
      document.documentElement.dataset.theme = shouldUseLight ? 'light' : 'dark';
      const frameId = window.requestAnimationFrame(() => setIsLight(shouldUseLight));
      return () => window.cancelAnimationFrame(frameId);
    }, []);
  
    function toggleTheme() {
      const nextIsLight = !isLight;
      setIsLight(nextIsLight);
      document.documentElement.dataset.theme = nextIsLight ? 'light' : 'dark';
      window.localStorage.setItem('radiotune-theme', nextIsLight ? 'light' : 'dark');
    }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={toggleTheme}
      className={`theme-toggle ${isLight ? 'is-light' : ''}`}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-icon theme-toggle-sun" aria-hidden="true">
          <Sun size={11} strokeWidth={2.5} className='text-black'/>
        </span>
        <span className="theme-toggle-icon theme-toggle-moon" aria-hidden="true">
          <Moon size={11} strokeWidth={2.5} />
        </span>
        <span className="theme-toggle-thumb" />
      </span>
    </button>
  );
}