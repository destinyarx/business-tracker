import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ColorTheme = 'light' | 'dark'

interface ThemeStore {
  theme: ColorTheme
  setTheme: (theme: ColorTheme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'negosyo-color-theme',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
