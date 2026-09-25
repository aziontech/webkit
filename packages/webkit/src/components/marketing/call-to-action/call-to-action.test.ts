import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import CallToAction from './call-to-action.vue'

const TESTID = 'marketing-call-to-action'

const TITLE = 'Ship your first application today.'
const DESCRIPTION = 'Deploy to every edge location in seconds. No credit card required.'
const EYEBROW = 'Get started'

describe('CallToAction', () => {
  it('renders the panel under the default testid', () => {
    const { getByTestId } = render(CallToAction, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(CallToAction, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'closing-cta' }
    })

    expect(getByTestId('closing-cta')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the panel heading', () => {
    const { getByRole } = render(CallToAction, { props: { title: TITLE } })
    const heading = getByRole('heading', { level: 2 })

    expect(heading).toHaveTextContent(TITLE)
  })

  it('labels the section with its heading', () => {
    const { getByTestId, getByRole } = render(CallToAction, { props: { title: TITLE } })
    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('SECTION')
    // the band is a named landmark; the name comes from its title, not from a wired id
    expect(getByRole('region', { name: TITLE })).toBe(root)
    expect(getByRole('heading', { level: 2 })).toHaveTextContent(TITLE)
  })

  it('exposes the panel as a named landmark', () => {
    const { getByRole, getByTestId } = render(CallToAction, { props: { title: TITLE } })

    expect(getByRole('region', { name: TITLE })).toBe(getByTestId(TESTID))
  })

  it('renders the description under the headline', () => {
    const { getByText } = render(CallToAction, {
      props: { title: TITLE, description: DESCRIPTION }
    })

    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('renders no description paragraph when neither the prop nor the slot is given', () => {
    const { container } = render(CallToAction, { props: { title: TITLE } })

    expect(container.querySelector('p')).toBeNull()
  })

  it('lets the default slot replace the description prop', () => {
    const { getByText, queryByText } = render(CallToAction, {
      props: { title: TITLE, description: DESCRIPTION },
      slots: { default: 'Talk to us before you commit.' }
    })

    expect(getByText('Talk to us before you commit.')).toBeInTheDocument()
    expect(queryByText(DESCRIPTION)).toBeNull()
  })

  it('renders the eyebrow only when it is set', () => {
    const { queryByText } = render(CallToAction, { props: { title: TITLE } })

    expect(queryByText(EYEBROW)).toBeNull()
  })

  it('renders the eyebrow above the headline when it is set', () => {
    const { getByText } = render(CallToAction, { props: { title: TITLE, eyebrow: EYEBROW } })

    expect(getByText(EYEBROW)).toBeInTheDocument()
  })

  it('renders the controls placed in the actions slot', () => {
    const { getByRole } = render(CallToAction, {
      props: { title: TITLE },
      slots: { actions: '<button type="button">Start for free</button>' }
    })

    expect(getByRole('button', { name: 'Start for free' })).toBeInTheDocument()
  })

  it('renders no control when the actions slot is not passed', () => {
    const { container } = render(CallToAction, { props: { title: TITLE } })

    expect(container.querySelector('button')).toBeNull()
  })

  it('forwards a consumer class onto the root', () => {
    const { getByTestId } = render(CallToAction, {
      props: { title: TITLE },
      attrs: { class: 'max-w-(--container-4xl)' }
    })

    expect(getByTestId(TESTID).className).toContain('max-w-(--container-4xl)')
  })

  it('has no a11y violations with a full panel', async () => {
    const { container } = render(CallToAction, {
      props: { title: TITLE, description: DESCRIPTION, eyebrow: EYEBROW },
      slots: { actions: '<button type="button">Start for free</button>' }
    })

    await expectNoA11yViolations(container)
  })

  it('carries its register on the root', () => {
    const { getByTestId } = render(CallToAction, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'panel')
  })

  it('carries the split register on the root when asked for it', () => {
    const { getByTestId } = render(CallToAction, { props: { title: TITLE, kind: 'split' } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'split')
  })

  it('reads the two-tone headline as one heading', () => {
    const { getByRole } = render(CallToAction, {
      props: { title: 'Build once.', titleMuted: 'Run anywhere.', kind: 'split' }
    })
    const headings = getByRole('heading', { level: 2 })

    expect(headings).toHaveTextContent('Build once.')
    expect(headings).toHaveTextContent('Run anywhere.')
  })

  it('renders no muted line when titleMuted is not set', () => {
    const { getByRole } = render(CallToAction, { props: { title: TITLE, kind: 'split' } })

    expect(getByRole('heading', { level: 2 }).querySelectorAll('span')).toHaveLength(1)
  })

  it('renders the aside control in the split register', () => {
    const { getByRole } = render(CallToAction, {
      props: { title: TITLE, kind: 'split' },
      slots: { aside: '<button type="button">Talk to our team</button>' }
    })

    expect(getByRole('button', { name: 'Talk to our team' })).toBeInTheDocument()
  })

  it('ignores the aside slot in the panel register', () => {
    const { queryByRole } = render(CallToAction, {
      props: { title: TITLE },
      slots: { aside: '<button type="button">Talk to our team</button>' }
    })

    expect(queryByRole('button', { name: 'Talk to our team' })).toBeNull()
  })

  it('floors both controls in the split register', () => {
    const { getByRole } = render(CallToAction, {
      props: { title: TITLE, titleMuted: 'Run anywhere.', kind: 'split', description: DESCRIPTION },
      slots: {
        actions: '<button type="button">Start for free</button>',
        aside: '<button type="button">Talk to our team</button>'
      }
    })

    expect(getByRole('button', { name: 'Start for free' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Talk to our team' })).toBeInTheDocument()
  })

  it('renders no aside paragraph when the split register carries no description', () => {
    const { container } = render(CallToAction, { props: { title: TITLE, kind: 'split' } })

    expect(container.querySelector('p')).toBeNull()
  })

  it('carries the lead register on the root when asked for it', () => {
    const { getByTestId } = render(CallToAction, { props: { title: TITLE, kind: 'lead' } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'lead')
  })

  it('reads the two-tone headline as one heading in the lead register', () => {
    const { getByRole } = render(CallToAction, {
      props: { title: 'Built by you,', titleMuted: 'or your agents.', kind: 'lead' }
    })
    const heading = getByRole('heading', { level: 2 })

    expect(heading).toHaveTextContent('Built by you,')
    expect(heading).toHaveTextContent('or your agents.')
    expect(heading.querySelectorAll('span')).toHaveLength(2)
  })

  it('renders the description under the headline in the lead register', () => {
    const { getByText } = render(CallToAction, {
      props: { title: TITLE, description: DESCRIPTION, kind: 'lead' }
    })

    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('renders every control from the actions slot in the lead register', () => {
    const { getByRole } = render(CallToAction, {
      props: { title: TITLE, kind: 'lead' },
      slots: {
        actions:
          '<button type="button">Deploy now</button><button type="button">Read the docs</button>'
      }
    })

    expect(getByRole('button', { name: 'Deploy now' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Read the docs' })).toBeInTheDocument()
  })

  it('ignores the aside slot in the lead register', () => {
    const { queryByRole } = render(CallToAction, {
      props: { title: TITLE, kind: 'lead' },
      slots: { aside: '<button type="button">Talk to our team</button>' }
    })

    expect(queryByRole('button', { name: 'Talk to our team' })).toBeNull()
  })

  it('has no a11y violations in the lead register', async () => {
    const { container } = render(CallToAction, {
      props: {
        title: 'Built by you,',
        titleMuted: 'or your agents.',
        description: DESCRIPTION,
        eyebrow: EYEBROW,
        kind: 'lead'
      },
      slots: { actions: '<button type="button">Deploy now</button>' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the split register', async () => {
    const { container } = render(CallToAction, {
      props: {
        title: 'Build once.',
        titleMuted: 'Run anywhere.',
        description: DESCRIPTION,
        eyebrow: EYEBROW,
        kind: 'split'
      },
      slots: {
        actions: '<button type="button">Start for free</button>',
        aside: '<button type="button">Talk to our team</button>'
      }
    })

    await expectNoA11yViolations(container)
  })
})
