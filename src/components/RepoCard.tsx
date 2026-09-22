import type { Repo } from "../types/repo";

export default function RepoCard({
  full_name,
  description,
  language,
  language_color_class,
  forks_count,
  stargazers_count,
}: Repo) {
  return (
    <div className="bg-[#161e2e] rounded-xl border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700/85 transition shadow-sm">
      <div className="space-y-2">
        <h3 className="font-semibold text-slate-100 text-base">{full_name}</h3>
        <p className="text-sm text-slate-400 line-clamp-2">{description}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          {language_color_class && (
            <span className={`w-2.5 h-2.5 rounded-full ${language_color_class} inline-block`}></span>
          )}
          <span>{language}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="text-yellow-500">★</span> {stargazers_count}</span>
          <span className="flex items-center gap-1"><span className=" text-slate-500">⑂</span> {forks_count}</span>
        </div>
      </div>
    </div>
  )
}