import type { Repo } from './types/repo'
import SearchBar from './components/SearchBar'
import RepoCard from './components/RepoCard'
import Layout from './components/Layout';
import { useEffect, useState } from 'react';
import EmptyState from './components/EmptyState';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner';
import type { ListRepositoriesForUserResponse } from './types/github-api-response';
import APP_CONFIG from './config/app.config';
import { getRepoDetails, getUserRepos } from './helpers/github.api';

function App() {
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    (async () => {
      if (submittedUsername) {
        setStatus('loading');

        try {
          // API Endpoint documentation: https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10#list-repositories-for-a-user
          const resultPromise = await getUserRepos(submittedUsername);
          if (!resultPromise.ok) {
            setErrorMessage('User not found — check the username and try again.');
            throw resultPromise.status;
          }
          const result: ListRepositoriesForUserResponse = await resultPromise.json();
          const repos = result.map((repo) => {
            const typedRepo: Repo = {
              id: repo.id,
              full_name: repo.name,
              description: repo.description,
              stargazers_count: repo.stargazers_count,
              forks_count: repo.forks_count,
              language: repo.language,
              // TODO Phase 8: replace with Zustand store action
              onFavorite(id) {
                console.log('favorite clicked:', id)
              },
            };
            return typedRepo;
          });
          setRepos(repos);
          console.log(result);
          setStatus('success');
        } catch (error) {
          setStatus('error');
          if (error === 404) {
            setErrorMessage('User not found — check the username and try again.');
          }
          if (error === 403) {
            setErrorMessage('Rate limited by GitHub — try again after some time.');
          }
        }
      }
    })();
  }, [submittedUsername]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (APP_CONFIG.ENABLE_REPO_POLLING && repos.length > 0) {
      interval = setInterval(async () => {
        try {
          const resultPromises = repos.map(repo => getRepoDetails(submittedUsername, repo.full_name));
          const results = await Promise.all(resultPromises);
          const jsonResultPromises = results.map(res => res.json());
          const jsonResults = await Promise.all(jsonResultPromises);
          const updatedRepos = [...repos];
          jsonResults.forEach(res => {
            const repo = updatedRepos.find(repo => repo.id === res.id);
            if (repo) {
              repo.stargazers_count = res.stargazers_count;
              repo.forks_count = res.forks_count;
            }
          });
          setRepos(updatedRepos);
        } catch (error) {
          // just log the error
          console.log(error);
        }
      }, 60 * 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    }
  }, [repos])

  const filteredRepos = repos;

  let mainContent;
  switch (status) {
    case 'loading':
      mainContent = <LoadingSpinner />
      break;
    case 'error':
      mainContent = <ErrorBanner message={errorMessage} />
      break;
    default:
      if (filteredRepos.length > 0) {
        mainContent = <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {filteredRepos
            .map((repo) => (
              <RepoCard key={repo.id} {...repo} />
            ))}
        </div>;
      } else {
        mainContent = <EmptyState />;
      }
      break;
  }

  return (
    <Layout>
      <SearchBar onSubmit={setSubmittedUsername} />
      {mainContent}
    </Layout>
  )
}

export default App
