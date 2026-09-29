import { Link } from "react-router";
import Logo from "./Logo";
import GithubTokenInput from "./GithubTokenInput";

export default function Header() {
  return (
    <header className='h-14 bg-[#111827] border-b border-slate-800/80 flex items-center'>
      <div className="w-full max-w-6xl mx-auto p-6 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <GithubTokenInput />
      </div>
    </header>
  )
}