import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import DocCallout from '../components/docs/doc-callout/doc-callout.vue'
import DocItem from '../components/docs/doc-item/doc-item.vue'
import DocProse from '../components/docs/doc-prose/doc-prose.vue'

const SENTENCE =
  '<code>PageHeader</code> with <code>Button</code> (<code>variant="primary"</code>, <code>label="Run query"</code>) in its actions, then <code>DateRangePicker</code> with <code>:relative-options="TIME_RANGE_PRESETS"</code> and <code>@aziontech/webkit/use-time-range</code>'

type Box = { top: number; bottom: number; left: number; right: number }

function chipLines(root: HTMLElement): Box[] {
  return [...root.querySelectorAll('code')].flatMap((chip) =>
    [...chip.getClientRects()].map(({ top, bottom, left, right }) => ({ top, bottom, left, right }))
  )
}

function collisions(boxes: Box[]): string[] {
  const found: string[] = []
  for (const upper of boxes) {
    for (const lower of boxes) {
      if (lower.top <= upper.top + 1) continue
      const shared = Math.min(upper.right, lower.right) - Math.max(upper.left, lower.left)
      const gap = lower.top - upper.bottom
      if (shared > 0 && gap < 1) found.push(`gap ${gap.toFixed(2)}px`)
    }
  }
  return found
}

function expectWrappedWithoutCollision(root: HTMLElement) {
  const boxes = chipLines(root)
  const lines = new Set(boxes.map((box) => Math.round(box.top)))
  expect(lines.size).toBeGreaterThan(2)
  expect(collisions(boxes)).toEqual([])
}

const Narrow = defineComponent({
  props: { width: { type: Number, default: 220 } },
  setup(props, { slots }) {
    return () => h('div', { style: { width: `${props.width}px` } }, slots.default?.())
  }
})

describe('inline code chips on wrapped lines', () => {
  it('keep a gap in a DocProse table cell', () => {
    const { container } = render(() =>
      h(Narrow, null, () =>
        h(DocProse, null, () =>
          h('table', [h('tbody', [h('tr', [h('td', { innerHTML: SENTENCE })])])])
        )
      )
    )
    expectWrappedWithoutCollision(container.querySelector('td') as HTMLElement)
  })

  it('keep a gap in a DocProse paragraph and list item', () => {
    const { container } = render(() =>
      h(Narrow, null, () =>
        h(DocProse, null, () => [
          h('p', { innerHTML: SENTENCE }),
          h('ul', [h('li', { innerHTML: SENTENCE })])
        ])
      )
    )
    expectWrappedWithoutCollision(container.querySelector('p') as HTMLElement)
    expectWrappedWithoutCollision(container.querySelector('li') as HTMLElement)
  })

  it('keep a gap when one chip wraps inside itself', () => {
    const { container } = render(() =>
      h(Narrow, { width: 120 }, () =>
        h(DocProse, null, () =>
          h('p', { innerHTML: 'Import <code>@aziontech/webkit/use-time-range-and-more</code>.' })
        )
      )
    )
    const boxes = chipLines(container.querySelector('p') as HTMLElement)
    expect(boxes.length).toBeGreaterThan(1)
    expect(collisions(boxes)).toEqual([])
  })

  it('keep a gap in a DocCallout and a DocItem description', () => {
    const { container } = render(() =>
      h(Narrow, null, () => [
        h(DocCallout, { variant: 'note' }, () => h('p', { innerHTML: SENTENCE })),
        h(DocItem, { title: 'Run query' }, () => h('span', { innerHTML: SENTENCE }))
      ])
    )
    expectWrappedWithoutCollision(
      container.querySelector('[data-testid="doc-callout"]') as HTMLElement
    )
    expectWrappedWithoutCollision(
      container.querySelector('[data-testid="doc-item"]') as HTMLElement
    )
  })
})
