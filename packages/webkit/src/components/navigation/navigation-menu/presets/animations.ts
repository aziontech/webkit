import { NAVIGATION_MENU_DURATION_MS } from '../composables/navigation-menu-css-vars'

const STARTING_STYLE_ATTR = 'data-starting-style'
const ENDING_STYLE_ATTR = 'data-ending-style'

export const navigationMenuTransitionClasses: Record<
  'positioner' | 'popup' | 'content' | 'viewport',
  string
> = {
  positioner:
    'transition-[transform] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none data-[instant]:transition-none data-[starting-style]:transition-none',
  popup:
    'w-[var(--popup-width,auto)] h-[var(--popup-height,auto)] [transform-origin:var(--popup-origin,top_left)] transition-[opacity,scale,width,height] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[starting-style]:transition-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:transition-[opacity,scale]',
  content:
    'box-border transition-[opacity,translate] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none data-[starting-style]:opacity-0 data-[starting-style]:transition-none data-[ending-style]:opacity-0 data-[starting-style]:data-[activation-direction=left]:-translate-x-6 data-[starting-style]:data-[activation-direction=right]:translate-x-6 data-[starting-style]:data-[activation-direction=up]:-translate-y-6 data-[starting-style]:data-[activation-direction=down]:translate-y-6 data-[ending-style]:data-[activation-direction=left]:translate-x-6 data-[ending-style]:data-[activation-direction=right]:-translate-x-6 data-[ending-style]:data-[activation-direction=up]:translate-y-6 data-[ending-style]:data-[activation-direction=down]:-translate-y-6',
  viewport:
    'relative h-full w-full overflow-hidden group-data-[constrained]/positioner:overflow-y-auto'
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms)
  })
}

function waitForAnimationFrames(frameCount = 1): Promise<void> {
  return new Promise((resolve) => {
    let remaining = frameCount

    const step = () => {
      remaining -= 1

      if (remaining <= 0) {
        resolve()
        return
      }

      globalThis.requestAnimationFrame(step)
    }

    globalThis.requestAnimationFrame(step)
  })
}

function waitForDataAttribute(
  element: Element,
  attribute: string,
  predicate: (present: boolean) => boolean,
  timeoutMs = NAVIGATION_MENU_DURATION_MS * 2
): Promise<void> {
  if (predicate(element.hasAttribute(attribute))) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    const observer = new globalThis.MutationObserver(() => {
      if (predicate(element.hasAttribute(attribute))) {
        cleanup()
        resolve()
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
      resolve()
    }, timeoutMs)
  })
}

export async function waitForElementAnimations(element: Element | null | undefined): Promise<void> {
  if (!element || typeof element.getAnimations !== 'function') {
    return
  }

  const animations = element.getAnimations()
  await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)))
}

export async function waitForOpenTransition(element: Element | null | undefined): Promise<void> {
  if (!element) {
    await delay(NAVIGATION_MENU_DURATION_MS)
    return
  }

  await waitForDataAttribute(element, STARTING_STYLE_ATTR, (present) => !present)
  await waitForAnimationFrames(1)

  await Promise.all([delay(NAVIGATION_MENU_DURATION_MS), waitForElementAnimations(element)])
}

export async function waitForCloseTransition(element: Element | null | undefined): Promise<void> {
  if (!element) {
    await delay(NAVIGATION_MENU_DURATION_MS)
    return
  }

  await waitForDataAttribute(element, ENDING_STYLE_ATTR, (present) => present)
  await waitForAnimationFrames(1)

  await Promise.all([delay(NAVIGATION_MENU_DURATION_MS), waitForElementAnimations(element)])
}
