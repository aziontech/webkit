import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import { UNSAFE_URLS } from '../../../test/unsafe-urls'
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
    expect(render(Sources, { props: { items } }).getByTestId('sources')).toBeTruthy()
    expect(
      render(Sources, { props: { items }, attrs: { 'data-testid': 'mine' } }).getByTestId('mine')
    ).toBeTruthy()
  })

  it.each(UNSAFE_URLS)('renders the title as plain text for the unsafe href %j', (href) => {
    const { queryByRole, getByText } = render(Sources, {
      props: { items: [{ title: 'Poisoned', href }], defaultOpen: true }
    })
    expect(queryByRole('link')).toBeNull()
    expect(getByText('Poisoned').closest('a')).toBeNull()
  })

  it('renders nothing without items', () => {
    expect(render(Sources).queryByTestId('sources')).toBeNull()
  })

  it('titles the disclosure with the count and starts collapsed', () => {
    const { getByRole, getByTestId } = render(Sources, { props: { items } })
    const trigger = getByRole('button', { name: /2 sources/ })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(getByTestId('sources__list')).not.toBeVisible()
  })

  it('toggles with the keyboard and emits update:open', async () => {
    const { getByRole, getByTestId, emitted } = render(Sources, { props: { items } })
    const trigger = getByRole('button')
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(getByTestId('sources')).toHaveAttribute('data-state', 'open')
    expect(emitted('update:open')?.[0]).toEqual([true])
    await userEvent.keyboard(' ')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('ids items from the anchor and opens external links in a new tab', () => {
    const { getAllByTestId, getByRole } = render(Sources, {
      props: { items, anchor: 'answer', defaultOpen: true }
    })
    const rows = getAllByTestId('sources__item')
    expect(rows[0]).toHaveAttribute('id', 'answer-source-1')
    expect(rows[1]).toHaveAttribute('id', 'answer-source-2')
    const external = getByRole('link', { name: 'Real-Time Purge (opens in a new tab)' })
    expect(external).toHaveAttribute('target', '_blank')
    expect(external.querySelector('.az-external-link')).toHaveAttribute('aria-hidden', 'true')
    const local = getByRole('link', { name: 'Cache settings' })
    expect(local).not.toHaveAttribute('target')
    expect(local.querySelector('.az-external-link')).toBeNull()
  })

  it('opens when a citation hash points at one of its items', async () => {
    const { getByRole } = render(Sources, { props: { items, anchor: 'hash-test' } })
    window.location.hash = 'hash-test-source-2'
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    window.location.hash = ''
  })

  it('stops listening for citation hashes once unmounted', async () => {
    const { emitted, unmount } = render(Sources, { props: { items, anchor: 'gone-test' } })
    const events = emitted()
    unmount()
    window.location.hash = 'gone-test-source-1'
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(events['update:open']).toBeUndefined()
    window.location.hash = ''
  })

  it('follows a bound v-model:open and does not open itself while controlled', async () => {
    const { getByRole, getByTestId, emitted, rerender } = render(Sources, {
      props: { items, open: false, 'onUpdate:open': () => undefined }
    })
    await userEvent.click(getByRole('button'))
    expect(emitted('update:open')?.[0]).toEqual([true])
    expect(getByTestId('sources__list')).not.toBeVisible()
    await rerender({ items, open: true, 'onUpdate:open': () => undefined })
    expect(getByTestId('sources__list')).toBeVisible()
  })

  it('has no axe violations when open', async () => {
    const { container } = render(Sources, { props: { items, defaultOpen: true } })
    await expectNoA11yViolations(container)
  })
})
