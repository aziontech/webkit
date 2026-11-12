import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import DefaultExample from '../../../../examples/doc-hero/default.vue'
import TitleOnlyExample from '../../../../examples/doc-hero/title-only.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocHero from './doc-hero.vue'

describe('DocHero', () => {
  it('renders the title as the h1 and the description under it', () => {
    const { getByRole, getByTestId } = render(DocHero, {
      props: { title: 'Welcome to Azion Docs', description: 'Fast and reliable.' }
    })
    const root = getByTestId('documentation-doc-hero')
    expect(root.tagName).toBe('HEADER')
    expect(root).toHaveAttribute('data-doc-chrome')
    expect(getByRole('heading', { level: 1, name: 'Welcome to Azion Docs' })).toBeTruthy()
    expect(getByTestId('documentation-doc-hero__description')).toHaveTextContent(
      'Fast and reliable.'
    )
  })

  it('renders only the parts it receives', () => {
    const { queryByTestId } = render(DocHero, { props: { title: 'Guides' } })
    expect(queryByTestId('documentation-doc-hero__description')).toBeNull()
    expect(queryByTestId('documentation-doc-hero__actions')).toBeNull()
    expect(queryByTestId('documentation-doc-hero__note')).toBeNull()
  })

  it('renders the title, default, actions and note slots in order', () => {
    const Composed = defineComponent({
      setup: () => () =>
        h(DocHero, null, {
          title: () => 'Slotted title',
          default: () => 'Slotted deck',
          actions: () => h('button', { type: 'button' }, 'Get started'),
          note: () => 'What the prompt does.'
        })
    })
    const { getByTestId, getByRole } = render(Composed)
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('Slotted title')
    const actions = getByTestId('documentation-doc-hero__actions')
    const note = getByTestId('documentation-doc-hero__note')
    expect(actions).toContainElement(getByRole('button', { name: 'Get started' }))
    expect(actions.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('lets a consumer override data-testid', () => {
    const { getByTestId } = render(DocHero, {
      props: { title: 'A' },
      attrs: { 'data-testid': 'home-hero' }
    })
    expect(getByTestId('home-hero__title')).toHaveTextContent('A')
  })

  it('renders under dir="rtl"', () => {
    const InRtl = defineComponent({
      setup: () => () => h('div', { dir: 'rtl' }, [h(DocHero, { title: 'Docs' })])
    })
    const { getByRole } = render(InRtl)
    expect(getByRole('heading', { level: 1, name: 'Docs' })).toBeTruthy()
  })

  it('renders the examples without axe violations', async () => {
    const a = render(DefaultExample)
    expect(a.getByRole('button', { name: 'Copy prompt' })).toBeTruthy()
    await expectNoA11yViolations(a.container)
    a.unmount()
    const b = render(TitleOnlyExample)
    expect(b.getByRole('heading', { level: 1, name: 'Guides' })).toBeTruthy()
    await expectNoA11yViolations(b.container)
  })
})
