'use client'

import { useTheme } from '@/hooks/useTheme'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className={styles.toggleBtn}
      onClick={toggleTheme}
      aria-label={`Alternar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
      title={`Alternar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      {/* Ícone Lua (Visível no modo Dark) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${styles.icon} ${styles.moon} ${theme === 'light' ? styles.hidden : ''}`}
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>

      {/* Ícone Sol (Visível no modo Light) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${styles.icon} ${styles.sun} ${theme === 'dark' ? styles.hidden : ''}`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    </button>
  )
}