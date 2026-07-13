// CANARY — must keep failing @typescript-eslint/no-explicit-any.
// `any` turns the type checker off for everything it touches.
export function normalize(value: any) {
  return value.trim()
}
