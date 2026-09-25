import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import FeatureCard from './feature-card.vue'

const TESTID = 'marketing-feature-card'

const props = {
  title: 'Run at the edge',
  description: 'Your code executes in the location closest to each user, with no region to choose.'
}

const href = '/products/edge-application'

describe('FeatureCard', () => {
  it('renders the tile under the default testid', () => {
    const { getByTestId } = render(FeatureCard, { props })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(FeatureCard, {
      props,
      attrs: { 'data-testid': 'capability-tile' }
    })

    expect(getByTestId('capability-tile')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the tile heading', () => {
    const { getByRole } = render(FeatureCard, { props })
    const heading = getByRole('heading', { level: 3, name: props.title })

    expect(heading.tagName).toBe('H3')
  })

  it('renders an article that carries no link affordance without an href', () => {
    const { getByTestId, queryByRole } = render(FeatureCard, { props })
    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('ARTICLE')
    expect(root).not.toHaveAttribute('href')
    expect(root).not.toHaveAttribute('data-linked')
    expect(queryByRole('link')).toBeNull()
  })

  it('leaves an unlinked tile out of the focus order', () => {
    const { getByTestId } = render(FeatureCard, { props })
    const root = getByTestId(TESTID)

    expect(root).not.toHaveAttribute('tabindex')

    root.focus()
    expect(document.activeElement).not.toBe(root)
  })

  it('renders an anchor to the href and flags it as linked', () => {
    const { getByTestId } = render(FeatureCard, { props: { ...props, href } })
    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('A')
    expect(root).toHaveAttribute('href', href)
    expect(root).toHaveAttribute('data-linked', 'true')
  })

  it('exposes a linked tile as a focusable link named by its own copy', () => {
    const { getByRole, getByTestId } = render(FeatureCard, { props: { ...props, href } })
    const link = getByRole('link', { name: new RegExp(props.title) })

    expect(link).toBe(getByTestId(TESTID))

    link.focus()
    expect(document.activeElement).toBe(link)
  })

  it('renders the description prop as the tile copy', () => {
    const { container } = render(FeatureCard, { props })

    expect(container.querySelector('p')).toHaveTextContent(props.description)
  })

  it('lets the default slot replace the description prop', () => {
    const { container, queryByText } = render(FeatureCard, {
      props,
      slots: { default: 'Deployed to every location at once.' }
    })

    expect(container.querySelector('p')).toHaveTextContent('Deployed to every location at once.')
    expect(queryByText(props.description)).toBeNull()
  })

  it('renders no copy paragraph without a description or a slot', () => {
    const { container } = render(FeatureCard, { props: { title: props.title } })

    expect(container.querySelector('p')).toBeNull()
  })

  it('renders the eyebrow only when one is given', () => {
    const { queryByText: queryWithout } = render(FeatureCard, { props })
    expect(queryWithout('Performance')).toBeNull()

    const { getByText } = render(FeatureCard, { props: { ...props, eyebrow: 'Performance' } })
    expect(getByText('Performance')).toBeInTheDocument()
  })

  it('renders the icon glyph hidden from assistive technology', () => {
    const { container } = render(FeatureCard, { props: { ...props, icon: 'pi pi-bolt' } })
    const glyph = container.querySelector('i')

    expect(glyph).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders no glyph when no icon is given', () => {
    const { container } = render(FeatureCard, { props })

    expect(container.querySelector('i')).toBeNull()
  })

  it('has no a11y violations as an unlinked tile', async () => {
    const { container } = render(FeatureCard, {
      props: { ...props, eyebrow: 'Performance', icon: 'pi pi-bolt' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations as a linked tile', async () => {
    const { container } = render(FeatureCard, {
      props: { ...props, eyebrow: 'Performance', icon: 'pi pi-bolt', href }
    })

    await expectNoA11yViolations(container)
  })
})
