import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Module from './module.vue'

const TESTID = 'module'

describe('Module', () => {
  it('renders with the default testid and the default brick configuration', () => {
    const { getByTestId } = render(Module)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    expect(root.tagName).toBe('SECTION')
    expect(root).toHaveAttribute('data-align', 'start')
    expect(root).toHaveAttribute('data-divided')
    expect(root).toHaveAttribute('data-padded')
  })

  it('lets a consumer-supplied data-testid win', () => {
    const { getByTestId } = render(Module, {
      attrs: { 'data-testid': 'custom-module' }
    })
    expect(getByTestId('custom-module')).toBeInTheDocument()
  })

  it('drops its top rule when divided is false', () => {
    const { getByTestId } = render(Module, { props: { divided: false } })
    expect(getByTestId(TESTID)).not.toHaveAttribute('data-divided')
  })

  it('drops its body padding when padded is false', () => {
    const { getByTestId } = render(Module, { props: { padded: false } })
    expect(getByTestId(TESTID)).not.toHaveAttribute('data-padded')
  })

  it('renders the default header from title, eyebrow and description', () => {
    const { getByRole, getByText } = render(Module, {
      props: { title: 'Platform', eyebrow: 'Build', description: 'One sentence.' }
    })

    expect(getByRole('heading', { level: 2, name: 'Platform' })).toBeInTheDocument()
    expect(getByText('Build')).toBeInTheDocument()
    expect(getByText('One sentence.')).toBeInTheDocument()
  })

  it('renders no header row when there is no title and no header slot', () => {
    const { queryByRole } = render(Module, { slots: { default: '<p>body</p>' } })
    expect(queryByRole('heading')).toBeNull()
  })

  it('lets the header slot replace the default header row', () => {
    const { getByText, queryByRole } = render(Module, {
      props: { title: 'Platform' },
      slots: { header: '<div>custom header</div>' }
    })

    expect(getByText('custom header')).toBeInTheDocument()
    expect(queryByRole('heading', { name: 'Platform' })).toBeNull()
  })

  it('renders the actions slot inside the default header row', () => {
    const { getByText } = render(Module, {
      props: { title: 'Platform' },
      slots: { actions: '<button>Docs</button>' }
    })
    expect(getByText('Docs')).toBeInTheDocument()
  })

  it('renders its body', () => {
    const { getByText } = render(Module, { slots: { default: '<p>body</p>' } })
    expect(getByText('body')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(Module, {
      props: { title: 'Platform', eyebrow: 'Build' },
      slots: { default: '<p>body</p>' }
    })
    await expectNoA11yViolations(container)
  })
})
