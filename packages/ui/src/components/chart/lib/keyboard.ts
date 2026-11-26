export const STEP_FORWARD = ['ArrowRight', 'ArrowDown'] as const
export const STEP_BACKWARD = ['ArrowLeft', 'ArrowUp'] as const

export function stepIndex(
  key: string,
  current: number | null,
  last: number,
  forward: readonly string[],
  backward: readonly string[]
): number | undefined {
  if (forward.includes(key)) return current === null ? 0 : Math.min(last, current + 1)
  if (backward.includes(key)) return current === null ? last : Math.max(0, current - 1)
  if (key === 'Home') return 0
  if (key === 'End') return last
  return undefined
}
