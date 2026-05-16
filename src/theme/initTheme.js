import { PORTFOLIO_THEME_STORAGE_KEY } from "./themeConstants";

/** Sync theme on <html> before React paint. First visit defaults to dark. */
export function initThemeFromStorageAndPreference() {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  let theme = null;
  try {
    const stored = localStorage.getItem(PORTFOLIO_THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") theme = stored;
  } catch {
    /* private mode etc. */
  }

  /* First visit (no stored choice): default to dark; user toggle still persists via ThemeProvider. */
  if (!theme) {
    theme = "dark";
  }

  document.documentElement.setAttribute("data-theme", theme);
}
