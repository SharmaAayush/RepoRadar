import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import LoadingSpinner from "../components/LoadingSpinner";
import RepoCard from "../components/RepoCard";
import SearchBar from "../components/SearchBar";
import APP_CONFIG from "../config/app.config";
import type { FilterValues } from "../helpers/filter.helper";
import axios from "axios";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import ERROR_MESSAGES from "../consts/error-messages";
import { createGetUserRepos } from "../api/github/github.queryOptions";

export default function HomePage() {
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterValues>({
    minStars: 0,
    language: 'All',
    sortBy: 'full_name',
  });

  const queryClient = useQueryClient();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset the infinite query cache whenever the submittedUsername changes
  useEffect(() => {
    if (submittedUsername) {
      queryClient.resetQueries({
        queryKey: createGetUserRepos(submittedUsername, filters.sortBy).queryKey // or match your base query key structure
      });
    }
  }, [submittedUsername, filters.sortBy, queryClient]);

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...createGetUserRepos(submittedUsername, filters.sortBy),
    enabled: !!submittedUsername,
  });

  const repos = useMemo(() => {
    return data?.pages.flatMap(page => page) ?? [];
  }, [data]);

  // Set intersection observer for infinite scroll tracking
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const currentTarget = sentinelRef.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    observer.observe(currentTarget);
    return () => observer.unobserve(currentTarget);
  }, [handleObserver]);

  // Setup polling to update stars and forks count for all repos if polling is enabled
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (APP_CONFIG.ENABLE_REPO_POLLING && submittedUsername) {
      interval = setInterval(() => {
        queryClient.invalidateQueries({
          queryKey: createGetUserRepos(submittedUsername, filters.sortBy).queryKey,
        });
      }, APP_CONFIG.REPO_POLLING_INTERVAL);
    }
    return () => {
      if (interval) {
        clearInterval(interval); // Fixed: clearTimeout -> clearInterval
      }
    };
  }, [submittedUsername, filters.sortBy, queryClient]);

  const displayedRepos = useMemo(() => {
    return repos.filter((repo) => {
      const matchesStars = (repo.stargazers_count ?? 0) >= filters.minStars;
      const matchesLanguage = filters.language === 'All' || repo.language === filters.language;
      return matchesStars && matchesLanguage;
    });
  }, [repos, filters]);

  // Error handling message derivation
  const errorMessage = useMemo(() => {
    if (!error) return '';
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) return 'User not found — check the username and try again.';
      if (error.response?.status === 403) return 'Rate limited by GitHub — try again after some time.';
      if (error.response?.status === 401) return 'Unauthorized error — try removing GitHub token if set.';
    }
    return ERROR_MESSAGES.DEFAULT_API_ERROR;
  }, [error]);

  return (
    <>
      <SearchBar
        onSubmit={(username) => {
          setSubmittedUsername(username);
        }}
        selected={selected}
        onClearSelection={() => setSelected([])}
        loadedRepos={repos}
        onApplyFilters={setFilters}
      />
      {error ? (
        <ErrorBanner message={errorMessage} />
      ) : isLoading && !submittedUsername ? (
        <EmptyState message="Enter a GitHub username to start searching." />
      ) : isLoading ? (
        <LoadingSpinner />
      ) : displayedRepos.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {displayedRepos.map((repo) => (
              <RepoCard
                key={repo.id}
                onSelectionChange={(fullName, checked) => {
                  setSelected((prev) =>
                    checked ? [...prev, fullName] : prev.filter((name) => name !== fullName)
                  );
                }}
                selected={selected}
                {...repo}
              />
            ))}
          </div>
          {isFetchingNextPage && <LoadingSpinner />}
          {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}
          {!hasNextPage && repos.length > 0 && <EmptyState message='No more repos' />}
        </>
      ) : (
        <EmptyState message="No repositories match the chosen filter configuration." />
      )}
    </>
  );
}