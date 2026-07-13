// CANARY — must keep failing prefer-const.
// `testId` is never reassigned, so it must be const.
export function testIdOf(attrs: Record<string, string | undefined>) {
  let testId = attrs['data-testid'] ?? 'actions-button'
  return testId
}
