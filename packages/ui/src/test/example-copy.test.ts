import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'

const examples = import.meta.glob<{ default: Component }>(
  [
    '../../examples/container/with-modules.vue',
    '../../examples/module/divided.vue',
    '../../examples/module-header/sizes.vue',
    '../../examples/module-header/alignments.vue',
    '../../examples/module-header/description-widths.vue',
    '../../examples/card-grid/default.vue',
    '../../examples/card-grid/divider-color.vue',
    '../../examples/card-grid/frame.vue',
    '../../examples/app-header/site-placement.vue',
    '../../examples/console-layout/navigation-open.vue',
    '../../examples/console-layout/sidebar-header.vue',
    '../../examples/console-layout/page-opens-search.vue',
    '../../examples/app-layout/compact.vue',
    '../../examples/scroll-area/default.vue',
    '../../examples/module/default.vue',
    '../../examples/bento-grid/mosaic.vue',
    '../../examples/console-layout/fill-page.vue',
    '../../examples/navigation-menu/default.vue',
    '../../examples/resizable/default.vue'
  ],
  { eager: true }
)

const NARRATION = [
  /:[a-z][A-Za-z-]*="/,
  /\b(divided|padded|eyebrow|rung|cell|anatomy)\b/i,
  /^(Small|Medium|Large|Centered|Left|Horizontal|Narrow|Wide)$/m,
  /⌘K or Ctrl K/,
  /Jokester/,
  /\b(band|panes?|demo|basis|flexible)\b/i,
  /\bLine \d+/,
  /Primary action/
]

describe('layout example copy', () => {
  it('lists every example it guards', () => {
    expect(Object.keys(examples)).toHaveLength(19)
  })

  it.each(Object.entries(examples))(
    '%s renders product copy, not a note on its own props',
    (_, mod) => {
      const { container, unmount } = render(mod.default)
      const text = (container as HTMLElement).innerText
      for (const pattern of NARRATION) expect(text).not.toMatch(pattern)
      unmount()
    }
  )
})

const sentenceCase = import.meta.glob<{ default: Component }>(
  [
    '../../examples/page-header/default.vue',
    '../../examples/tabs/default.vue',
    '../../examples/split-stack/default.vue',
    '../../examples/split-stack/sticky.vue',
    '../../examples/settings-row/default.vue',
    '../../examples/dropdown-menu/placements.vue'
  ],
  { eager: true }
)

describe('example labels and headings', () => {
  it.each(Object.entries(sentenceCase))(
    '%s writes them in sentence case, each one distinct',
    (_, mod) => {
      const { container, unmount } = render(mod.default)
      const names = Array.from(
        (container as HTMLElement).querySelectorAll<HTMLElement>(
          'button, [role="tab"], h1, h2, h3, h4, label, [data-slot="label"]'
        )
      )
        .map((el) => el.innerText.trim())
        .filter(Boolean)
      for (const name of names) expect(name).not.toMatch(/\b[A-Z][a-z]+ [A-Z][a-z]+/)
      const tabs = Array.from(container.querySelectorAll('[role="tab"]')).map((el) =>
        el.textContent?.trim()
      )
      expect(new Set(tabs).size).toBe(tabs.length)
      expect((container as HTMLElement).innerText).not.toMatch(/Option [A-Z]\b|Tab Item/)
      unmount()
    }
  )
})
