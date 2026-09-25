export type AuthenticationState =
  | "authenticated"
  | "unauthenticated"

export interface AuthenticationResult<T = null> {
  state: AuthenticationState
  data: T
}

export function authenticated<T>(
  data: T
): AuthenticationResult<T> {
  return {
    state: "authenticated",
    data,
  }
}

export function unauthenticated(): AuthenticationResult<null> {
  return {
    state: "unauthenticated",
    data: null,
  }
}