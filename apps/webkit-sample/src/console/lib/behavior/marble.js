// Marble avatar geometry — deterministic generated art from a name.
//
// Two blurred blobs over a flat field, each translated / rotated / scaled by
// numbers derived from the name itself. Same name in, same picture out, on
// every device and every reload — so an organization's mark is stable without
// anyone uploading a logo, and two orgs are told apart by shape as well as by
// hue. The paths and the blur are the boring-avatars "marble" shape; the
// arithmetic below is the same idea rewritten here rather than pulling in a
// dependency for forty lines of math (see .claude/rules/dependencies.md).
//
// Colours are NOT decided here: this module returns geometry plus a palette
// INDEX per element, and the caller supplies the palette (the organization's
// accent, in theme tokens). That split is what keeps the art theme-aware.

// The canvas the paths were drawn on. Everything scales from it, so the avatar
// renders at any pixel size from the one viewBox.
export const MARBLE_SIZE = 80

// One field + two blobs.
const ELEMENTS = 3

// A stable 32-bit hash of the name — the single seed every number below comes
// from. (Same shape as Java's String.hashCode; cheap and well-spread for the
// short strings we feed it.)
const hashOf = (name) => {
  let hash = 0
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

// The nth decimal digit of a number — used as a coin flip, so a value can go
// negative without needing a second seed.
const digitAt = (value, position) => Math.floor((value / 10 ** position) % 10)

// A value inside `range`, signed by the digit at `position` (when given).
const unit = (value, range, position) => {
  const magnitude = value % range
  if (position && digitAt(value, position) % 2 === 0) return -magnitude
  return magnitude
}

/**
 * Geometry for one marble avatar.
 *
 * @param {string} name Whatever identifies the subject (an org name).
 * @param {number} colorCount How many colours the caller's palette holds.
 * @returns {{ colorIndex: number, translateX: number, translateY: number, scale: number, rotate: number }[]}
 *   One entry per element: [0] is the flat field (colour only), [1] and [2] are
 *   the blobs.
 */
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

// The SVG transform for a blob, in the order the shape was authored: move,
// spin about the centre, then grow.
export const marbleTransform = (element) =>
  `translate(${element.translateX} ${element.translateY}) rotate(${element.rotate} ${
    MARBLE_SIZE / 2
  } ${MARBLE_SIZE / 2}) scale(${element.scale})`
