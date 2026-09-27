import { BarChart2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type SubmitEvent } from "react"
import { useNavigate } from "react-router";

type SearchBarProps = {
  onSubmit: (value: string) => void,
  selected: string[],
  onClearSelection: () => void,
}

export default function SearchBar({ onSubmit, selected, onClearSelection }: SearchBarProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const selectedCount = selected.length;
  const isCompareDisabled = selectedCount < 2;

  useEffect(() => {
    inputRef.current?.focus();
  }, [])

  function handleSubmit(e: SubmitEvent) {
    // prevent form submission to prevent redirect
    e.preventDefault();
    onSubmit(value);
  }

  function handleCompareClick(e: MouseEvent) {
    e.preventDefault();
    navigate(`/compare?repos=${selected.join(',')}`);
  }

  return (<>
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => { setValue(e.target.value); }}
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
        onClick={() => { setValue(''); }}
      >Clear</button>
    </form>

    {/* 2. Option 3: Floating Workspace Dock Overlay */}
    {/* Dynamic slide-up transition classes handle appearance seamlessly when active */}
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl transition-all duration-300 ease-out transform ${selectedCount > 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}>
      <div className="bg-[#161e2e]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

        {/* Workspace Status Meta */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1e293b] rounded-xl border border-slate-800 text-slate-400">
            <BarChart2 className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-slate-100">RepoRadar Workspace</h4>
            <p className="text-xs text-slate-400">
              <span className="text-blue-400 font-bold">{selectedCount}</span> {selectedCount === 1 ? 'repository' : 'repositories'} selected
            </p>
          </div>
        </div>

        {/* Dedicated Compare and Clear Action Control Group */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Clear Selection Button */}
          <button
            type="button"
            onClick={onClearSelection}
            className="flex-1 sm:flex-none h-10 px-4 flex items-center justify-center gap-2 text-sm font-medium rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition duration-150"
          >
            <Trash2 className="w-4 h-4" />
            <span className="sm:inline">Clear All</span>
          </button>

          {/* Compare Trigger Button Wrapper Container with Custom CSS Tooltip */}
          <div className="relative group/compare flex-1 sm:flex-none">
            <button
              type="button"
              disabled={isCompareDisabled}
              onClick={handleCompareClick}
              className="w-full h-10 px-5 flex items-center justify-center gap-2 text-sm font-medium rounded-xl border transition shadow-sm whitespace-nowrap focus:outline-none disabled:cursor-not-allowed
      disabled:bg-[#161e2e]/40 disabled:border-slate-800/50 disabled:text-slate-600
      enabled:bg-[#238636] enabled:hover:bg-[#2ea043] enabled:text-white enabled:border-[#2ea043]/30"
            >
              <span>Compare Selected</span>
            </button>

            {/* Tooltip visually matching the rest of the application layout */}
            {isCompareDisabled && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/compare:block whitespace-nowrap bg-[#161b22] text-[#f0f6fc] text-xs px-2.5 py-1.5 rounded-md border border-[#30363d] shadow-xl z-20 pointer-events-none select-none animate-fade-in">
                Select at least 2 repositories to compare
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
  )
}