import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Sources from './sources.vue'

const items = [
  {
    title: 'Real-Time Purge',
    href: 'https://www.azion.com/en/documentation/',
    description: 'Docs'
  },
  { title: 'Cache settings', href: '/cache' }
]

describe('Sources', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(Sources, { props: { items } }).getByTestId('ai-sources')).toBeTruthy()
    expect(
      render(Sources, { props: { items }, attrs: { 'data-testid': 'mine' } }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('renders nothing without items', () => {
    expect(render(Sources).queryByTestId('ai-sources')).toBeNull()
  })

  it('titles the disclosure with the count and starts collapsed', () => {
    const { getByRole, getByTestId } = render(Sources, { props: { items } })
    const trigger = getByRole('button', { name: /2 sources/ })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(getByTestId('ai-sources__list')).not.toBeVisible()
  })

  it('toggles with the keyboard and emits update:open', async () => {
    const { getByRole, getByTestId, emitted } = render(Sources, { props: { items } })
    const trigger = getByRole('button')
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(getByTestId('ai-sources')).toHaveAttribute('data-state', 'open')
    expect(emitted('update:open')?.[0]).toEqual([true])
    await userEvent.keyboard(' ')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('ids items from the anchor and opens external links in a new tab', () => {
    const { getAllByTestId, getByRole } = render(Sources, {
      props: { items, anchor: 'answer', defaultOpen: true }
    })
    const rows = getAllByTestId('ai-sources__item')
    expect(rows[0]).toHaveAttribute('id', 'answer-source-1')
    expect(rows[1]).toHaveAttribute('id', 'answer-source-2')
    expect(getByRole('link', { name: 'Real-Time Purge' })).toHaveAttribute('target', '_blank')
    expect(getByRole('link', { name: 'Cache settings' })).not.toHaveAttribute('target')
  })

  it('opens when a citation hash points at one of its items', async () => {
    const { getByRole } = render(Sources, { props: { items, anchor: 'hash-test' } })
    window.location.hash = 'hash-test-source-2'
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    window.location.hash = ''
  })

  it('has no axe violations when open', async () => {
    const { container } = render(Sources, { props: { items, defaultOpen: true } })
    await expectNoA11yViolations(container)
  })
})
