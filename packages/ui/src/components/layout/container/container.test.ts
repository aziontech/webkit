import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Container from './container.vue'

const TESTID = 'container'

describe('Container', () => {
  it('renders with the default testid and the default frame configuration', () => {
    const { getByTestId } = render(Container)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('data-width', '7xl')
    expect(root).toHaveAttribute('data-bordered')
    expect(root).not.toHaveAttribute('data-padded')
  })

  it('lets a consumer-supplied data-testid win', () => {
    const { getByTestId } = render(Container, {
      attrs: { 'data-testid': 'custom-column' }
    })
    expect(getByTestId('custom-column')).toBeInTheDocument()
  })

  it.each(['3xl', '4xl', '5xl', '6xl', '7xl', 'site'] as const)(
    'carries the %s width on data-width',
    (maxWidth) => {
      const { getByTestId } = render(Container, { props: { maxWidth } })
      expect(getByTestId(TESTID)).toHaveAttribute('data-width', maxWidth)
    }
  )

  it('drops the vertical rules when bordered is false', () => {
    const { getByTestId } = render(Container, { props: { bordered: false } })
    expect(getByTestId(TESTID)).not.toHaveAttribute('data-bordered')
  })

  it('pads the column when padded is set', () => {
    const { getByTestId } = render(Container, { props: { padded: true } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-padded')
  })

  it('renders its default slot', () => {
    const { getByText } = render(Container, {
      slots: { default: '<p>banded content</p>' }
    })
    expect(getByText('banded content')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(Container, {
      slots: { default: '<p>banded content</p>' }
    })
    await expectNoA11yViolations(container)
  })
})
