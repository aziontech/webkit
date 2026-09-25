import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Topic from './topic.vue'

const TESTID = 'marketing-topic'
const TITLE = 'Consistent global speed'
const DESCRIPTION =
  'Serve content and run web apps across hundreds of locations with median latency under 30 ms.'

describe('Topic', () => {
  it('renders the title under the default testid', () => {
    const { getByTestId, getByText } = render(Topic, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(getByText(TITLE)).toBeInTheDocument()
  })

  it('lets a consumer-supplied data-testid win', () => {
    const { getByTestId } = render(Topic, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'custom-topic' }
    })

    expect(getByTestId('custom-topic')).toBeInTheDocument()
  })

  it('opens the heading at level 2 by default', () => {
    const { getByRole } = render(Topic, { props: { title: TITLE } })
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it.each([2, 3, 4] as const)('renders the heading at level %i', (headingLevel) => {
    const { getByRole } = render(Topic, { props: { title: TITLE, headingLevel } })
    expect(getByRole('heading', { level: headingLevel, name: TITLE })).toBeInTheDocument()
  })

  it('renders the description from the prop', () => {
    const { getByTestId, getByText } = render(Topic, {
      props: { title: TITLE, description: DESCRIPTION }
    })

    expect(getByText(DESCRIPTION)).toBeInTheDocument()
    expect(getByTestId(TESTID)).toHaveAttribute('data-described', 'true')
  })

  it('lets the default slot replace the description prop', () => {
    const { getByText, queryByText } = render(Topic, {
      props: { title: TITLE, description: DESCRIPTION },
      slots: { default: 'Composed body' }
    })

    expect(getByText('Composed body')).toBeInTheDocument()
    expect(queryByText(DESCRIPTION)).not.toBeInTheDocument()
  })

  it('renders no description region when neither prop nor slot is given', () => {
    const { getByTestId, container } = render(Topic, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).not.toHaveAttribute('data-described')
    expect(container.querySelector('p')).toBeNull()
  })

  it('renders the glyph as decorative and mirrors it on data-icon', () => {
    const { getByTestId, container } = render(Topic, {
      props: { title: TITLE, icon: 'ai ai-edge-nodes' }
    })
    const glyph = container.querySelector('i')

    expect(getByTestId(TESTID)).toHaveAttribute('data-icon', 'true')
    expect(glyph).toHaveAttribute('aria-hidden', 'true')
    expect(glyph).toHaveClass('ai-edge-nodes')
  })

  it('renders no glyph, and no data-icon, without an icon', () => {
    const { getByTestId, container } = render(Topic, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).not.toHaveAttribute('data-icon')
    expect(container.querySelector('i')).toBeNull()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(Topic, {
      props: { title: TITLE, description: DESCRIPTION, icon: 'ai ai-edge-nodes' }
    })
    await expectNoA11yViolations(container)
  })
})
