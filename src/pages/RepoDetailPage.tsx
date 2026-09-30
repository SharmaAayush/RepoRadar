import { useLoaderData, useParams } from "react-router"
import Markdown from 'react-markdown';
import { AlertCircle, GitFork, Star } from "lucide-react";
import { LANGUAGE_COLOR_MAP } from "../consts/language-colors";
import type { repoLoader } from "../loaders/repoLoader";

export default function RepoDetailPage() {
  const { repo, languages, readme } = useLoaderData<typeof repoLoader>();
  const { owner, name } = useParams();

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

  return (<div className="space-y-3">
    {/* Repository Header */}
    <h1 className="text-2xl font-semibold tracking-wide text-[var(--text-primary)]">
      {owner}/<span className="font-bold">{name}</span>
    </h1>

    {/* Repository Stats */}
    <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--text-secondary)]">
      <div className="flex items-center gap-1.5 hover:text-[var(--accent)] cursor-pointer transition">
        <Star className="w-4 h-4 text-[var(--yellow)] fill-[var(--yellow)]" />
        <span className="font-medium text-[var(--text-primary)]">{repo?.stargazers_count}</span>
      </div>
      <div className="flex items-center gap-1.5 hover:text-[var(--accent)] cursor-pointer transition">
        <GitFork className="w-4 h-4 text-[var(--text-secondary)]" />
        <span className="font-medium text-[var(--text-primary)]">{repo?.forks_count}</span>
      </div>
      <div className="flex items-center gap-1.5 hover:text-[var(--red)] cursor-pointer transition">
        <AlertCircle className="w-4 h-4" />
        <span>Open issues:</span>
        <span className="font-medium text-[var(--text-primary)]">{repo?.open_issues_count}</span>
      </div>
    </div>

    {/* Content Cards Grid */}
    <div className="grid grid-cols-1 gap-4">

      {/* Languages Card */}
      {languages &&
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--text-secondary)] transition-colors duration-200 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">
              Languages
            </h2>

            {/* Multi-colored Progress Bar */}
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-[var(--border)]">
              {languagesMap.map(language => {
                return <div
                  key={language.name}
                  className={`h-full bg-[${language.color}]`}
                  style={{ width: `${language.percentage}%`, backgroundColor: language.color }}
                  title={`${language.name}: ${language.percentage}%`}
                />
              })}
            </div>

            {/* Language Legends */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs font-medium">
              {languagesMap.map(language => {
                return <div key={language.name} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full bg-[${language.color}]`} style={{ backgroundColor: language.color }} />
                  <span className="text-[var(--text-primary)]">{language.name} <span className="text-[var(--text-secondary)] font-normal">{language.percentage}%</span></span>
                </div>
              })}
            </div>
          </div>
        </div>
      }

      {/* README Card */}
      {readme &&
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--text-secondary)] transition-colors duration-200">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">
            README.md
          </h2>
          <article className="text-sm leading-relaxed text-[var(--text-secondary)] antialiased prose dark:prose-invert max-w-none">
            <Markdown>{readme}</Markdown>
          </article>
        </div>
      }
    </div>

  </div>)
}