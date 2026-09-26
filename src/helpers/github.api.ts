import APP_CONFIG from "../config/app.config";
import type { GetRepositoryLanguagesResponse, GetRepositoryReadmeResponse, GitHubRepository, ListRepositoriesForUserResponse } from "../types/github-api-response";

export interface TypedResponse<T> extends Response {
  json(): Promise<T>;
}


// API Endpoint documentation: https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10#list-repositories-for-a-user
export async function getUserRepos(userName: string, page = 1, sortBy = 'stars'): Promise<TypedResponse<ListRepositoriesForUserResponse>> {
  return await fetch(`https://api.github.com/users/${userName}/repos?sort=${sortBy}&per_page=${APP_CONFIG.REPOS_PER_PAGE}&page=${page}`);
}

export async function getRepoDetails(userName: string, repoName: string): Promise<TypedResponse<GitHubRepository>> {
  return await fetch(`https://api.github.com/repos/${userName}/${repoName}`);
}

export async function getRepoLanguages(userName: string, repoName: string): Promise<TypedResponse<GetRepositoryLanguagesResponse>> {
  return await fetch(`https://api.github.com/repos/${userName}/${repoName}/languages`);
}

export async function getRepoReadme(userName: string, repoName: string): Promise<TypedResponse<GetRepositoryReadmeResponse>> {
  return await fetch(`https://api.github.com/repos/${userName}/${repoName}/readme`);
}
