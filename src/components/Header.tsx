import { Link } from "react-router";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className='h-14 bg-[#111827] border-b border-slate-800/80 flex items-center px-6'>
      <Link to="/">
        <Logo />
      </Link>
    </header>
  )
}