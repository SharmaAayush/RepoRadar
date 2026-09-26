import { ArrowLeft } from "lucide-react";
import { Link, Outlet } from "react-router";

export default function RepoDetailLayout() {
  return (<>
    {/* Navigation Link */}
    <Link to='/'>
      <button className="flex items-center gap-2 text-sm text-[#58a6ff] hover:underline focus:outline-none transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to search</span>
      </button>
    </Link>
    <Outlet />
  </>)
}