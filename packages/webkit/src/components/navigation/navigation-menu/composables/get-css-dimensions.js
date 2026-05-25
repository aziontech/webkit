/**
 * @param {HTMLElement} element
 */
export function getCssDimensions(element) {
  const rect = element.getBoundingClientRect()
  const width = rect.width || element.offsetWidth
  const height = rect.height || element.offsetHeight

  return { width, height }
}
