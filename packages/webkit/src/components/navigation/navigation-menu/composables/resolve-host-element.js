/**
 * @param {unknown} target
 * @returns {HTMLElement | null}
 */
export function resolveHostElement(target) {
  if (!target) {
    return null
  }

  if (target instanceof HTMLElement) {
    return target
  }

  if (typeof target === 'object' && target !== null && '$el' in target) {
    const element = /** @type {{ $el?: unknown }} */ (target).$el
    return element instanceof HTMLElement ? element : null
  }

  return null
}
