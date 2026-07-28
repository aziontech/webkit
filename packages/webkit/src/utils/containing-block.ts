/**
 * A `position: fixed` element is positioned against the viewport *unless* an
 * ancestor establishes a containing block (a transform, filter, perspective,
 * `will-change`, `contain`, or a container query). When one does, the `top` /
 * `left` we write are interpreted in that ancestor's own, possibly scaled,
 * coordinate space — so viewport coordinates read from `getBoundingClientRect()`
 * would be transformed a second time and the panel lands off-target.
 *
 * Storybook does exactly this: its zoom control applies a `transform: scale()`
 * to the preview iframe's `body`, which is also the Teleport target for every
 * overlay panel in the package.
 */

/** Offset and scale of the frame a fixed-position element is laid out against. */
export interface FixedFrame {
  /** Left edge of the frame, in viewport pixels. */
  left: number
  /** Top edge of the frame, in viewport pixels. */
  top: number
  /** Horizontal scale the frame applies to its children. Never 0. */
  scaleX: number
  /** Vertical scale the frame applies to its children. Never 0. */
  scaleY: number
}

const IDENTITY: FixedFrame = { left: 0, top: 0, scaleX: 1, scaleY: 1 }

const establishesContainingBlock = (style: globalThis.CSSStyleDeclaration): boolean =>
  style.transform !== 'none' ||
  style.perspective !== 'none' ||
  style.filter !== 'none' ||
  style.backdropFilter !== 'none' ||
  /transform|perspective|filter/.test(style.willChange) ||
  /paint|layout|strict|content/.test(style.contain) ||
  style.containerType !== 'normal'

/**
 * Resolves the frame a fixed-position `panel` is laid out against. Returns the
 * identity frame when that frame is the viewport, so callers can apply the same
 * arithmetic unconditionally.
 */
export const getFixedFrame = (panel: globalThis.HTMLElement | null | undefined): FixedFrame => {
  if (!panel || typeof globalThis.getComputedStyle !== 'function') return IDENTITY
  let node = panel.parentElement
  while (node) {
    if (establishesContainingBlock(globalThis.getComputedStyle(node))) {
      const rect = node.getBoundingClientRect()
      return {
        left: rect.left,
        top: rect.top,
        scaleX: node.offsetWidth > 0 ? rect.width / node.offsetWidth : 1,
        scaleY: node.offsetHeight > 0 ? rect.height / node.offsetHeight : 1
      }
    }
    node = node.parentElement
  }
  return IDENTITY
}
