import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

export default function ToggleTheme() {
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);

  return (<>
    {/* Custom Theme Toggle Switch Button Element */}
    <button
      type="button"
      onClick={toggleTheme}
      className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#1e293b] hover:bg-[#253347] border border-slate-800 text-slate-400 hover:text-slate-200 shadow-sm focus:outline-none transition group relative overflow-hidden"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Sun Icon Vector: Rotates, scales down, and disappears downward if dark mode is selected */}
      <Sun
        className={`w-4 h-4 text-amber-400 absolute transition-all duration-300 transform ${theme === 'light'
          ? 'rotate-0 scale-100 opacity-100'
          : 'rotate-90 scale-50 opacity-0 translate-y-4'
          }`}
      />

      {/* Moon Icon Vector: Rotates, expands up, and shows cleanly if dark mode is active */}
      <Moon
        className={`w-4 h-4 text-sky-400 absolute transition-all duration-300 transform ${theme === 'dark'
          ? 'rotate-0 scale-100 opacity-100'
          : '-rotate-90 scale-50 opacity-0 -translate-y-4'
          }`}
      />
    </button>
  </>)
}