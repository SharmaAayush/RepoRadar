import { ShieldAlert, UserCheck } from "lucide-react";
import { useAuthDispatch } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router";
import Logo from "../components/Logo";

export default function LoginPage() {
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  function handleDemoSignIn() {
    dispatch({
      type: 'signin',
      payload: {
        username: 'demo-user',
      },
    });

    navigate('/favorites');
  }

  return (<>
    {/* Central Login Card Container */}
    <div className="m-auto max-w-md w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-[var(--text-secondary)]">

      {/* Subtle Decorative Ambient Gradient Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--accent)]/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[var(--yellow)]/5 blur-3xl rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="text-center space-y-4 mb-4">
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
            Sign in to <Logo showSubText={false} showIcon={false} />
          </h1>
          <p className="text-xs text-[var(--text-secondary)] max-w-[280px] mx-auto leading-relaxed">
            Explore features instantly through the demo user.
          </p>
        </div>

        {/* Action Button Container */}
        <div className="space-y-4">
          <button
            onClick={handleDemoSignIn}
            className="w-full flex items-center justify-center gap-3 bg-[var(--green)] hover:bg-[var(--green-hover)] text-white font-medium text-sm py-3 px-4 rounded-xl shadow-md transform active:scale-[0.99] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--green-hover)]/50"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sign in as demo user</span>
          </button>
        </div>

        {/* Notice Info Segment */}
        <div className="mt-6 flex items-start gap-2.5 bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-xl p-3.5 text-xs text-[var(--text-secondary)] leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
          <p>
            No authentication forms or credentials required. Clicking the option grants access under global defaults.
          </p>
        </div>

      </div>
    </div>
  </>)
}