import { getRepoDetails } from "../api/github.client";
import { useFavoritesStore } from "../store/favoritesStore";
import type { Repo } from "../types/repo";

export async function favoritesLoader() {
  const favorites = useFavoritesStore.getState().favorites;

  if (!favorites || favorites.length <= 0) {
    throw 'No repos marked as favorites';
  }

  const responses = await Promise.all(favorites.map(fullName => {
    const [owner, name] = fullName.split('/');
    return getRepoDetails(owner, name);
  }));
  const favoriteRepos = responses.map(res => res.data);
  const repos: Repo[] = favoriteRepos.map((repo, index) => ({
    id: repo.id,
    description: repo.description,
    forks_count: repo.forks_count,
    stargazers_count: repo.stargazers_count,
    language: repo.language,
    full_name: favorites[index],
  }))
  return {
    favoriteRepos: repos,
  }
}