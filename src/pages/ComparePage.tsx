import { useSearchParams } from "react-router"
import ErrorBanner from "../components/ErrorBanner";
import { useEffect, useState } from "react";
import type { GitHubRepository } from "../types/github-api-response";
import { getRepoDetails } from "../helpers/github.api";
import LoadingSpinner from "../components/LoadingSpinner";
import { AlertCircle, ArrowLeft, BarChart2, Calendar, Code, GitFork, Shield, Star } from "lucide-react";

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const reposParam = searchParams.get('repos');
    const repoNames = reposParam?.split(',').map((name) => name.trim()).filter(Boolean);

    let timeout: ReturnType<typeof setTimeout>;
    (() => {
      if (!reposParam) {
        setStatus('error');
        setErrorMessage('No repositories selected for comparison. Please provide the ?repos= query parameter.');
        return;
      }
      if (repoNames && repoNames.length > 0) {
        timeout = setTimeout(async () => {
          try {
            setStatus('loading');
            const promises = [];
            for (const repo of repoNames) {
              const [owner, name] = repo.split('/');
              promises.push(
                getRepoDetails(owner, name),
              );
            }
            const results = await Promise.all(promises);
            const repos = await Promise.all(results.map(res => res.json()));
            setRepos(repos);
            setStatus('success');
          } catch (error) {
            if (error === 404) {
              setErrorMessage('Repo not found — check the username and repo name and try again.');
            } else if (error === 403) {
              setErrorMessage('Rate limited by GitHub — try again after some time.');
            } else {
              setErrorMessage('Something went wrong - try again after some time.');
            }
            setStatus('error');
          }
        }, 50);
      } else {
        setStatus('error');
        setErrorMessage('Repository comparison parameter list is empty.')
      }
    })()

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }, [searchParams]);

  if (status === 'error') {
    return <ErrorBanner message={errorMessage} />
  }

  if (status === 'loading') {
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

  return (<>
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-8 font-sans antialiased selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Navigation Action Header Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-[#58a6ff] hover:underline focus:outline-none transition group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to search dashboard</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#8b949e] bg-[#161b22] px-3 py-1.5 rounded-full border border-[#30363d]">
            <BarChart2 className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>Comparing <strong className="text-[#f0f6fc]">{repos.length}</strong> items</span>
          </div>
        </div>

        {/* Dynamic Title Context Head */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#f0f6fc]">
            Comparison Table
          </h1>
        </div>

        {/* Scannable Responsive Layout HTML Presentation Grid Matrix Table */}
        <div className="w-full overflow-hidden rounded-xl border border-[#30363d] bg-[#161b22] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-[#21262d]/50 border-b border-[#30363d] text-xs font-semibold text-[#8b949e] tracking-wide uppercase select-none">
                  <th className="py-4 px-5">Repo</th>
                  <th className="py-4 px-4 text-center">Stars</th>
                  <th className="py-4 px-4 text-center">Forks</th>
                  <th className="py-4 px-4 text-center">Open Issues</th>
                  <th className="py-4 px-5">Language</th>
                  <th className="py-4 px-5">License</th>
                  <th className="py-4 px-5">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]/60 text-sm font-medium">
                {repos.map((repo) => (
                  <tr
                    key={repo.id}
                    className="hover:bg-[#21262d]/30 transition-colors duration-150"
                  >
                    {/* Column 1: Repo Target Avatar Identity Label (External Link) */}
                    <td className="py-4 px-5 font-semibold text-[#f0f6fc] whitespace-nowrap">
                      <a
                        href={`https://github.com/${repo.full_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:text-[#58a6ff] focus:text-[#58a6ff] group outline-none transition"
                      >
                        <img
                          src={repo.owner.avatar_url}
                          alt={`${repo.full_name} profile avatar icon`}
                          className="w-6 h-6 rounded-md bg-[#30363d]"
                        />
                        <span className="underline decoration-transparent group-hover:decoration-[#58a6ff] transition">
                          {repo.full_name}
                        </span>
                      </a>
                    </td>

                    {/* Column 2: Stars Performance Counter */}
                    <td className="py-4 px-4 text-center whitespace-nowrap text-[#f0f6fc]">
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        <Star className="w-3.5 h-3.5 text-[#f1e05a] fill-[#f1e05a]/10" />
                        <span>{repo.stargazers_count.toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Column 3: Forks Cluster Count */}
                    <td className="py-4 px-4 text-center whitespace-nowrap text-[#c9d1d9]">
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        <GitFork className="w-3.5 h-3.5 text-[#8b949e]" />
                        <span>{repo.forks_count.toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Column 4: Open Issues Target Tracking Count */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${repo.open_issues_count > 1000
                        ? 'bg-[#f85149]/10 text-[#f85149]'
                        : 'bg-green-500/10 text-green-400'
                        }`}>
                        <AlertCircle className="w-3 h-3" />
                        {repo.open_issues_count.toLocaleString()}
                      </span>
                    </td>

                    {/* Column 5: Predominant Language Base Node tag */}
                    <td className="py-4 px-5 whitespace-nowrap text-[#c9d1d9]">
                      <div className="flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-[#58a6ff]" />
                        <span>{repo.language || 'Unknown'}</span>
                      </div>
                    </td>

                    {/* Column 6: Registered License Legal Guard Struct */}
                    <td className="py-4 px-5 text-[#8b949e] whitespace-nowrap max-w-[160px] truncate">
                      <div className="flex items-center gap-2" title={(repo.license as Record<string, string>)?.name || 'Unlicensed'}>
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span>{(repo.license as Record<string, string>)?.name || 'None'}</span>
                      </div>
                    </td>

                    {/* Column 7: System Last Updated Entry Logs */}
                    <td className="py-4 px-5 text-[#8b949e] whitespace-nowrap">
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