import { useEffect, useState } from "react";
import { Link, useParams } from "react-router"
import Markdown from 'react-markdown';
import { getRepoDetails, getRepoLanguages, getRepoReadme } from "../helpers/github.api";
import type { GitHubRepository } from "../types/github-api-response";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import { AlertCircle, ArrowLeft, GitFork, Star } from "lucide-react";
import { LANGUAGE_COLOR_MAP } from "../consts/language-colors";

export default function RepoDetailPage() {
  const { owner, name } = useParams();
  const [repo, setRepo] = useState<GitHubRepository | null>(null);
  const [languages, setLanguages] = useState<[string, number][] | null>(null);
  const [readme, setReadme] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const languagesTotal = languages ? languages.reduce((accumulator, current) => accumulator + current[1], 0) : 0;
  const languagesMap = (languages || []).map(lan => {
    const languageName = lan[0] as keyof typeof LANGUAGE_COLOR_MAP;
    return {
      name: languageName,
      count: lan[1],
      percentage: ((lan[1] / languagesTotal) * 100).toFixed(2),
      color: LANGUAGE_COLOR_MAP[languageName],
    }
  });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (owner && name) {
      timeout = setTimeout(async () => {
        setStatus('loading');
        try {
          if (!owner || !name) {
            return;
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
          setRepo(repo);
          setLanguages(languagesEntries);
          setReadme(readme);
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
    }
    return () => {
      clearTimeout(timeout);
    }
  }, [name, owner]);

  let mainContent;
  switch (true) {
    case status === 'loading':
      mainContent = <LoadingSpinner />
      break;
    case status === 'error':
      mainContent = <ErrorBanner message={errorMessage} />
      break;
    default:
      mainContent = <>

        <div className="space-y-3">
          {/* Repository Header */}
          <h1 className="text-2xl font-semibold tracking-wide text-[#f0f6fc]">
            {owner}/<span className="font-bold">{name}</span>
          </h1>

          {/* Repository Stats */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#8b949e]">
            <div className="flex items-center gap-1.5 hover:text-[#58a6ff] cursor-pointer transition">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-[#f0f6fc]">{repo?.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-[#58a6ff] cursor-pointer transition">
              <GitFork className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-[#f0f6fc]">{repo?.forks_count}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-[#f85149] cursor-pointer transition">
              <AlertCircle className="w-4 h-4" />
              <span>Open issues:</span>
              <span className="font-medium text-[#f0f6fc]">{repo?.open_issues_count}</span>
            </div>
          </div>

          {/* Content Cards Grid */}
          <div className="grid grid-cols-1 gap-4">

            {/* Languages Card */}
            {languages &&
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#8b949e] transition-colors duration-200 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#f0f6fc] mb-4">
                    Languages
                  </h2>

                  {/* Multi-colored Progress Bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#30363d]">
                    {languagesMap.map(language => {
                      return <div
                        key={language.name}
                        className={`h-full bg-[${language.color}]`}
                        style={{ width: `${language.percentage}%`, backgroundColor: language.color }}
                        title={`${language.name}: ${language.percentage}%`}
                      />
                    })}
                  </div>
                </div>

                {/* Language Legends */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs font-medium">
                  {languagesMap.map(language => {
                    return <div key={language.name} className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full bg-[${language.color}]`} style={{ backgroundColor: language.color }} />
                      <span className="text-[#f0f6fc]">{language.name} <span className="text-[#8b949e] font-normal">{language.percentage}%</span></span>
                    </div>
                  })}
                </div>
              </div>
            }

            {/* README Card */}
            {readme &&
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#8b949e] transition-colors duration-200">
                <h2 className="text-base font-semibold text-[#f0f6fc] mb-3">
                  README.md
                </h2>
                <article className="text-sm leading-relaxed text-[#8b949e] antialiased prose dark:prose-invert max-w-none">
                  <Markdown>{readme}</Markdown>
                </article>
              </div>
            }
          </div>

        </div>
      </>;
      break;
  }

  return (<>
    {/* Navigation Link */}
    <Link to='/'>
      <button className="flex items-center gap-2 text-sm text-[#58a6ff] hover:underline focus:outline-none transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to search</span>
      </button>
    </Link>
    {mainContent}
  </>)
}