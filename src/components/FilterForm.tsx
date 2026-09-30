import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RotateCcw } from 'lucide-react';
import type { Repo } from '../types/repo';
import { filterSchema, type FilterValues } from '../helpers/filter.helper';

interface FilterFormProps {
  loadedRepos: Repo[];
  currentFilters: FilterValues;
  onApply: (values: FilterValues) => void;
  onReset: (defaultValues: FilterValues) => void;
}

export default function FilterForm({ loadedRepos, currentFilters, onApply, onReset }: FilterFormProps) {
  // Dynamically extract unique languages from live query result fields
  const availableLanguages = useMemo(() => {
    const languages = new Set<string>();
    loadedRepos.forEach((repo) => {
      if (repo.language) languages.add(repo.language);
    });
    return Array.from(languages).sort();
  }, [loadedRepos]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof filterSchema>, unknown, FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: currentFilters,
  });

  const defaultParameters: FilterValues = { minStars: 0, language: 'All', sortBy: 'stars' };

  return (
    <form onSubmit={handleSubmit(onApply)} className="space-y-4">
      {/* Field 1: Minimum Stars Input Vector */}
      <div className="space-y-1">
        <label htmlFor="minStars" className="text-xs font-semibold text-[var(--text-secondary)] select-none">
          Minimum Stars
        </label>
        <input
          id="minStars"
          type="number"
          {...register('minStars')}
          className={`w-full h-9 px-3 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm rounded-lg border focus:outline-none ${errors.minStars ? 'border-[var(--red)]/50 focus:border-[var(--red)]' : 'border-[var(--border)] focus:border-[var(--border-strong)]'
            }`}
        />
        {errors.minStars && (
          <p className="text-[11px] font-medium text-[var(--red)] mt-0.5">{errors.minStars.message}</p>
        )}
      </div>

      {/* Field 2: Selection Dropdown Filter Framework for Languages */}
      <div className="space-y-1">
        <label htmlFor="language" className="text-xs font-semibold text-[var(--text-secondary)] select-none">
          Language
        </label>
        <select
          id="language"
          {...register('language')}
          className="w-full h-9 px-2 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm rounded-lg border border-[var(--border)] focus:outline-none focus:border-[var(--border-strong)] cursor-pointer"
        >
          <option value="All">All Languages</option>
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Field 3: Dropdown Logic Parameter Ordering */}
      <div className="space-y-1">
        <label htmlFor="sortBy" className="text-xs font-semibold text-[var(--text-secondary)] select-none">
          Sort Metric Order
        </label>
        <select
          id="sortBy"
          {...register('sortBy')}
          className="w-full h-9 px-2 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm rounded-lg border border-[var(--border)] focus:outline-none focus:border-[var(--border-strong)] cursor-pointer"
        >
          <option value="stars">Highest Stars</option>
          <option value="forks">Most Forks</option>
          <option value="updated">Recently Updated</option>
        </select>
      </div>

      {/* Control Execution Footer Button Workspace Grid */}
      <div className="flex gap-2 pt-2 border-t border-[var(--border)]/60">
        <button
          type="button"
          onClick={() => onReset(defaultParameters)}
          className="h-9 px-3 bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium rounded-lg border border-[var(--border)] hover:bg-[var(--bg-elevated-5)] transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
        <button
          type="submit"
          className="flex-1 h-9 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white text-xs font-semibold rounded-lg transition shadow-sm"
        >
          Apply Filter Parameters
        </button>
      </div>
    </form>
  );
}