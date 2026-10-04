import { useSearchParams } from "react-router"
import ErrorBanner from "../components/ErrorBanner";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { AlertCircle, ArrowLeft, BarChart2, Calendar, Code, GitFork, Shield, Star } from "lucide-react";
import axios, { type AxiosError } from "axios";
import { useQueries } from "@tanstack/react-query";
import { createGetRepoDetails } from "../api/github/github.queryOptions";

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  // Parse repo names from query parameters
  const repoNames = useMemo(() => {
    const reposParam = searchParams.get('repos');
    if (!reposParam) return [];
    return reposParam.split(',').map((name) => name.trim()).filter(Boolean);
  }, [searchParams]);

  const repoQueries = useQueries({
    queries: repoNames.map(repo => {
      const [owner, name] = repo.split('/');
      return {
        ...createGetRepoDetails(owner, name),
        enabled: Boolean(owner && name),
      };
    })
  });

  const isLoading = repoQueries.some((query) => query.isLoading);
  const error = repoQueries.find((query) => query.isError)?.error ?? null;

  useEffect(() => {
    (() => {
      if (!searchParams.get('repos')) {
        setErrorMessage('No repositories selected for comparison. Please provide the ?repos= query parameter.');
      } else if (!repoNames || repoNames.length === 0) {
        setErrorMessage('Repository comparison parameter list is empty.')
      } else if (error && axios.isAxiosError(error)) {
        if ((error as AxiosError).status === 404) {
          setErrorMessage('Repo not found — check the username and repo name and try again.');
        } else if ((error as AxiosError).status === 403) {
          setErrorMessage('Rate limited by GitHub — try again after some time.');
        }
      } else {
        setErrorMessage('');
      }
    })();
  }, [error, searchParams, repoNames]);

  if (errorMessage) {
    return <ErrorBanner message={errorMessage} />
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  // Format dynamic raw timestamp to standardized legible viewing configuration
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const repos = repoQueries
    .map(res => res.data?.data)
    .filter(repo => !!repo);

  return (<>
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] p-8 font-sans antialiased selection:bg-[var(--accent)]/30">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Navigation Action Header Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-[var(--accent)] hover:underline focus:outline-none transition group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to search dashboard</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-elevated)] px-3 py-1.5 rounded-full border border-[var(--border)]">
            <BarChart2 className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Comparing <strong className="text-[var(--text-primary)]">{repos.length}</strong> items</span>
          </div>
        </div>

        {/* Dynamic Title Context Head */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Comparison Table
          </h1>
        </div>

        {/* Scannable Responsive Layout HTML Presentation Grid Matrix Table */}
        <div className="w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-[var(--bg-elevated-5)]/50 border-b border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] tracking-wide uppercase select-none">
                  <th className="py-4 px-5">Repo</th>
                  <th className="py-4 px-4 text-center">Stars</th>
                  <th className="py-4 px-4 text-center">Forks</th>
                  <th className="py-4 px-4 text-center">Open Issues</th>
                  <th className="py-4 px-5">Language</th>
                  <th className="py-4 px-5">License</th>
                  <th className="py-4 px-5">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/60 text-sm font-medium">
                {repos
                  .map((repo) => (
                    <tr
                      key={repo.id}
                      className="hover:bg-[var(--bg-elevated-5)]/30 transition-colors duration-150"
                    >
                      {/* Column 1: Repo Target Avatar Identity Label (External Link) */}
                      <td className="py-4 px-5 font-semibold text-[var(--text-primary)] whitespace-nowrap">
                        <a
                          href={`https://github.com/${repo.full_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 hover:text-[var(--accent)] focus:text-[var(--accent)] group outline-none transition"
                        >
                          <img
                            src={repo.owner.avatar_url}
                            alt={`${repo.full_name} profile avatar icon`}
                            className="w-6 h-6 rounded-md bg-[var(--border)]"
                          />
                          <span className="underline decoration-transparent group-hover:decoration-[var(--accent)] transition">
                            {repo.full_name}
                          </span>
                        </a>
                      </td>

                      {/* Column 2: Stars Performance Counter */}
                      <td className="py-4 px-4 text-center whitespace-nowrap text-[var(--text-primary)]">
                        <div className="inline-flex items-center gap-1.5 justify-center">
                          <Star className="w-3.5 h-3.5 text-[var(--yellow)] fill-[var(--yellow)]" />
                          <span>{repo.stargazers_count.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Column 3: Forks Cluster Count */}
                      <td className="py-4 px-4 text-center whitespace-nowrap text-[var(--text-muted)]">
                        <div className="inline-flex items-center gap-1.5 justify-center">
                          <GitFork className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                          <span>{repo.forks_count.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Column 4: Open Issues Target Tracking Count */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${repo.open_issues_count > 1000
                          ? 'bg-[var(--red-subtle)] text-[var(--red)]'
                          : 'bg-[var(--green-subtle)] text-[var(--green)]'
                          }`}>
                          <AlertCircle className="w-3 h-3" />
                          {repo.open_issues_count.toLocaleString()}
                        </span>
                      </td>

                      {/* Column 5: Predominant Language Base Node tag */}
                      <td className="py-4 px-5 whitespace-nowrap text-[var(--text-muted)]">
                        <div className="flex items-center gap-2">
                          <Code className="w-3.5 h-3.5 text-[var(--accent)]" />
                          <span>{repo.language || 'Unknown'}</span>
                        </div>
                      </td>

                      {/* Column 6: Registered License Legal Guard Struct */}
                      <td className="py-4 px-5 text-[var(--text-secondary)] whitespace-nowrap max-w-[160px] truncate">
                        <div className="flex items-center gap-2" title={(repo.license as Record<string, string>)?.name || 'Unlicensed'}>
                          <Shield className="w-3.5 h-3.5 shrink-0" />
                          <span>{(repo.license as Record<string, string>)?.name || 'None'}</span>
                        </div>
                      </td>

                      {/* Column 7: System Last Updated Entry Logs */}
                      <td className="py-4 px-5 text-[var(--text-secondary)] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(repo.updated_at)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </>)
}