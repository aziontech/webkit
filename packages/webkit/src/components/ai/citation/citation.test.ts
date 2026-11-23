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
    site: 'Azion'
  },
  { title: 'aziontech/azion', href: 'https://github.com/aziontech/azion' },
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

  it('opens a card with the site, the linked title and the snippet on click', async () => {
    const { getByRole } = render(Citation, { props: { indexes: [1], sources } })
    const chip = getByRole('button')
    await userEvent.click(chip)
    expect(chip).toHaveAttribute('aria-expanded', 'true')
    const panel = card()!
    expect(panel).toHaveTextContent('Azion')
    expect(panel).toHaveTextContent('Removes cached objects')
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

  it('counts the extra sources on the chip and pages through them in the card', async () => {
    const { getByRole, getByTestId } = render(Citation, {
      props: { indexes: [1, 2, 3], sources }
    })
    const chip = getByRole('button', { name: 'Azion +2, sources 1, 2, 3' })
    expect(getByTestId('citation__more')).toHaveTextContent('+2')
    await fireEvent.click(chip)
    const panel = card()!
    const page = panel.querySelector('[data-testid="citation__page"]')!
    const previous = panel.querySelector<HTMLButtonElement>('[data-testid="citation__previous"]')!
    const next = panel.querySelector<HTMLButtonElement>('[data-testid="citation__next"]')!
    expect(page).toHaveTextContent('1/3')
    expect(previous).toBeDisabled()
    await fireEvent.click(next)
    expect(page).toHaveTextContent('2/3')
    expect(panel).toHaveTextContent('aziontech/azion')
    await fireEvent.click(next)
    expect(next).toBeDisabled()
    expect(panel).toHaveTextContent('w3.org')
    await fireEvent.click(previous)
    expect(page).toHaveTextContent('2/3')
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
