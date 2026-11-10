"use client";

import { useEffect, useState } from "react";
import { themeStorageKey as storageKey } from "@/lib/theme-mode";

type Mode = "light" | "dark" | "system";
const options: Array<{ mode: Mode; label: string; icon: React.ReactNode }> = [
  { mode: "light", label: "Light theme", icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> },
  { mode: "dark", label: "Dark theme", icon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /> },
  { mode: "system", label: "System theme", icon: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></> }
];

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read the saved choice once after hydration
      if (saved === "light" || saved === "dark") setMode(saved);
    } catch { /* storage unavailable: keep the system theme */ }
  }, []);

  function choose(next: Mode) {
    setMode(next);
    if (next === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", next);
    try {
      if (next === "system") localStorage.removeItem(storageKey); else localStorage.setItem(storageKey, next);
    } catch { /* storage unavailable: the choice lasts for this page view */ }
  }

  return <div className="theme-toggle" role="group" aria-label="Colour theme">
    {options.map((option) => <button key={option.mode} type="button" aria-label={option.label} aria-pressed={mode === option.mode} title={option.label} onClick={() => choose(option.mode)}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{option.icon}</svg>
    </button>)}
  </div>;
}

