import { Link } from "react-router";
import Logo from "./Logo";
import GithubTokenInput from "./GithubTokenInput";
import ToggleTheme from "./ToggleTheme";
import Auth from "./Auth";

export default function Header() {
  return (
    <header className="h-14 bg-[var(--bg-elevated-4)] border-b border-[var(--border)]/80 flex items-center">
      <div className="w-full max-w-6xl mx-auto p-6 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>

        {/* Right Side: Interactive Action Control Array */}
        <div className="flex items-center gap-4">
          <ToggleTheme />
          <GithubTokenInput />
          <Auth />
        </div>
      </div>
    </header>
  )
}