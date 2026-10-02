import axios, { type AxiosResponse } from 'axios';
import { useGithubTokenStore } from '../store/githubTokenStore';
import type { GetRepositoryLanguagesResponse, GetRepositoryReadmeResponse, GitHubRepository, ListRepositoriesForUserResponse } from '../types/github-api-response';
import APP_CONFIG from '../config/app.config';

const githubClient = axios.create({
  baseURL: 'https://api.github.com',
});

githubClient.interceptors.request.use((config) => {
  const token = useGithubTokenStore.getState().token;
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

githubClient.interceptors.response.use(
  response => response,
  error => {
    let errorMessage = '';
    if (axios.isAxiosError(error)) {
      if (error.status === 403) {
        errorMessage = 'Rate limited by GitHub — try again after some time.';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized error — try removing GitHub token if set.';
      }
    }
    if (errorMessage) {
      return Promise.reject({
        ...error,
        errorMessage,
      });
    }
    return Promise.reject(error);
  }
)

// API Endpoint documentation: https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10#list-repositories-for-a-user
export async function getUserRepos(
  userName: string,
  page = 1,
  sortBy = 'stars',
): Promise<AxiosResponse<ListRepositoriesForUserResponse>> {
  return await githubClient.get(`/users/${userName}/repos`, {
    params: {
      sort: sortBy,
      per_page: APP_CONFIG.REPOS_PER_PAGE,
      page,
    }
  });
}

export async function getRepoDetails(
  userName: string,
  repoName: string,
): Promise<AxiosResponse<GitHubRepository>> {
  return await githubClient.get(`/repos/${userName}/${repoName}`);
}

export async function getRepoLanguages(
  userName: string,
  repoName: string,
): Promise<AxiosResponse<GetRepositoryLanguagesResponse>> {
  return await githubClient.get(`/repos/${userName}/${repoName}/languages`);
}

export async function getRepoReadme(
  userName: string,
  repoName: string,
): Promise<AxiosResponse<GetRepositoryReadmeResponse>> {
  return await githubClient.get(`/repos/${userName}/${repoName}/readme`);
}