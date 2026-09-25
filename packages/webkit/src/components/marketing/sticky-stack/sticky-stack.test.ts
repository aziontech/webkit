import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import StickyStack, { type StickyStackItem } from './sticky-stack.vue'

const TESTID = 'marketing-sticky-stack'

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

const ITEMS: StickyStackItem[] = [
  {
    title: 'Automated deployment via Git or CLI',
    description: 'Push to a branch or run one command and the build lands in every location.',
    src: PIXEL,
    alt: 'A push turning into a deployment'
  },
  {
    title: 'Infrastructure as code with Terraform',
    description: 'Declare workloads, rules and domains in the provider and apply them.',
    src: PIXEL,
    alt: 'A Terraform plan applying a workload'
  },
  {
    title: 'Metrics and events via GraphQL API',
    description: 'Query the same numbers the console charts, with one endpoint.',
    src: PIXEL,
    alt: 'A GraphQL query returning request metrics'
  }
]

// This env runs no Tailwind, so the `lg:` geometry the index maths reads emits nothing;
// these rules stand in for it. The frame must be a FULL viewport tall, or the page cannot
// scroll the whole pinned distance and the last claim is unreachable.
const SPAN = 1 + ITEMS.length

function pinGeometry(): () => void {
  const style = document.createElement('style')
  style.textContent = `
    body { margin: 0 }
    [data-testid="${TESTID}"] { display: block; position: relative; height: calc(100vh * ${SPAN}) }
    [data-testid="${TESTID}"] > div:not([data-sticky-stack-anchor]) {
      position: sticky; top: 0; height: 100vh; overflow: hidden
    }
  `
  document.head.append(style)
  return () => style.remove()
}

/** One claim's share of the pinned scroll, in px — the track is one screen per claim plus one. */
function slice(): number {
  return globalThis.innerHeight
}

async function scrollTo(y: number): Promise<void> {
  globalThis.scrollTo(0, y)
  // A scroll event lands on a later frame than the call, and the component then schedules
  // its own rAF to measure — so one frame is not enough to observe the result.
  for (let i = 0; i < 3; i += 1) {
    await new Promise((resolve) => globalThis.requestAnimationFrame(() => resolve(null)))
  }
  await nextTick()
}

function rowsOf(container: HTMLElement): globalThis.HTMLLIElement[] {
  const list = container.querySelector('ol')
  return list ? ([...list.children] as globalThis.HTMLLIElement[]) : []
}

function activeTitle(container: HTMLElement): string {
  const row = rowsOf(container).find((item) => item.getAttribute('data-active') !== null)
  return row?.querySelector('button')?.textContent?.trim() ?? ''
}

function completedTitles(container: HTMLElement): string[] {
  return rowsOf(container)
    .filter((row) => row.getAttribute('data-complete') !== null)
    .map((row) => row.querySelector('button')?.textContent?.trim() ?? '')
}

afterEach(async () => {
  await scrollTo(0)
})

describe('StickyStack', () => {
  it('renders the derived testid and lets a consumer override it', () => {
    const { container } = render(StickyStack, { props: { items: ITEMS } })
    expect(container.querySelector(`[data-testid="${TESTID}"]`)).not.toBeNull()

    const custom = render(StickyStack, {
      props: { items: ITEMS },
      attrs: { 'data-testid': 'dev-platform-stack' }
    })
    expect(custom.container.querySelector('[data-testid="dev-platform-stack"]')).not.toBeNull()
    expect(custom.container.querySelector(`[data-testid="${TESTID}"]`)).toBeNull()
  })

  it('renders nothing when there are no items', () => {
    const { container } = render(StickyStack, { props: { items: [] } })
    expect(container.querySelector(`[data-testid="${TESTID}"]`)).toBeNull()
  })

  it('renders every claim as an ordered list entry with its own control', () => {
    const { container } = render(StickyStack, { props: { items: ITEMS } })
    const rows = rowsOf(container)
    expect(rows).toHaveLength(ITEMS.length)
    expect(rows.map((row) => row.querySelector('button')?.textContent?.trim())).toEqual(
      ITEMS.map((item) => item.title)
    )
    expect(container.querySelectorAll('ol')).toHaveLength(1)
  })

  it.each(['small', 'medium', 'large'] as const)('carries data-size for %s', (size) => {
    const { container } = render(StickyStack, { props: { items: ITEMS, size } })
    expect(container.querySelector(`[data-testid="${TESTID}"]`)?.getAttribute('data-size')).toBe(
      size
    )
  })

  it('opens the first claim at rest and marks it aria-current', () => {
    const { container } = render(StickyStack, { props: { items: ITEMS } })
    expect(activeTitle(container)).toBe(ITEMS[0].title)
    expect(completedTitles(container)).toEqual([])

    const current = [...container.querySelectorAll('button[aria-current="true"]')]
    expect(current).toHaveLength(1)
    expect(current[0].textContent?.trim()).toBe(ITEMS[0].title)
  })

  it('marks data-progress only while showProgress is on', () => {
    const on = render(StickyStack, { props: { items: ITEMS } })
    expect(
      on.container.querySelector(`[data-testid="${TESTID}"]`)?.getAttribute('data-progress')
    ).toBe('true')

    const off = render(StickyStack, { props: { items: ITEMS, showProgress: false } })
    expect(
      off.container.querySelector(`[data-testid="${TESTID}"]`)?.getAttribute('data-progress')
    ).toBeNull()
  })

  it('renders the media slot for the open claim, with the item and index in scope', () => {
    const seen: number[] = []
    const { container } = render(StickyStack, {
      props: { items: ITEMS },
      slots: {
        media: ({ item, index }: { item: StickyStackItem; index: number }) => {
          seen.push(index)
          return h('p', { 'data-scene': index }, item.title)
        }
      }
    })
    expect(seen).toContain(0)
    expect(container.querySelectorAll('[data-scene]').length).toBeGreaterThan(0)
    expect(container.querySelector('[data-scene="0"]')?.textContent).toBe(ITEMS[0].title)
  })

  it('falls back to the item image when the media slot is empty', () => {
    const { container } = render(StickyStack, { props: { items: ITEMS } })
    const images = [...container.querySelectorAll('img')]
    expect(images.length).toBeGreaterThan(0)
    expect(images.every((image) => image.getAttribute('alt') !== null)).toBe(true)
  })

  it('advances the open claim as the band is scrolled through, and emits each change', async () => {
    const release = pinGeometry()
    try {
      const { container, emitted } = render(StickyStack, { props: { items: ITEMS } })
      await scrollTo(0)
      expect(activeTitle(container)).toBe(ITEMS[0].title)

      await scrollTo(slice() * 1.5)
      expect(activeTitle(container)).toBe(ITEMS[1].title)
      expect(completedTitles(container)).toEqual([ITEMS[0].title])

      await scrollTo(slice() * 2.5)
      expect(activeTitle(container)).toBe(ITEMS[2].title)
      expect(completedTitles(container)).toEqual([ITEMS[0].title, ITEMS[1].title])

      expect(emitted('index-change')).toEqual([[1], [2]])
    } finally {
      release()
    }
  })

  it('does not re-emit while the scroll stays inside one claim', async () => {
    const release = pinGeometry()
    try {
      const { emitted } = render(StickyStack, { props: { items: ITEMS } })

      await scrollTo(slice() * 1.2)
      await scrollTo(slice() * 1.4)
      await scrollTo(slice() * 1.8)

      expect(emitted('index-change')).toEqual([[1]])
    } finally {
      release()
    }
  })

  it('holds the last claim open past the end of the band', async () => {
    const release = pinGeometry()
    try {
      const { container } = render(StickyStack, { props: { items: ITEMS } })
      await scrollTo(slice() * SPAN * 2)
      expect(activeTitle(container)).toBe(ITEMS[ITEMS.length - 1].title)
    } finally {
      release()
    }
  })

  it('keeps every claim in the accessibility tree while the band rests', async () => {
    const { container } = render(StickyStack, { props: { items: ITEMS } })
    for (const item of ITEMS) {
      expect(container.textContent).toContain(item.title)
      expect(container.textContent).toContain(item.description)
    }
    await expectNoA11yViolations(container)
  })
})
