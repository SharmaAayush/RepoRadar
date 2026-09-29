import { create } from "zustand"
import { persist } from "zustand/middleware"

export type GithubTokenStore = {
  token: string
  setToken: (token: string) => void
  clearToken: () => void
}

const GITHUB_TOKEN_STORE_NAME = 'reporadar-github-token'

export const useGithubTokenStore = create<GithubTokenStore>()(
  persist(
    (set) => ({
      token: '',
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: '' }),
    }),
    {
      name: GITHUB_TOKEN_STORE_NAME,
    }
  )
);