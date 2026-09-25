import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Quote from './quote.vue'

const TESTID = 'marketing-quote'

const props = {
  text: 'Magalu guarantees high availability for hundreds of global-scale applications.',
  name: 'Allan Monteiro',
  jobTitle: 'CISO & Head of Technology'
}

const logo = '/logos/magalu.svg'

describe('Quote', () => {
  it('renders the testimonial under the default testid', () => {
    const { getByTestId } = render(Quote, { props })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(Quote, {
      props,
      attrs: { 'data-testid': 'testimonial' }
    })

    expect(getByTestId('testimonial')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the quotation inside a blockquote', () => {
    const { container } = render(Quote, { props })

    expect(container.querySelector('blockquote')).toHaveTextContent(props.text)
  })

  it('lets the default slot replace the text prop', () => {
    const { container, queryByText } = render(Quote, {
      props,
      slots: { default: 'A quotation composed by the consumer.' }
    })

    expect(container.querySelector('blockquote')).toHaveTextContent(
      'A quotation composed by the consumer.'
    )
    expect(queryByText(props.text)).toBeNull()
  })

  it('attributes the quotation with the speaker and role in the figcaption', () => {
    const { container } = render(Quote, { props })

    expect(container.querySelector('figcaption')).toHaveTextContent(
      `${props.name} — ${props.jobTitle}`
    )
  })

  it('renders no mark when logo is empty', () => {
    const { container } = render(Quote, { props })

    expect(container.querySelector('img')).toBeNull()
  })

  it('renders the mark with logoAlt as its alternative text', () => {
    const { container } = render(Quote, {
      props: { ...props, logo, logoAlt: 'Magalu' }
    })
    const mark = container.querySelector('img')

    expect(mark).toHaveAttribute('src', logo)
    expect(mark).toHaveAttribute('alt', 'Magalu')
  })

  it('falls back to the role for the alternative text when logoAlt is empty', () => {
    const { container } = render(Quote, { props: { ...props, logo } })

    expect(container.querySelector('img')).toHaveAttribute('alt', props.jobTitle)
  })

  it('has no a11y violations with a mark and an attribution', async () => {
    const { container } = render(Quote, {
      props: { ...props, logo, logoAlt: 'Magalu' }
    })

    await expectNoA11yViolations(container)
  })

  it('carries its register on the root', () => {
    const { getByTestId } = render(Quote, { props })

    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'inline')
  })

  it('sets the speaker apart from the role in the signed register', () => {
    const { container } = render(Quote, { props: { ...props, kind: 'signed' } })
    const caption = container.querySelector('figcaption')

    expect(caption).toHaveTextContent(props.name)
    expect(caption).toHaveTextContent(props.jobTitle)
  })

  it.each(['inline', 'signed', 'highlight'] as const)(
    'leads the %s register with the quotation mark and no typed quote character',
    (kind) => {
      const { getByTestId, container } = render(Quote, { props: { ...props, kind } })
      const mark = getByTestId(TESTID).querySelector('svg')

      expect(mark).toBeInTheDocument()
      expect(mark).toHaveAttribute('aria-hidden', 'true')
      expect(container.querySelector('blockquote')?.textContent).not.toMatch(/["\u201c\u201d]/)
    }
  )

  it('shows the speaker initials when the highlight register has no photo', () => {
    const { getByText } = render(Quote, { props: { ...props, kind: 'highlight' } })

    expect(getByText('AM')).toBeInTheDocument()
  })

  it('lets the mark slot replace the logo image', () => {
    const { container, getByTestId } = render(Quote, {
      props: { ...props, logo },
      slots: { mark: '<span data-testid="client-mark">Magalu</span>' }
    })

    expect(getByTestId('client-mark')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders a trailing control from the actions slot', () => {
    const { getByRole } = render(Quote, {
      props,
      slots: { actions: '<a href="/clients">Clients</a>' }
    })

    expect(getByRole('link', { name: 'Clients' })).toBeInTheDocument()
  })

  it('renders no trailing control when the actions slot is not passed', () => {
    const { container } = render(Quote, { props })

    expect(container.querySelector('a')).toBeNull()
  })

  it('has no a11y violations in the signed register', async () => {
    const { container } = render(Quote, {
      props: { ...props, kind: 'signed', logo },
      slots: { actions: '<a href="/clients">Clients</a>' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the highlight register', async () => {
    const { container } = render(Quote, { props: { ...props, kind: 'highlight', logo } })

    await expectNoA11yViolations(container)
  })
})
