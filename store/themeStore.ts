import { create } from 'zustand';
import { Appearance } from 'react-native';
import { persist } from "zustand/middleware";

interface ThemeStore {
  isDarkMode: boolean;
  setTheme: (isDark: boolean) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: Appearance.getColorScheme() === 'dark',
  setTheme: (isDark: boolean) => set({ isDarkMode: isDark }),
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));


Appearance.addChangeListener(({ colorScheme }) => {
  useThemeStore.getState().setTheme(colorScheme === 'dark');
});
