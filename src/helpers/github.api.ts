import type { GitHubRepository, ListRepositoriesForUserResponse } from "../types/github-api-response";

export interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}

export async function getUserRepos(userName: string, sortBy = 'stars', perPage = 10): Promise<TypedResponse<ListRepositoriesForUserResponse>> {
  return await fetch(`https://api.github.com/users/${userName}/repos?sort=${sortBy}&per_page=${perPage}`);
}

export async function getRepoDetails(userName: string, repoName: string): Promise<TypedResponse<GitHubRepository>> {
  return await fetch(`https://api.github.com/repos/${userName}/${repoName}`);
}
