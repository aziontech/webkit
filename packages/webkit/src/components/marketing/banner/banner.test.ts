import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Banner from './banner.vue'

const TESTID = 'marketing-banner'

const TITLE = 'Deploy WebAssembly at every edge location.'
const DESCRIPTION = 'Included on every plan, with no change to how you build.'
const EYEBROW = 'Now available'

describe('Banner', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = render(Banner, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(Banner, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'launch-banner' }
    })

    expect(getByTestId('launch-banner')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the band heading', () => {
    const { getByRole } = render(Banner, { props: { title: TITLE } })
    const heading = getByRole('heading', { level: 2 })

    expect(heading).toHaveTextContent(TITLE)
  })

  it('labels the section with its heading', () => {
    const { getByTestId, getByRole } = render(Banner, { props: { title: TITLE } })
    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('SECTION')
    // the band is a named landmark; the name comes from its title, not from a wired id
    expect(getByRole('region', { name: TITLE })).toBe(root)
    expect(getByRole('heading', { level: 2 })).toHaveTextContent(TITLE)
  })

  it('exposes the band as a named landmark', () => {
    const { getByRole, getByTestId } = render(Banner, { props: { title: TITLE } })

    expect(getByRole('region', { name: TITLE })).toBe(getByTestId(TESTID))
  })

  it('renders no eyebrow when it is not set', () => {
    const { queryByText } = render(Banner, { props: { title: TITLE } })

    expect(queryByText(EYEBROW)).toBeNull()
  })

  it('renders the eyebrow above the announcement when it is set', () => {
    const { getByText } = render(Banner, { props: { title: TITLE, eyebrow: EYEBROW } })

    expect(getByText(EYEBROW)).toBeInTheDocument()
  })

  it('renders the description in the trailing column', () => {
    const { getByText } = render(Banner, {
      props: { title: TITLE, description: DESCRIPTION }
    })

    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('lets the aside slot replace the description prop', () => {
    const { getByText, queryByText } = render(Banner, {
      props: { title: TITLE, description: DESCRIPTION },
      slots: { aside: 'Rolling out to every account this week.' }
    })

    expect(getByText('Rolling out to every account this week.')).toBeInTheDocument()
    expect(queryByText(DESCRIPTION)).toBeNull()
  })

  it('renders no trailing column when neither the prop nor the slot is given', () => {
    const { container } = render(Banner, { props: { title: TITLE } })

    expect(container.querySelector('p')).toBeNull()
  })

  it('renders the controls placed in the actions slot', () => {
    const { getByRole } = render(Banner, {
      props: { title: TITLE },
      slots: { actions: '<button type="button">Read the announcement</button>' }
    })

    expect(getByRole('button', { name: 'Read the announcement' })).toBeInTheDocument()
  })

  it('renders no control when the actions slot is not passed', () => {
    const { container } = render(Banner, { props: { title: TITLE } })

    expect(container.querySelector('button')).toBeNull()
  })

  it('renders the announcement before the trailing note, so stacked order matches reading order', () => {
    const { container } = render(Banner, {
      props: { title: TITLE, description: DESCRIPTION }
    })
    const ordered = [...container.querySelectorAll('h2, p')].map((node) => node.textContent?.trim())

    expect(ordered).toEqual([TITLE, DESCRIPTION])
  })

  it('forwards a consumer class onto the root', () => {
    const { getByTestId } = render(Banner, {
      props: { title: TITLE },
      attrs: { class: 'max-w-(--container-4xl)' }
    })

    expect(getByTestId(TESTID).className).toContain('max-w-(--container-4xl)')
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = render(Banner, {
      props: { title: TITLE, description: DESCRIPTION, eyebrow: EYEBROW },
      slots: { actions: '<button type="button">Read the announcement</button>' }
    })

    await expectNoA11yViolations(container)
  })
})
