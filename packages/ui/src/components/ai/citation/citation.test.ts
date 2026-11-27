import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import { UNSAFE_URLS } from '../../../test/unsafe-urls'
import Citation from './citation.vue'

const sources = [
  {
    title: 'Real-Time Purge',
    href: 'https://www.azion.com/en/documentation/',
    description: 'Removes cached objects from every data center in seconds.',
    site: 'Azion',
    publisher: 'Acme Inc.',
    publishedAt: '2019-06-16'
  },
  { title: 'aziontech/azion', href: 'https://github.com/aziontech/azion', publisher: 'Acme Inc.' },
  { title: 'HTTP Caching', href: 'https://www.w3.org/Protocols/' }
]

const card = (testId = 'citation') =>
  document.body.querySelector<HTMLElement>(`[data-testid="${testId}__card"]`)

describe('Citation', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(
      render(Citation, { props: { indexes: [1], sources } }).getByTestId('citation')
    ).toHaveAttribute('data-slot', 'citation')
    expect(
      render(Citation, {
        props: { indexes: [1], sources },
        attrs: { 'data-testid': 'mine' }
      }).getByTestId('mine__chip')
    ).toBeTruthy()
  })

  it('shows the site name and its mark on the chip, the site first in the name', () => {
    const { getByRole } = render(Citation, { props: { indexes: [1], sources } })
    const chip = getByRole('button', { name: 'Source 1, Azion: Real-Time Purge' })
    expect(chip).toHaveTextContent('Azion')
    expect(chip.querySelector('[data-testid="sources-mark"]')).toHaveTextContent('A')
  })

  it('falls back to the host without www when the source has no site name', () => {
    const { getByRole } = render(Citation, { props: { indexes: [3], sources } })
    expect(getByRole('button', { name: 'Source 3, w3.org: HTTP Caching' })).toHaveTextContent(
      'w3.org'
    )
  })

  it('renders an unresolved number as a plain note', () => {
    const { getByRole, queryByRole } = render(Citation, { props: { indexes: [4], sources } })
    expect(queryByRole('button')).toBeNull()
    expect(getByRole('note', { name: 'Source 4' })).toHaveTextContent('4')
  })

  it('opens a card with the mark, the linked title and the site, publisher and date on click', async () => {
    const { getByRole } = render(Citation, { props: { indexes: [1], sources } })
    const chip = getByRole('button')
    await userEvent.click(chip)
    expect(chip).toHaveAttribute('aria-expanded', 'true')
    const panel = card()!
    expect(panel).toHaveTextContent('Azion')
    expect(panel.querySelector('[data-testid="citation__item__meta"]')).toHaveTextContent(
      'Azion · Acme Inc. · Jun 16, 2019'
    )
    expect(
      panel.querySelector('[data-testid="citation__item"] [data-size="medium"]')
    ).not.toBeNull()
    expect(panel).not.toHaveTextContent('Removes cached objects')
    const link = panel.querySelector('a')!
    expect(link).toHaveAttribute('href', 'https://www.azion.com/en/documentation/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('opens the card on hover', async () => {
    const { getByRole } = render(Citation, { props: { indexes: [2], sources } })
    await userEvent.hover(getByRole('button'))
    await waitFor(() => expect(card()).not.toBeNull())
    expect(card()).toHaveTextContent('aziontech/azion')
  })

  it('closes on Escape and on a press outside', async () => {
    const { getByRole } = render(Citation, { props: { indexes: [1], sources } })
    const chip = getByRole('button')
    await fireEvent.click(chip)
    expect(card()).not.toBeNull()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(chip).toHaveAttribute('aria-expanded', 'false'))
    await fireEvent.click(chip)
    expect(chip).toHaveAttribute('aria-expanded', 'true')
    await fireEvent.pointerDown(document.body)
    expect(chip).toHaveAttribute('aria-expanded', 'false')
  })

  it('counts the extra sources on the chip and stacks every one in the card', async () => {
    const { getByRole, getByTestId } = render(Citation, {
      props: { indexes: [1, 2, 3], sources }
    })
    const chip = getByRole('button', { name: 'Azion +2, sources 1, 2, 3' })
    expect(getByTestId('citation__more')).toHaveTextContent('+2')
    await fireEvent.click(chip)
    const panel = card()!
    const items = panel.querySelectorAll('li [data-testid="citation__item"]')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('Real-Time Purge')
    expect(items[1]).toHaveTextContent('github.com')
    expect(items[2]).toHaveTextContent('w3.org')
    expect(panel.querySelectorAll('a')).toHaveLength(3)
    expect(panel.querySelector('[data-testid^="citation__p"]')).toBeNull()
    expect(panel.querySelectorAll('button')).toHaveLength(0)
  })

  it('leaves out the publisher or the date the source does not have', async () => {
    const { getByRole } = render(Citation, { props: { indexes: [2, 3], sources } })
    await fireEvent.click(getByRole('button'))
    const metas = card()!.querySelectorAll('[data-testid="citation__item__meta"]')
    expect(metas).toHaveLength(2)
    expect(metas[0]).toHaveTextContent(/^github\.com · Acme Inc\.$/)
    expect(metas[1]).toHaveTextContent(/^w3\.org$/)
  })

  it('draws the rows with the menu row type and no hover fill or underline', async () => {
    const { getByRole } = render(Citation, { props: { indexes: [1, 2], sources } })
    await fireEvent.click(getByRole('button'))
    const panel = card()!
    const link = panel.querySelector<HTMLElement>('[data-testid="citation__item__link"]')!
    expect(link.className).toContain('text-label-sm')
    expect(link.className).toContain('no-underline')
    expect(panel.innerHTML).not.toContain('hover:underline')
    expect(panel.innerHTML).not.toContain('hover:bg-')
    expect(panel.querySelector('ol')).toHaveClass('divide-y')
  })

  it('moves Tab from the chip through every link in the card', async () => {
    const { getByRole } = render(Citation, { props: { indexes: [1, 2], sources } })
    const chip = getByRole('button')
    await fireEvent.click(chip)
    chip.focus()
    await userEvent.tab()
    const links = card()!.querySelectorAll('a')
    expect(document.activeElement).toBe(links[0])
    await userEvent.tab()
    expect(document.activeElement).toBe(links[1])
  })

  it.each(UNSAFE_URLS)('shows the title as plain text for the unsafe href %j', async (href) => {
    const { getByRole } = render(Citation, {
      props: { indexes: [1], sources: [{ title: 'Poisoned', href }] }
    })
    await fireEvent.click(getByRole('button'))
    expect(card()!.querySelector('a')).toBeNull()
    expect(card()).toHaveTextContent('Poisoned')
  })

  it('has no axe violations, closed and open', async () => {
    const { container, getByRole } = render(Citation, { props: { indexes: [1, 2], sources } })
    await expectNoA11yViolations(container)
    await fireEvent.click(getByRole('button'))
    await expectNoA11yViolations(card()!)
  })
})
