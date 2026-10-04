import type { Params } from "react-router";
import { createGetRepoDetails, createGetRepoLanguages, createGetRepoReadme } from "../api/github/github.queryOptions";
import { queryClient } from "../api/query.client";

export type RepoLoaderParams = {
  params: Params
}

export async function repoLoader({ params }: RepoLoaderParams) {
  const { name, owner } = params;

  if (!name || !owner) {
    throw 'Owner or Repo name missing';
  }

  await Promise.all([
    queryClient.query({ ...createGetRepoDetails(owner, name), staleTime: 'static' }),
    queryClient.query({ ...createGetRepoLanguages(owner, name), staleTime: 'static' }),
    queryClient.query({ ...createGetRepoReadme(owner, name), staleTime: 'static' }),
  ]);

  return { owner, name};
}