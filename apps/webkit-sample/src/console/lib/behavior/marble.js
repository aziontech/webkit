export const MARBLE_SIZE = 80

const ELEMENTS = 3

const hashOf = (name) => {
  let hash = 0
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

const digitAt = (value, position) => Math.floor((value / 10 ** position) % 10)

const unit = (value, range, position) => {
  const magnitude = value % range
  if (position && digitAt(value, position) % 2 === 0) return -magnitude
  return magnitude
}

export function marbleElements(name, colorCount) {
  const seed = hashOf(name || '')
  return Array.from({ length: ELEMENTS }, (_, index) => {
    const value = seed * (index + 1)
    return {
      colorIndex: (seed + index) % colorCount,
      translateX: unit(value, MARBLE_SIZE / 10, 1),
      translateY: unit(value, MARBLE_SIZE / 10, 2),
      scale: 1.2 + unit(value, MARBLE_SIZE / 20) / 10,
      rotate: unit(value, 360, 1)
    }
  })
}

export const marbleTransform = (element) =>
  `translate(${element.translateX} ${element.translateY}) rotate(${element.rotate} ${
    MARBLE_SIZE / 2
  } ${MARBLE_SIZE / 2}) scale(${element.scale})`
