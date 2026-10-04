import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getRepoDetails, getRepoLanguages, getRepoReadme, getUserRepos, type ReposSortByOptions } from './github.client';
import APP_CONFIG from '../../config/app.config';

export function getUserReposQueryKey(
  userName: string,
  sortBy: ReposSortByOptions = 'full_name',
) {
  return ['users', userName, 'repos', { sort: sortBy }];
}
export function createGetUserRepos(
  userName: string,
  sortBy: ReposSortByOptions = 'full_name',
) {
  return infiniteQueryOptions({
    queryKey: ['users', userName, 'repos', { sort: sortBy }],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getUserRepos(userName, pageParam, sortBy);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If the last fetched page has fewer items than configured, there are no more pages
      return lastPage.length === APP_CONFIG.REPOS_PER_PAGE ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

export function getRepoDetailsQueryKey(
  userName: string,
  repoName: string,
) {
  return ['repos', userName, repoName];
}
export function createGetRepoDetails(
  userName: string,
  repoName: string,
) {
  return queryOptions({
    queryKey: ['repos', userName, repoName],
    queryFn: () => getRepoDetails(userName, repoName),
  });
}

export function getRepoLanguagesQueryKey(
  userName: string,
  repoName: string,
) {
  return ['repos', userName, repoName, 'languages'];
}
export function createGetRepoLanguages(
  userName: string,
  repoName: string,
) {
  return queryOptions({
    queryKey: getRepoLanguagesQueryKey(userName, repoName),
    queryFn: () => getRepoLanguages(userName, repoName),
  });
}

export function getRepoReadmeQueryKey(
  userName: string,
  repoName: string,
) {
  return ['repos', userName, repoName, 'readme'];
}
export function createGetRepoReadme(
  userName: string,
  repoName: string,
) {
  return queryOptions({
    queryKey: getRepoReadmeQueryKey(userName, repoName),
    queryFn: () => getRepoReadme(userName, repoName),
  });
}