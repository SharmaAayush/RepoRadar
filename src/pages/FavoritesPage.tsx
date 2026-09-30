import { useLoaderData, useNavigate } from "react-router"
import type { favoritesLoader } from "../loaders/favoritesLoader";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import RepoCard from "../components/RepoCard";
import { useFavoritesStore } from "../store/favoritesStore";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const {favorites, toggleFavorite} = useFavoritesStore(state => state);
  const { favoriteRepos } = useLoaderData<typeof favoritesLoader>();
  const [repos, setRepos] = useState(favoriteRepos);
  const navigate = useNavigate();

  useEffect(() => {
    (() => {
      setRepos(prevRepos => prevRepos.filter(repo => favorites.includes(repo.full_name)))
    })();
  }, [favorites])

  function handleRemoveFavorite(fullname: string) {
    setRepos(prevRepos => prevRepos.filter(repo => repo.full_name !== fullname));
    toggleFavorite(fullname);
  }

  return (<>
    {/* Navigation Action Header Bar */}
    <div className="flex items-center justify-between">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-[var(--accent)] hover:underline focus:outline-none transition group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to search dashboard</span>
      </button>

      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-elevated)] px-3 py-1.5 rounded-full border border-[var(--border)]">
        <span className="text-[var(--red)]"><Heart className="inline relative top-[-2px] ml-1 w-4 h-4 fill-[var(--red)]" /></span>
        <span>Saved items: <strong className="text-[var(--text-primary)]">{favorites.length}</strong></span>
      </div>
    </div>

    {/* Dynamic Title Context Head */}
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
        Your Favorited Repositories
      </h1>
      <p className="text-xs text-[var(--text-secondary)]">
        Fresh metrics for your bookmarked exploration workspaces.
      </p>
    </div>
    {/* Grid Workspace rendering matching layout structures natively */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {repos.map((repo) => (
        <div key={repo.id} className="relative group/favcard">

          {/* Standard Repo Card Base Element */}
          <RepoCard
            {...repo}
            // onFavorite={() => handleRemoveFavorite(repo.full_name)}
          />

          {/* Styled Quick Remove overlay Button placed inside the visual layout space */}
          <div className="absolute top-4 right-4 z-10 flex items-center justify-center opacity-0 group-hover/favcard:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={() => handleRemoveFavorite(repo.full_name)}
              className="h-8 px-2.5 flex items-center gap-1.5 text-xs font-medium rounded-lg bg-[var(--bg-elevated-5)] text-[var(--text-secondary)] hover:text-[var(--red)] hover:bg-[var(--red-subtle)] border border-[var(--border)] hover:border-[var(--red)]/20 transition shadow-md"
              title="Remove from favorites list"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  </>)
}