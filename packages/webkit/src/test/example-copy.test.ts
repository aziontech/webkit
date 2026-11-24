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
    '../../examples/scroll-area/default.vue'
  ],
  { eager: true }
)

const NARRATION = [
  /:[a-z][A-Za-z-]*="/,
  /\b(divided|padded|eyebrow|rung|cell|anatomy)\b/i,
  /^(Small|Medium|Large|Centered|Left|Horizontal|Narrow|Wide)$/m,
  /⌘K or Ctrl K/,
  /Jokester/
]

describe('layout example copy', () => {
  it('lists every example it guards', () => {
    expect(Object.keys(examples)).toHaveLength(14)
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
