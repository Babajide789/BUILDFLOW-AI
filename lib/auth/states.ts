export type AuthorizationState =
  | "authorized"
  | "unauthenticated"
  | "organization-not-found"
  | "membership-not-found"
  | "membership-suspended"
  | "permission-denied"
  | "resource-not-found"

export interface AuthorizationResult<T = null> {
  state: AuthorizationState
  data: T
}

export function authorized<T>(data: T): AuthorizationResult<T> {
  return {
    state: "authorized",
    data,
  }
}

export function unauthorized(
  state:
    | Exclude<AuthorizationState, "authorized">
): AuthorizationResult<null> {
  return {
    state,
    data: null,
  }
}