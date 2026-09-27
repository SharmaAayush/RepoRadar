import { BarChart2, Filter, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type MouseEvent as RMouseEvent, type SubmitEvent } from "react"
import { useNavigate } from "react-router";
import type { Repo } from "../types/repo";
import type { FilterValues } from "./FilterForm";
import FilterForm from "./FilterForm";

type SearchBarProps = {
  onSubmit: (value: string) => void,
  selected: string[],
  onClearSelection: () => void,
  loadedRepos: Repo[],
  onApplyFilters?: (filters: FilterValues) => void,
}

export default function SearchBar({ onSubmit, selected, loadedRepos, onClearSelection, onApplyFilters }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    minStars: 0,
    language: 'All',
    sortBy: 'stars',
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const selectedCount = selected.length;
  const isCompareDisabled = selectedCount < 2;

  // Compute Active Filter Badge Counts
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeFilters.minStars > 0) count++;
    if (activeFilters.language !== 'All') count++;
    if (activeFilters.sortBy !== 'stars') count++;
    return count;
  }, [activeFilters]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Dismiss filter on outside mouse tracking clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  function handleSearchSubmit(e: SubmitEvent | RMouseEvent) {
    // prevent form submission to prevent redirect
    e.preventDefault();
    onSubmit(value);
  }

  function handleFilterApply(values: FilterValues) {
    setActiveFilters(values);
    onApplyFilters?.(values);
    setIsFilterOpen(false);
  }

  function handleFilterReset(defaultValues: FilterValues) {
    setActiveFilters(defaultValues);
    onApplyFilters?.(defaultValues);
    setIsFilterOpen(false);
  }

  function handleCompareClick(e: RMouseEvent) {
    e.preventDefault();
    navigate(`/compare?repos=${selected.join(',')}`);
  }

  return (<>
    {/* Search Grid containing responsive layout columns */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center w-full relative">

      {/* Grid Zone 1: Input Field Form Row Container */}
      <form onSubmit={handleSearchSubmit} className="md:col-span-2 w-full">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Search GitHub username..."
          className="w-full h-11 px-4 bg-[#161e2e] text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-slate-700 transition"
        />
      </form>


      {/* Grid Zone 2: Action Controls Row Container */}
      <div className="flex items-center gap-3 w-full md:col-span-1 relative">
        <button
          type="button"
          onClick={handleSearchSubmit}
          className="flex-1 h-11 bg-[#1e293b] hover:bg-[#253347] text-slate-200 font-medium rounded-xl border border-slate-800 transition shadow-sm"
        >
          Search
        </button>
        <button
          type="button"
          className="flex-1 h-11 bg-[#1e293b] hover:bg-[#253347] text-slate-200 font-medium rounded-xl border border-slate-800 transition shadow-sm"
          onClick={() => setValue('')}
        >
          Clear
        </button>

        {/* Filter Popover Mount Position Element */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`h-11 w-11 flex items-center justify-center rounded-xl border transition relative shadow-sm ${isFilterOpen || activeFiltersCount > 0
                ? 'bg-[#1e293b] border-slate-700 text-[#58a6ff]'
                : 'bg-[#1e293b] hover:bg-[#253347] text-slate-300 border-slate-800'
              }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#238636] border-2 border-[#0d1117] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center select-none">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Render decoupled FilterForm within the container modal */}
          {isFilterOpen && (
            <div
              ref={popoverRef}
              className="absolute right-0 mt-3 w-72 sm:w-80 bg-[#161e2e] border border-slate-800 rounded-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-50 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#58a6ff]" /> Workspace Filters
                </span>
                <button onClick={() => setIsFilterOpen(false)} className="text-slate-500 hover:text-slate-400 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <FilterForm
                loadedRepos={loadedRepos}
                currentFilters={activeFilters}
                onApply={handleFilterApply}
                onReset={handleFilterReset}
              />
            </div>
          )}
        </div>
      </div>
    </div>

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