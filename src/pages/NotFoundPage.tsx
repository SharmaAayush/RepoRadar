import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (<>
    {/* Navigation Link */}
    <Link to='/'>
      <button className="flex items-center gap-2 text-sm text-[var(--accent)] hover:underline focus:outline-none transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Go home</span>
      </button>
    </Link>



    {/* Main 404 Content Container */}
    <div className="max-w-md w-full mx-auto my-auto text-center space-y-8 py-12">
      {/* Visual Graphic Element */}
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute inset-0 bg-[var(--red)]/10 blur-2xl rounded-full w-28 h-28 mx-auto" />
        <div className="relative bg-[var(--bg-elevated)] border border-[var(--border)] p-5 rounded-2xl shadow-xl">
          <AlertTriangle className="w-12 h-12 text-[var(--red)]" />
        </div>
      </div>

      {/* Text Details */}
      <div className="space-y-3">
        <h1 className="text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
          404
        </h1>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Repository or page not found
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      {/* Action Options Grid */}
      <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto pt-2">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-[var(--bg-elevated-5)] text-[var(--text-muted)] border border-[var(--border)] hover:bg-[var(--bg-elevated-6)] hover:border-[var(--text-secondary)] px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
        >
          <Home className="w-4 h-4" />
          Go to Home
        </Link>
      </div>
    </div>
  </>)
}