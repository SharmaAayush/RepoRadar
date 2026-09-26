import type { Params } from "react-router";
import { getRepoDetails, getRepoLanguages, getRepoReadme } from "../helpers/github.api";

export type RepoLoaderParams = {
  params: Params
}

export async function repoLoader({ params }: RepoLoaderParams) {
  const { name, owner } = params;

  if (!name || !owner) {
    throw 'Owner or Repo name missing';
  }

  const repoDetailsPromise = getRepoDetails(owner, name);
  const repoLanguagesPromise = getRepoLanguages(owner, name);
  const repoReadmePromise = getRepoReadme(owner, name);
  const results = await Promise.all([repoDetailsPromise, repoLanguagesPromise, repoReadmePromise]);
  const [repoDetails, repoLanguages, repoReadme] = results;
  for (const result of results) {
    if (!result.ok) {
      throw result.status;
    }
  }
  const repo = await repoDetails.json();
  const languages = await repoLanguages.json();
  const readmeRes = await repoReadme.json();
  const readme = atob(readmeRes.content);
  const languagesEntries = Object.entries(languages);
  return {
    repo,
    languages: languagesEntries,
    readme,
  }
}