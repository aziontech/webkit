// CANARY — must keep failing no-console (only warn/error are allowed).
export function onSubmit(payload: { name: string }) {
  console.log('payload', payload)
  return payload
}
