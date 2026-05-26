/**
 * Navigation Menu animation tokens (aligned with Base UI hero demo).
 * @see https://github.com/mui/base-ui/blob/d81ec002/docs/src/app/(docs)/react/components/navigation-menu/demos/hero/css-modules/index.module.css
 */

import {
  NAVIGATION_MENU_CLOSE_DURATION_MS,
  NAVIGATION_MENU_DURATION_MS,
  NAVIGATION_MENU_EASING
} from '../composables/navigation-menu-css-vars.js'

export { NAVIGATION_MENU_CLOSE_DURATION_MS, NAVIGATION_MENU_DURATION_MS, NAVIGATION_MENU_EASING }

const STARTING_STYLE_ATTR = 'data-starting-style'
const ENDING_STYLE_ATTR = 'data-ending-style'

/** Tailwind class groups for popup / positioner / content (use on component roots). */
export const navigationMenuTransitionClasses = {
  positioner:
    'transition-[top,left,right,bottom,width,height] duration-slow-01 ease-productive-entrance data-[instant]:transition-none data-[starting-style]:transition-none',
  popup:
    'w-[var(--popup-width,auto)] h-[var(--popup-height,auto)] transition-[opacity,transform,width,height] duration-slow-01 ease-productive-entrance data-[starting-style]:-translate-y-2 data-[starting-style]:opacity-0 data-[starting-style]:transition-none data-[ending-style]:-translate-y-2 data-[ending-style]:opacity-0 data-[ending-style]:transition-[opacity,transform]',
  content:
    'box-border transition-[opacity,transform] duration-slow-01 ease-productive-entrance data-[starting-style]:opacity-0 data-[starting-style]:transition-none data-[ending-style]:opacity-0 data-[starting-style]:data-[activation-direction=left]:-translate-x-1/2 data-[starting-style]:data-[activation-direction=right]:translate-x-1/2 data-[starting-style]:data-[activation-direction=up]:-translate-y-1/2 data-[starting-style]:data-[activation-direction=down]:translate-y-1/2 data-[ending-style]:data-[activation-direction=left]:translate-x-1/2 data-[ending-style]:data-[activation-direction=right]:-translate-x-1/2 data-[ending-style]:data-[activation-direction=up]:translate-y-1/2 data-[ending-style]:data-[activation-direction=down]:-translate-y-1/2',
  viewport: 'relative h-full w-full overflow-hidden'
}

export const PRESET_IDS = {
  POPUP_MORPH: 'popup.morph',
  CONTENT_DIRECTIONAL: 'content.directional',
  INSTANT: 'instant'
}

/**
 * @param {number} ms
 */
function delay(ms) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms)
  })
}

/**
 * Wait for one or more animation frames (paint before exit styles apply).
 * @param {number} [frameCount]
 */
export function waitForAnimationFrames(frameCount = 1) {
  return new Promise((resolve) => {
    let remaining = frameCount

    const step = () => {
      remaining -= 1

      if (remaining <= 0) {
        resolve(undefined)
        return
      }

      globalThis.requestAnimationFrame(step)
    }

    globalThis.requestAnimationFrame(step)
  })
}

/**
 * @param {Element} element
 * @param {string} attribute
 * @param {(present: boolean) => boolean} predicate
 * @param {number} [timeoutMs]
 */
function waitForDataAttribute(
  element,
  attribute,
  predicate,
  timeoutMs = NAVIGATION_MENU_DURATION_MS * 2
) {
  if (predicate(element.hasAttribute(attribute))) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const observer = new globalThis.MutationObserver(() => {
      if (predicate(element.hasAttribute(attribute))) {
        cleanup()
        resolve(undefined)
      }
    })

    const cleanup = () => {
      observer.disconnect()
      globalThis.clearTimeout(timeoutId)
    }

    observer.observe(element, {
      attributes: true,
      attributeFilter: [attribute]
    })

    const timeoutId = globalThis.setTimeout(() => {
      cleanup()
      resolve(undefined)
    }, timeoutMs)
  })
}

/**
 * Wait for Web Animations API on an element (Base UI open-change-complete pattern).
 * @param {Element | null | undefined} element
 */
export async function waitForElementAnimations(element) {
  if (!element || typeof element.getAnimations !== 'function') {
    return
  }

  const animations = element.getAnimations()
  await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)))
}

/**
 * Mirrors Base UI useAnimationsFinished on open — wait for starting-style removal, then animations.
 * @param {Element | null | undefined} element
 */
export async function waitForOpenTransition(element) {
  if (!element) {
    await delay(NAVIGATION_MENU_DURATION_MS)
    return
  }

  await waitForDataAttribute(element, STARTING_STYLE_ATTR, (present) => !present)
  await waitForAnimationFrames(1)

  await Promise.all([delay(NAVIGATION_MENU_DURATION_MS), waitForElementAnimations(element)])
}

/**
 * Mirrors Base UI close flow — wait for ending-style, paint, then run exit animations fully.
 * @param {Element | null | undefined} element
 */
export async function waitForCloseTransition(element) {
  if (!element) {
    await delay(NAVIGATION_MENU_DURATION_MS)
    return
  }

  await waitForDataAttribute(element, ENDING_STYLE_ATTR, (present) => present)
  await waitForAnimationFrames(1)

  await Promise.all([delay(NAVIGATION_MENU_DURATION_MS), waitForElementAnimations(element)])
}
