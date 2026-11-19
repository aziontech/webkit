export type GraphicOnTexture = {
  graphic: string
  texture: string
  area: number
}

export type TextureBackdropSelectors = {
  textures: string
  graphics: string
}

export function findGraphicsOnTexture(
  selectors: TextureBackdropSelectors = {
    textures: '[data-slot="texture"]',
    graphics: '[data-plain-ground]'
  }
): GraphicOnTexture[] {
  const MIN_AREA = 64

  const painted = (element: Element) => {
    if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false
    const rect = element.getBoundingClientRect()
    return rect.width >= 1 && rect.height >= 1
  }

  const name = (element: Element) =>
    element.getAttribute('data-testid') ?? element.tagName.toLowerCase()

  const textures = [...document.querySelectorAll(selectors.textures)].filter(
    (texture) => texture.getAttribute('data-variant') !== 'none' && painted(texture)
  )
  const graphics = [...document.querySelectorAll(selectors.graphics)].filter(
    (graphic) => painted(graphic) && !graphic.parentElement?.closest(selectors.graphics)
  )

  const found: GraphicOnTexture[] = []
  for (const graphic of graphics) {
    const box = graphic.getBoundingClientRect()
    for (const texture of textures) {
      const ground = graphic.closest('[data-opaque]')
      if (ground && !ground.contains(texture)) continue
      const layer = texture.getBoundingClientRect()
      const width = Math.min(box.right, layer.right) - Math.max(box.left, layer.left)
      const height = Math.min(box.bottom, layer.bottom) - Math.max(box.top, layer.top)
      if (width <= 0 || height <= 0 || width * height < MIN_AREA) continue
      found.push({ graphic: name(graphic), texture: name(texture), area: Math.round(width * height) })
    }
  }
  return found
}
