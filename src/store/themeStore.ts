import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeStore = {
  theme: 'light' | 'dark',
  toggleTheme: () => void,
}

const THEME_STORE_NAME = 'reporadar-theme';

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => {
        return set(state => {
          return {
            theme: state.theme === 'dark' ? 'light' : 'dark',
          };
        });
      },
    }),
    {
      name: THEME_STORE_NAME,
    }
  )
);