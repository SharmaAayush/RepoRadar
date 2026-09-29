import { Key, X, ArrowRight } from "lucide-react";
import { useGithubTokenStore } from "../store/githubTokenStore";

export default function GithubTokenInput() {
  const token = useGithubTokenStore((s) => s.token);
  const setToken = useGithubTokenStore((s) => s.setToken);
  const clearToken = useGithubTokenStore((s) => s.clearToken);

  if (token) {
    return (
      <div className="flex items-center gap-2 bg-[#161b22] border border-[#238636]/40 rounded-lg px-3 py-1.5 text-xs text-[#8b949e]">
        <Key className="w-3.5 h-3.5 text-[#238636]" />
        <span>Token set</span>
        <button
          onClick={clearToken}
          className="hover:text-[#f85149] transition-colors"
          title="Clear token"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setToken(formData.get("token") as string);
      }}
      className="flex items-center gap-1.5"
    >
      <input
        name="token"
        type="password"
        placeholder="GitHub token (optional)"
        className="bg-[#0d1117] border border-[#30363d] text-[#f0f6fc] text-xs rounded-lg px-3 py-1.5 w-44 focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/50 focus:border-[#58a6ff]"
      />
      <button
        type="submit"
        className="bg-[#238636] hover:bg-[#2ea043] text-white p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2ea043]/50"
        title="Save token"
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}