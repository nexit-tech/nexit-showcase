// hooks/useTheme.ts
'use client'

import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // 1. Verifica se já tem algo salvo
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    
    // 2. Se tiver, usa. Se não, assume dark.
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    
    // Atualiza estado
    setTheme(newTheme)
    
    // Atualiza HTML (para o CSS pegar)
    document.documentElement.setAttribute('data-theme', newTheme)
    
    // Salva na memória do navegador
    localStorage.setItem('theme', newTheme)
  }

  return { theme, toggleTheme }
}