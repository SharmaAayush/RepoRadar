import { Key, X, ArrowRight } from "lucide-react";
import { useGithubTokenStore } from "../store/githubTokenStore";

export default function GithubTokenInput() {
  const token = useGithubTokenStore((s) => s.token);
  const setToken = useGithubTokenStore((s) => s.setToken);
  const clearToken = useGithubTokenStore((s) => s.clearToken);

  if (token) {
    return (
      <div className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--green)]/40 rounded-lg px-3 py-1.5 text-xs text-[var(--text-secondary)]">
        <Key className="w-3.5 h-3.5 text-[var(--green)]" />
        <span>Token set</span>
        <button
          onClick={clearToken}
          className="hover:text-[var(--red)] transition-colors"
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
        className="bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)] text-xs rounded-lg px-3 py-1.5 w-44 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]"
      />
      <button
        type="submit"
        className="bg-[var(--green)] hover:bg-[var(--green-hover)] text-white p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--green-hover)]/50"
        title="Save token"
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}