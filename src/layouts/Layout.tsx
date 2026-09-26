import { Outlet } from "react-router";
import Header from "../components/Header";

export default function Layout() {
  return <div className='min-w-screen flex flex-col min-h-screen'>
    <Header />
    <main className='w-full max-w-6xl mx-auto p-6 space-y-6'>
      <Outlet />
    </main>
  </div>
}