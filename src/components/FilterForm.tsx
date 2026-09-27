import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RotateCcw } from 'lucide-react';
import type { Repo } from '../types/repo';

// Unified schema definition export
export const filterSchema = z.object({
  minStars: z.coerce.number().min(0, 'Min stars must be 0 or greater'),
  language: z.string(),
  sortBy: z.enum(['stars', 'forks', 'updated']),
});

export type FilterValues = z.infer<typeof filterSchema>;

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
  } = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: currentFilters,
  });

  const defaultParameters: FilterValues = { minStars: 0, language: 'All', sortBy: 'stars' };

  return (
    <form onSubmit={handleSubmit(onApply)} className="space-y-4">
      {/* Field 1: Minimum Stars Input Vector */}
      <div className="space-y-1">
        <label htmlFor="minStars" className="text-xs font-semibold text-slate-400 select-none">
          Minimum Stars
        </label>
        <input
          id="minStars"
          type="number"
          {...register('minStars')}
          className={`w-full h-9 px-3 bg-[#0d1117] text-slate-200 text-sm rounded-lg border focus:outline-none ${errors.minStars ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-slate-700'
            }`}
        />
        {errors.minStars && (
          <p className="text-[11px] font-medium text-red-400 mt-0.5">{errors.minStars.message}</p>
        )}
      </div>

      {/* Field 2: Selection Dropdown Filter Framework for Languages */}
      <div className="space-y-1">
        <label htmlFor="language" className="text-xs font-semibold text-slate-400 select-none">
          Language
        </label>
        <select
          id="language"
          {...register('language')}
          className="w-full h-9 px-2 bg-[#0d1117] text-slate-200 text-sm rounded-lg border border-slate-800 focus:outline-none focus:border-slate-700 cursor-pointer"
        >
          <option value="All">All Languages</option>
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Field 3: Dropdown Logic Parameter Ordering */}
      <div className="space-y-1">
        <label htmlFor="sortBy" className="text-xs font-semibold text-slate-400 select-none">
          Sort Metric Order
        </label>
        <select
          id="sortBy"
          {...register('sortBy')}
          className="w-full h-9 px-2 bg-[#0d1117] text-slate-200 text-sm rounded-lg border border-slate-800 focus:outline-none focus:border-slate-700 cursor-pointer"
        >
          <option value="stars">Highest Stars</option>
          <option value="forks">Most Forks</option>
          <option value="updated">Recently Updated</option>
        </select>
      </div>

      {/* Control Execution Footer Button Workspace Grid */}
      <div className="flex gap-2 pt-2 border-t border-slate-800/60">
        <button
          type="button"
          onClick={() => onReset(defaultParameters)}
          className="h-9 px-3 bg-transparent text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg border border-slate-800 hover:bg-slate-800/40 transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
        <button
          type="submit"
          className="flex-1 h-9 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold rounded-lg transition shadow-sm"
        >
          Apply Filter Parameters
        </button>
      </div>
    </form>
  );
}
