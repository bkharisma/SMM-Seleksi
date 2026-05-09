export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
return 'system';
}

  const stored = localStorage.getItem(THEME_KEY);

  return (stored === 'light' || stored === 'dark' || stored === 'system') ? stored : 'system';
}

export function setStoredTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme): void {
  const html = document.documentElement;
  html.classList.remove('dark');

  if (theme === 'dark') {
    html.classList.add('dark');
  } else if (theme === 'system') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      html.classList.add('dark');
    }
  }
}

export function toggleTheme(): Theme {
  const current = getStoredTheme();
  const next: Theme = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
  setStoredTheme(next);

  return next;
}

export function getEffectiveTheme(): 'light' | 'dark' {
  const stored = getStoredTheme();

  if (stored === 'light') {
return 'light';
}

  if (stored === 'dark') {
return 'dark';
}

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
