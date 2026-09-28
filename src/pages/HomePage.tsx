import { useEffect, useMemo, useRef, useState } from "react";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import LoadingSpinner from "../components/LoadingSpinner";
import RepoCard from "../components/RepoCard";
import SearchBar from "../components/SearchBar";
import APP_CONFIG from "../config/app.config";
import { getRepoDetails, getUserRepos } from "../helpers/github.api";
import type { ListRepositoriesForUserResponse } from "../types/github-api-response";
import type { Repo } from "../types/repo";
import type { FilterValues } from "../helpers/filter.helper";

export default function HomePage() {
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [page, setPage] = useState(1);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterValues>({
    minStars: 0,
    language: 'All',
    sortBy: 'stars',
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Set intersection observer for infinite scroll tracking
  useEffect(() => {
    const callback: IntersectionObserverCallback = ([entry]) => {
      if (entry.isIntersecting) {
        if (hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      }
    };
    const options = {
      root: null,         // Use the browser viewport
      rootMargin: '0px',  // No offset margin
      threshold: 0.1,     // Trigger when 10% of the element is visible
    };
    const observer = new IntersectionObserver(callback, options);
    const currentTarget = sentinelRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    }
  }, [hasMore]);

  // On submittedUsername update, reset page, repos, and hasMore
  useEffect(() => {
    (() => {
      setPage(1);
      setRepos([]);
      setHasMore(false);
      setFilters({ minStars: 0, language: 'All', sortBy: 'stars' });
    })();
  }, [submittedUsername]);

  // Fetch user repos on submittedUsername or page change
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (submittedUsername && page) {
      timeout = setTimeout(async () => {
        setStatus('loading');

        try {
          const resultPromise = await getUserRepos(submittedUsername, page);
          if (!resultPromise.ok) {
            throw resultPromise.status;
          }
          const result: ListRepositoriesForUserResponse = await resultPromise.json();
          setHasMore(result.length === APP_CONFIG.REPOS_PER_PAGE);
          const repos = result.map((repo) => {
            const typedRepo: Repo = {
              id: repo.id,
              full_name: `${submittedUsername}/${repo.name}`,
              description: repo.description,
              stargazers_count: repo.stargazers_count,
              forks_count: repo.forks_count,
              language: repo.language,
            };
            return typedRepo;
          });
          setRepos(prevRepos => [...prevRepos, ...repos]);
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
      }, 50);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }, [submittedUsername, page])

  // Setup polling to update stars and forks count for all repos if polling is enabled
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
  }, [repos, submittedUsername]);

  const displayedRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        const matchesStars = (repo.stargazers_count ?? 0) >= filters.minStars;
        const matchesLanguage = filters.language === 'All' || repo.language === filters.language;
        return matchesStars && matchesLanguage;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'forks') {
          return (b.forks_count ?? 0) - (a.forks_count ?? 0);
        }
        if (filters.sortBy === 'updated') {
          // Fallback parsing placeholder logic for date structures if integrated later
          return b.id - a.id; 
        }
        // Default default sort sequence: Highest Stars (Descending)
        return (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0);
      });
  }, [repos, filters]);

  let mainContent;
  switch (true) {
    case status === 'loading' && repos.length === 0:
      mainContent = <LoadingSpinner />
      break;
    case status === 'error':
      mainContent = <ErrorBanner message={errorMessage} />
      break;
    default:
      if (displayedRepos.length > 0) {
        mainContent = <>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {displayedRepos
              .map((repo) => (
                <RepoCard
                  key={repo.id}
                  onSelectionChange={(fullName, checked) => {
                    setSelected(prevSelected => {
                      if (!checked) {
                        return prevSelected.filter(selected => selected !== fullName);
                      } else {
                        return [...prevSelected, fullName];
                      }
                    });
                  }}
                  selected={selected}
                  {...repo}
                />
              ))}
          </div>
          {status === 'loading' && <LoadingSpinner />}
          {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
          {!hasMore && repos.length > 0 && <EmptyState message='No more repos' />}
        </>;
      } else {
        mainContent = <EmptyState message="No repositories match the chosen filter configuration." />;
      }
      break;
  }

  return (
    <>
      <SearchBar
        onSubmit={setSubmittedUsername}
        selected={selected}
        onClearSelection={() => setSelected([])}
        loadedRepos={repos}
        onApplyFilters={setFilters}
      />
      {mainContent}
    </>
  )
}