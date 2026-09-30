import { useEffect, useReducer, type ReactNode } from "react";
import { AuthDispatchContext, authReducer, AuthStateContext, initialAuthState } from "./AuthContext";

type AuthProviderProps = {
  children: ReactNode;
}

const AUTH_STORE_NAME = 'reporadar-auth-username';

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const username = localStorage.getItem(AUTH_STORE_NAME);
    if (username) {
      dispatch({
        type: 'signin',
        payload: {
          username,
        }
      });
    }
  }, []);

  useEffect(() => {
    if (state.user?.username) {
      localStorage.setItem(AUTH_STORE_NAME, state.user?.username);
    } else {
      localStorage.setItem(AUTH_STORE_NAME, '');
    }
  }, [state]);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}