'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/stores/theme.store'

export function ThemeSync() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return null
}
