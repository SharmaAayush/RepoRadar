import { Link } from "react-router";
import { LANGUAGE_COLOR_MAP } from "../consts/language-colors";
import type { RepoCardProps } from "../types/repo";
import { ExternalLink, GitFork, Heart, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import APP_CONFIG from "../config/app.config";
import { useFavoritesStore } from "../store/favoritesStore";

export default function RepoCard({
  id,
  full_name,
  description,
  language,
  forks_count,
  stargazers_count,
  selected = [],
  onSelectionChange,
}: RepoCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const { isFavorite: isRepoFavorite, toggleFavorite } = useFavoritesStore(state => state);

  const isFavorite = isRepoFavorite(full_name);

  const language_color = (language && (LANGUAGE_COLOR_MAP as Record<string, string>)[language]) ?? LANGUAGE_COLOR_MAP.JavaScript;

  const isSelectDisabled = selected.length >= APP_CONFIG.MAX_REPO_FOR_COMPARISON && !selected.includes(full_name);

  useEffect(() => {
    const checkTruncation = () => {
      if (titleRef.current) {
        setIsTruncated(titleRef.current.scrollWidth > titleRef.current.offsetWidth);
      }
    }

    checkTruncation();

    window.addEventListener('resize', checkTruncation);
    return () => {
      window.removeEventListener('resize', checkTruncation);
    }
  }, [full_name])

  return (
    <div className="bg-[var(--bg-elevated-2)] rounded-xl border border-[var(--border)]/80 p-5 flex flex-col justify-between hover:border-[var(--border-strong)]/85 transition shadow-sm">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/repo/${full_name}`} className="min-w-0 flex-1 relative group/title">
            <h3 ref={titleRef} className="font-semibold text-[var(--text-primary)] text-base hover:text-[var(--accent)] transition truncate">
              {full_name}
            </h3>

            {isTruncated && (
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover/title:block whitespace-nowrap bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs px-2.5 py-1.5 rounded-md border border-[var(--border)] shadow-xl z-20 pointer-events-none select-none animate-fade-in">
                {full_name}
              </div>
            )}
          </Link>
          {onSelectionChange &&
            <div className="flex items-center pt-0.5 shrink-0">
              <div
                className="relative flex items-center shrink-0 group"
              >
                <input
                  type="checkbox"
                  disabled={isSelectDisabled}
                  checked={selected.includes(full_name)}
                  id={`select-${id}`}
                  onChange={(e) => onSelectionChange?.(full_name, e.target.checked)}
                  className="w-5 h-5 rounded-md appearance-none border border-[var(--border)] bg-[var(--bg-elevated-5)] checked:bg-[var(--green)] checked:border-[var(--green)] transition-all duration-150 shrink-0 relative checked:after:content-['✓'] checked:after:absolute checked:after:text-[var(--text-primary)] checked:after:text-xs checked:after:font-bold checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center focus:outline-none focus:ring-2 focus:ring-[var(--green)]/30 cursor-pointer disabled:cursor-not-allowed disabled:bg-[var(--bg-elevated)] disabled:border-[var(--border)] disabled:opacity-40"
                />

                {/* Custom CSS Tooltip (Optional visual enhancement over native title behavior) */}
                {isSelectDisabled && (
                  <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs px-2.5 py-1.5 rounded-md border border-[var(--border)] shadow-xl z-10 pointer-events-none select-none animate-fade-in">
                    You can only compare upto 4 repos at a time
                  </div>
                )}
              </div>
            </div>
          }
        </div>

        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{description}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-[var(--border)]/60 flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-1.5">
          <a target="__blank" href={`https://github.com/${full_name}`}>View on GitHub <ExternalLink className="inline relative top-[-2px] ml-1 w-4 h-4" /></a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toggleFavorite(full_name)}><Heart
            className={
              "inline relative top-[-2px] ml-1 w-4 h-4 transition-colors "
              + (isFavorite
                ? "text-[var(--red)] fill-[var(--red)] drop-shadow-[0_0_8px_var(--shadow-red-glow)]"
                : "text-[var(--text-secondary)] hover:text-[var(--red)]/80")
            }
          /></button>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-[var(--border)]/60 flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-1.5">
          {language && <>
            {language_color && (
              <span className={`w-2.5 h-2.5 rounded-full inline-block`} style={{ backgroundColor: language_color }}></span>
            )}
            <span>{language}</span>
          </>}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[var(--yellow)] fill-[var(--yellow)]" />{stargazers_count}</span>
          <span className="flex items-center gap-1"><GitFork className="w-4 h-4 text-[var(--text-secondary)]" />{forks_count}</span>
        </div>
      </div>
    </div>
  )
}