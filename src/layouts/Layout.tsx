import { Outlet } from "react-router";
import Header from "../components/Header";
import { useThemeStore } from "../store/themeStore";
import { useEffect } from "react";

export default function Layout() {
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    const classList = document.documentElement.classList;
    if (theme === 'dark') {
      classList.add('dark');
      classList.remove('light');
    } else {
      classList.add('light');
      classList.remove('dark');
    }
  }, [theme]);

  return <div className='flex flex-col min-h-screen'>
    <Header />
    <main className='w-full max-w-6xl mx-auto p-6 space-y-6'>
      <Outlet />
    </main>
  </div>
}