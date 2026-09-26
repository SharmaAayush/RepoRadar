import { createContext, type Dispatch, useContext } from "react";
import type { AuthActions, AuthState } from "../../types/AuthContext.types";

export const initialAuthState: AuthState = {
  user: null,
};

export function authReducer(state: AuthState, action: AuthActions): AuthState {
  switch (action.type) {
    case 'signin':
      return {
        ...state,
        user: {
          username: action.payload.username,
        }
      }
    case 'signout':
      return {
        ...state,
        user: null,
      }
    default:
      return {
        ...state,
      }
  }
}

export const AuthStateContext = createContext<AuthState | undefined>(undefined);
export const AuthDispatchContext = createContext<Dispatch<AuthActions> | undefined>(undefined);

export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  return context;
}
