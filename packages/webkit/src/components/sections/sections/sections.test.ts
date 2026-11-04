import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Sections from './index'
import SectionsRoot from './sections.vue'

const TESTID = 'sections-sections'

const useCases = (title: string) => ({
  _id: 'use-cases',
  props: {
    title,
    items: [{ icon: 'pi pi-comments', title: `${title} case`, description: 'One sentence.' }]
  }
})

describe('Sections', () => {
  it('renders the root under the default testid', () => {
    const { getByTestId } = render(SectionsRoot)

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(SectionsRoot, {
      attrs: { 'data-testid': 'home-page' }
    })

    expect(getByTestId('home-page')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders each registered entry with its props, in order', () => {
    const { getAllByRole } = render(SectionsRoot, {
      props: { sections: [useCases('First'), useCases('Second')] }
    })

    expect(getAllByRole('heading', { level: 2 }).map((h) => h.textContent?.trim())).toEqual([
      'First',
      'Second'
    ])
  })

  it('skips an entry whose id is not in the registry', () => {
    const { getAllByRole, queryByText } = render(SectionsRoot, {
      props: {
        sections: [useCases('Known'), { _id: 'not-a-block', props: { title: 'Ghost' } }]
      }
    })

    expect(getAllByRole('heading', { level: 2 })).toHaveLength(1)
    expect(queryByText('Ghost')).toBeNull()
  })

  it('renders an empty root when sections is empty', () => {
    const { getByTestId, queryAllByRole } = render(SectionsRoot, { props: { sections: [] } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByRole('heading')).toHaveLength(0)
  })

  it('exposes every block as a member of the compound', () => {
    expect(Sections.UseCases).toBeDefined()
    expect(Sections.registry['use-cases']).toBe(Sections.UseCases)
  })

  it('renders a block reached through the compound member', () => {
    const { getByRole } = render(Sections.UseCases, {
      props: { title: 'Direct', items: useCases('Direct').props.items }
    })

    expect(getByRole('heading', { level: 2 })).toHaveTextContent('Direct')
  })

  it('has no a11y violations with two blocks', async () => {
    const { container } = render(SectionsRoot, {
      props: { sections: [useCases('First'), useCases('Second')] }
    })

    await expectNoA11yViolations(container)
  })
})
