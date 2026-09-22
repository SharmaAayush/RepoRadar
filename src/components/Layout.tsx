import Header from "./Header";

export default function Layout({children}: {children: React.ReactNode}) {
  return <div className='min-w-screen flex flex-col min-h-screen'>
    <Header />
    <main className='w-full max-w-6xl mx-auto p-6 space-y-6'>
      {children}
    </main>
  </div>
}