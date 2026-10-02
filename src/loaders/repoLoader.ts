import type { Params } from "react-router";
import { getRepoDetails, getRepoLanguages, getRepoReadme } from "../api/github.client";

export type RepoLoaderParams = {
  params: Params
}

export async function repoLoader({ params }: RepoLoaderParams) {
  const { name, owner } = params;

  if (!name || !owner) {
    throw 'Owner or Repo name missing';
  }

  const results = await Promise.all([
    getRepoDetails(owner, name),
    getRepoLanguages(owner, name),
    getRepoReadme(owner, name),
  ]);

  const [{ data: repo }, { data: languages }, { data: readmeRes }] = results;
  const readme = atob(readmeRes.content);
  const languagesEntries = Object.entries(languages);
  return {
    repo,
    languages: languagesEntries,
    readme,
  }
}