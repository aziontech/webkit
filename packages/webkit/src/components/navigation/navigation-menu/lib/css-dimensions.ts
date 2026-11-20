export interface CssDimensions {
  width: number
  height: number
}

export function getCssDimensions(element: HTMLElement): CssDimensions {
  const rect = element.getBoundingClientRect()
  const width = rect.width || element.offsetWidth
  const height = rect.height || element.offsetHeight

  return { width, height }
}
