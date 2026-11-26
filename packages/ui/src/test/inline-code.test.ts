import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import CodeBlock from '../components/code/code-block/code-block.vue'
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

  it('keep a hyphenated token on one line in a DocProse table cell, the table scrolling instead', () => {
    const { container } = render(() =>
      h(Narrow, { width: 120 }, () =>
        h(DocProse, null, () =>
          h('table', [
            h('tbody', [
              h('tr', [h('td', { innerHTML: '<code>--layout-measure-form-create</code>' })])
            ])
          ])
        )
      )
    )
    const chip = container.querySelector('td code') as HTMLElement
    expect(chip.getClientRects()).toHaveLength(1)
    const table = container.querySelector('table') as HTMLElement
    expect(table.scrollWidth).toBeGreaterThan(table.clientWidth)
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

const BLOCK =
  '<pre><code><span class="line">&lt;script setup&gt;</span>\n<span class="line">const hintId = useId()</span>\n<span class="line">&lt;/script&gt;</span></code></pre>'

function expectPlainBlock(root: Element) {
  const block = root.querySelector('pre > code') as HTMLElement
  const style = getComputedStyle(block)
  expect(style.boxShadow).toBe('none')
  expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
  expect(style.boxDecorationBreak).toBe('slice')
  expect(style.cursor).not.toBe('pointer')
}

describe('code blocks are not inline code chips', () => {
  it('a pre code block in DocProse keeps no chip outline, fill or per-line box', () => {
    const { container } = render(() => h(DocProse, null, () => h('div', { innerHTML: BLOCK })))
    expectPlainBlock(container)
    const chip = container.ownerDocument.createElement('p')
    chip.innerHTML = 'Run <code>pnpm build</code>.'
    container.querySelector('[data-testid="doc-prose"]')?.append(chip)
    expect(getComputedStyle(chip.querySelector('code') as HTMLElement).boxShadow).not.toBe('none')
  })

  it('a pre code block in DocCallout and DocItem keeps no chip outline or fill', () => {
    const { container } = render(() => [
      h(DocCallout, { variant: 'note' }, () => h('div', { innerHTML: BLOCK })),
      h(DocItem, { title: 'Run query' }, () => h('span', { innerHTML: BLOCK }))
    ])
    expectPlainBlock(container.querySelector('[data-testid="doc-callout"]') as HTMLElement)
    expectPlainBlock(container.querySelector('[data-testid="doc-item"]') as HTMLElement)
  })

  it('a CodeBlock in DocProse and DocCallout paints no chip behind each line', () => {
    const code = 'curl -I https://example.com\nazion login'
    const { container } = render(() => [
      h(DocProse, null, () => h(CodeBlock, { code, language: 'bash' })),
      h(DocCallout, { variant: 'note' }, () => h(CodeBlock, { code, language: 'bash' }))
    ])
    const lines = [
      ...container.querySelectorAll<HTMLElement>('[data-testid="code-block__line-content"]')
    ]
    expect(lines.length).toBeGreaterThan(2)
    for (const line of lines) {
      const style = getComputedStyle(line)
      expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(style.boxShadow).toBe('none')
      expect(style.cursor).not.toBe('pointer')
    }
  })
})
