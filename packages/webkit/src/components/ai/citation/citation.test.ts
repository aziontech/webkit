import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Citation from './citation.vue'

describe('Citation', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(Citation, { props: { index: 1 } }).getByTestId('ai-citation')).toBeTruthy()
    expect(
      render(Citation, { props: { index: 1 }, attrs: { 'data-testid': 'mine' } }).getByTestId(
        'mine'
      )
    ).toBeTruthy()
  })

  it('links to the source list with a named reference', () => {
    const { getByRole } = render(Citation, {
      props: { index: 2, title: 'Cache settings', href: '#answer-source-2' }
    })
    const link = getByRole('link', { name: 'Source 2: Cache settings' })
    expect(link).toHaveAttribute('href', '#answer-source-2')
    expect(link).not.toHaveAttribute('target')
    expect(link).toHaveTextContent('2')
  })

  it('opens an external source in a new tab', () => {
    const { getByRole } = render(Citation, {
      props: { index: 1, title: 'Docs', href: 'https://www.azion.com/en/documentation/' }
    })
    const link = getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders an unlinked note without href', () => {
    const { getByRole, queryByRole } = render(Citation, { props: { index: 3 } })
    expect(queryByRole('link')).toBeNull()
    expect(getByRole('note', { name: 'Source 3' })).toBeTruthy()
  })

  it('has no axe violations', async () => {
    const { container } = render(Citation, {
      props: { index: 1, title: 'Docs', href: '#s-1' }
    })
    await expectNoA11yViolations(container)
  })
})
