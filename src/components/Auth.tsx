import { LogOut, UserRoundArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthDispatch, useAuthState } from "../context/Auth/AuthContext";

export default function Auth() {
  const state = useAuthState();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  const isLoggedIn = state.user?.username;

  function signout() {
    dispatch({
      type: 'signout',
    });
  }

  function signin() {
    navigate('/login');
  }

  return (
    <>
      {isLoggedIn ? (
        <button
          onClick={signout}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-[var(--bg-elevated-3)] hover:bg-[var(--bg-elevated-6)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] shadow-sm focus:outline-none transition group relative overflow-hidden"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={signin}
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-[var(--bg-elevated-3)] hover:bg-[var(--bg-elevated-6)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] shadow-sm focus:outline-none transition group relative overflow-hidden"
          title="Login"
        >
          <UserRoundArrowLeft className="w-4 h-4" />
        </button>
      )}
    </>
  );
}