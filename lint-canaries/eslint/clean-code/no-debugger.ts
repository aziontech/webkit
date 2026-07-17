// CANARY — must keep failing no-debugger.
export function paginate(page: number) {
  debugger
  return page + 1
}
