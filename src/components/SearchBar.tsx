import { useEffect, useRef, useState, type SubmitEvent } from "react"

type SearchBarProps = {
  onSubmit: (value: string) => void,
}

export default function SearchBar({onSubmit}: SearchBarProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [])

  function handleSubmit(e: SubmitEvent) {
    // prevent form submission to prevent redirect
    e.preventDefault();
    onSubmit(value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => {setValue(e.target.value);}}
        type="text"
        placeholder="Search GitHub username..."
        className="flex-1 h-11 px-4 bg-[#161e2e] text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-slate-700 transition"
      />
      <button
        type="submit"
        className="px-6 h-11 bg-[#1e293b] hover:bg-[#253347] text-slate-200 font-medium rounded-xl border border-slate-800 transition shadow-sm"
      >Search</button>
      <button
        type="reset"
        className="px-6 h-11 bg-[#1e293b] hover:bg-[#253347] text-slate-200 font-medium rounded-xl border border-slate-800 transition shadow-sm"
        onClick={() => {setValue('');}}
      >Clear</button>
    </form>
  )
}