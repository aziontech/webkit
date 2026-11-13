export function resolveHostElement(target: unknown): HTMLElement | null {
  if (!target) {
    return null
  }

  if (target instanceof HTMLElement) {
    return target
  }

  if (typeof target === 'object' && '$el' in target) {
    const element = (target as { $el?: unknown }).$el
    return element instanceof HTMLElement ? element : null
  }

  return null
}
