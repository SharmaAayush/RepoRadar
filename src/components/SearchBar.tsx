export default function SearchBar() {
  return (
    <form className="flex items-center gap-4">
      <input
        type="text"
        placeholder="Search GitHub username..."
        className="flex-1 h-11 px-4 bg-[#161e2e] text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-slate-700 transition"
      />
      <button
        type="submit"
        className="px-6 h-11 bg-[#1e293b] hover:bg-[#253347] text-slate-200 font-medium rounded-xl border border-slate-800 transition shadow-sm"
      >Search</button>
    </form>
  )
}