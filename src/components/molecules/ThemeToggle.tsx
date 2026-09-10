'use client'

import Image from 'next/image'
import { useThemeStore } from '@/stores/theme.store'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full border border-[#E3E9E8] bg-white text-[#0C4B47] transition-colors hover:border-[#00BEAA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BEAA] focus-visible:ring-offset-2 dark:border-[#2B4340] dark:bg-[#16292B] dark:text-[#D9E8FF] dark:focus-visible:ring-offset-[#0B1615]',
        className,
      )}
    >
      <Image
        src={isDark ? '/theme-night.svg' : '/theme-day.svg'}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
      />
    </button>
  )
}
