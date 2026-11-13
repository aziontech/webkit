import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Reasoning from './reasoning.vue'

const slots = { default: () => 'Checking the cache settings first.' }

describe('Reasoning', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(Reasoning, { slots }).getByTestId('ai-reasoning')).toBeTruthy()
    expect(
      render(Reasoning, { slots, attrs: { 'data-testid': 'mine' } }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('reads Thinking while streaming and the duration when done', async () => {
    const { getByTestId, rerender } = render(Reasoning, { props: { streaming: true }, slots })
    expect(getByTestId('ai-reasoning__label')).toHaveTextContent('Thinking')
    expect(getByTestId('ai-reasoning')).toHaveAttribute('data-streaming')
    await rerender({ streaming: false, duration: 14 })
    expect(getByTestId('ai-reasoning__label')).toHaveTextContent('Thought for 14 seconds')
    expect(getByTestId('ai-reasoning__status')).toHaveTextContent('Thought for 14 seconds')
  })

  it('measures the duration when the server gives none', async () => {
    const { getByTestId, rerender } = render(Reasoning, { props: { streaming: true }, slots })
    await rerender({ streaming: false })
    expect(getByTestId('ai-reasoning__label')).toHaveTextContent('Thought for 1 second')
  })

  it('says a few seconds when nothing was measured', () => {
    const { getByTestId } = render(Reasoning, { slots })
    expect(getByTestId('ai-reasoning__label')).toHaveTextContent('Thought for a few seconds')
  })

  it('is collapsed by default and toggles by keyboard', async () => {
    const { getByRole, getByTestId, emitted } = render(Reasoning, { props: { duration: 3 }, slots })
    const trigger = getByRole('button', { name: /Thought for 3 seconds/ })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls', getByTestId('ai-reasoning__content').id)
    expect(getByTestId('ai-reasoning__content')).not.toBeVisible()
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(getByTestId('ai-reasoning__content')).toBeVisible()
    expect(emitted('update:open')?.[0]).toEqual([true])
  })

  it('offers Skip thinking only while streaming and skippable', async () => {
    const { queryByRole, getByRole, emitted, rerender } = render(Reasoning, {
      props: { streaming: true, skippable: true },
      slots
    })
    await userEvent.click(getByRole('button', { name: 'Skip thinking' }))
    expect(emitted('skip')).toHaveLength(1)
    expect(emitted('skip')![0]![0]).toBeInstanceOf(MouseEvent)
    await rerender({ streaming: false, skippable: true })
    expect(queryByRole('button', { name: 'Skip thinking' })).toBeNull()
  })

  it('pairs the pulsing glyph with a reduced-motion escape', () => {
    const { container } = render(Reasoning, { props: { streaming: true }, slots })
    const glyph = container.querySelector('.pi-sparkles') as HTMLElement
    expect(glyph.className).toContain('motion-reduce:animate-none')
  })

  it('has no axe violations open and closed', async () => {
    const closed = render(Reasoning, { props: { duration: 2 }, slots })
    await expectNoA11yViolations(closed.container)
    closed.unmount()
    const open = render(Reasoning, {
      props: { defaultOpen: true, streaming: true, skippable: true },
      slots
    })
    await expectNoA11yViolations(open.container)
  })
})
