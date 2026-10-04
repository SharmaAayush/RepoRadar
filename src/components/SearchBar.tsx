import { BarChart2, Filter, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type MouseEvent as RMouseEvent, type SubmitEvent } from "react"
import { useNavigate } from "react-router";
import type { Repo } from "../types/repo";
import FilterForm from "./FilterForm";
import type { FilterValues } from "../helpers/filter.helper";

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
    sortBy: 'full_name',
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
    if (activeFilters.sortBy !== 'full_name') count++;
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
          className="w-full h-11 px-4 bg-[var(--bg-elevated-2)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--border-strong)] transition"
        />
      </form>


      {/* Grid Zone 2: Action Controls Row Container */}
      <div className="flex items-center gap-3 w-full md:col-span-1 relative">
        <button
          type="button"
          onClick={handleSearchSubmit}
          className="flex-1 h-11 bg-[var(--bg-elevated-3)] hover:bg-[var(--bg-elevated-6)] text-[var(--text-primary)] font-medium rounded-xl border border-[var(--border)] transition shadow-sm"
        >
          Search
        </button>
        <button
          type="button"
          className="flex-1 h-11 bg-[var(--bg-elevated-3)] hover:bg-[var(--bg-elevated-6)] text-[var(--text-primary)] font-medium rounded-xl border border-[var(--border)] transition shadow-sm"
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
                ? 'bg-[var(--bg-elevated-3)] border-[var(--border-strong)] text-[var(--accent)]'
                : 'bg-[var(--bg-elevated-3)] hover:bg-[var(--bg-elevated-6)] text-[var(--text-secondary)] border-[var(--border)]'
              }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[var(--green)] border-2 border-[var(--bg)] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center select-none">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Render decoupled FilterForm within the container modal */}
          {isFilterOpen && (
            <div
              ref={popoverRef}
              className="absolute right-0 mt-3 w-72 sm:w-80 bg-[var(--bg-elevated-2)] border border-[var(--border)] rounded-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-50 text-left"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-2 mb-3">
                <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[var(--accent)]" /> Workspace Filters
                </span>
                <button onClick={() => setIsFilterOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
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
      <div className="bg-[var(--bg-elevated-2)]/90 backdrop-blur-md border border-[var(--border)] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

        {/* Workspace Status Meta */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--bg-elevated-3)] rounded-xl border border-[var(--border)] text-[var(--text-secondary)]">
            <BarChart2 className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">RepoRadar Workspace</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              <span className="text-[var(--accent)] font-bold">{selectedCount}</span> {selectedCount === 1 ? 'repository' : 'repositories'} selected
            </p>
          </div>
        </div>

        {/* Dedicated Compare and Clear Action Control Group */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Clear Selection Button */}
          <button
            type="button"
            onClick={onClearSelection}
            className="flex-1 sm:flex-none h-10 px-4 flex items-center justify-center gap-2 text-sm font-medium rounded-xl text-[var(--text-secondary)] hover:text-[var(--red)] hover:bg-[var(--red-subtle)] border border-transparent hover:border-[var(--red)]/20 transition duration-150"
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
      disabled:bg-[var(--bg-elevated-2)]/40 disabled:border-[var(--border)]/50 disabled:text-[var(--text-muted)]
      enabled:bg-[var(--green)] enabled:hover:bg-[var(--green-hover)] enabled:text-white enabled:border-[var(--green)]/30"
            >
              <span>Compare Selected</span>
            </button>

            {/* Tooltip visually matching the rest of the application layout */}
            {isCompareDisabled && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/compare:block whitespace-nowrap bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs px-2.5 py-1.5 rounded-md border border-[var(--border)] shadow-xl z-20 pointer-events-none select-none animate-fade-in">
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