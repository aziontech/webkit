import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ArtifactPreview from './artifact-preview.vue'

const base = { title: 'cache-rules.json', description: 'Cache settings', meta: '1 KB · JSON' }

describe('ArtifactPreview', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(ArtifactPreview, { props: base }).getByTestId('ai-artifact-preview')).toBeTruthy()
    expect(
      render(ArtifactPreview, { props: base, attrs: { 'data-testid': 'mine' } }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('is an article named by its title, with description and meta', () => {
    const { getByRole } = render(ArtifactPreview, { props: base })
    const article = getByRole('article', { name: 'cache-rules.json' })
    expect(article).toHaveTextContent('Cache settings')
    expect(article).toHaveTextContent('1 KB · JSON')
  })

  it('shows only the actions it is given', () => {
    const { queryByRole } = render(ArtifactPreview, { props: base })
    expect(queryByRole('button')).toBeNull()
    expect(queryByRole('link')).toBeNull()
  })

  it('emits open from Open, named with the title', async () => {
    const { getByRole, emitted } = render(ArtifactPreview, { props: { ...base, openable: true } })
    await userEvent.click(getByRole('button', { name: 'Open cache-rules.json' }))
    expect(emitted('open')).toHaveLength(1)
  })

  it('names Copy and Download with the title', () => {
    const { getByRole } = render(ArtifactPreview, {
      props: { ...base, copyValue: '{}', downloadHref: '/files/cache-rules.json' }
    })
    expect(getByRole('button', { name: 'Copy cache-rules.json' })).toBeTruthy()
    expect(getByRole('link', { name: 'Download cache-rules.json' })).toHaveAttribute(
      'href',
      '/files/cache-rules.json'
    )
  })

  it('renders the preview body only with content', () => {
    expect(
      render(ArtifactPreview, { props: base }).queryByTestId('ai-artifact-preview__content')
    ).toBeNull()
    const withBody = render(ArtifactPreview, {
      props: base,
      slots: { default: () => '{ "ttl": 60 }' }
    })
    expect(withBody.getByTestId('ai-artifact-preview__content')).toHaveTextContent('{ "ttl": 60 }')
  })

  it('has no axe violations', async () => {
    const { container } = render(ArtifactPreview, {
      props: { ...base, copyValue: '{}', openable: true },
      slots: { default: () => '{}' }
    })
    await expectNoA11yViolations(container)
  })
})
