import { create } from "zustand"
import { persist } from "zustand/middleware"

export type FavoritesStore = {
  favorites: string[],
  toggleFavorite: (fullname: string) => void,
  isFavorite: (fullname: string) => boolean,
}

const FAVORITES_STORE_NAME = 'reporadar-favorites';

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite(fullname) {
        return set(state => ({
          favorites: state.favorites.includes(fullname)
            ? state.favorites.filter(f => f !== fullname)
            : [...state.favorites, fullname],
        }))
      },
      isFavorite(fullname) {
        return get().favorites.includes(fullname);
      },
    }),
    {
      name: FAVORITES_STORE_NAME,
    }
  )
);