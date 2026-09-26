import { Navigate } from "react-router";
import { useAuthState } from "../context/Auth/AuthContext";
import type { ReactNode } from "react";

export type ProtectedRouteProps = {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const state = useAuthState();

  const userName = state.user?.username || '';

  return (<>
    {!userName && <Navigate to="/login" replace />}
    {userName && children}
  </>)
}