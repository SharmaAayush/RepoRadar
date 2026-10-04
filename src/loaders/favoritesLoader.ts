import { createGetRepoDetails } from "../api/github/github.queryOptions";
import { queryClient } from "../api/query.client";
import { useFavoritesStore } from "../store/favoritesStore";

export async function favoritesLoader() {
  const favorites = useFavoritesStore.getState().favorites;

  if (!favorites || favorites.length <= 0) {
    throw 'No repos marked as favorites';
  }

  await Promise.all(favorites.map(fullName => {
    const [owner, name] = fullName.split('/');
    return queryClient.query({
      ...createGetRepoDetails(owner, name),
      staleTime: 'static',
    })
  }));

  return {
    favorites,
  }
}