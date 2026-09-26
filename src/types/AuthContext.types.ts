export type AuthState = {
  user: {
    username: string
  } | null,
}

export type SignInAction = {
  type: 'signin',
  payload: {
    username: string,
  },
}

export type SignOutAction = {
  type: 'signout',
}

export type AuthActions = SignInAction | SignOutAction;