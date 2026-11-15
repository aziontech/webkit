import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import FeatureItem from './feature-item.vue'

const TESTID = 'feature-item'
const TITLE = 'Consistent global speed'
const DESCRIPTION =
  'Serve content and run web apps across hundreds of locations with median latency under 30 ms.'

describe('FeatureItem', () => {
  it('renders the title under the default testid', () => {
    const { getByTestId, getByText } = render(FeatureItem, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(getByText(TITLE)).toBeInTheDocument()
  })

  it('lets a consumer-supplied data-testid win', () => {
    const { getByTestId } = render(FeatureItem, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'custom-topic' }
    })

    expect(getByTestId('custom-topic')).toBeInTheDocument()
  })

  it('opens the heading at level 2 by default', () => {
    const { getByRole } = render(FeatureItem, { props: { title: TITLE } })
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it.each([2, 3, 4] as const)('renders the heading at level %i', (headingLevel) => {
    const { getByRole } = render(FeatureItem, { props: { title: TITLE, headingLevel } })
    expect(getByRole('heading', { level: headingLevel, name: TITLE })).toBeInTheDocument()
  })

  it('renders the description from the prop', () => {
    const { getByTestId, getByText } = render(FeatureItem, {
      props: { title: TITLE, description: DESCRIPTION }
    })

    expect(getByText(DESCRIPTION)).toBeInTheDocument()
    expect(getByTestId(TESTID)).toHaveAttribute('data-described', 'true')
  })

  it('lets the default slot replace the description prop', () => {
    const { getByText, queryByText } = render(FeatureItem, {
      props: { title: TITLE, description: DESCRIPTION },
      slots: { default: 'Composed body' }
    })

    expect(getByText('Composed body')).toBeInTheDocument()
    expect(queryByText(DESCRIPTION)).not.toBeInTheDocument()
  })

  it('renders no description region when neither prop nor slot is given', () => {
    const { getByTestId, container } = render(FeatureItem, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).not.toHaveAttribute('data-described')
    expect(container.querySelector('p')).toBeNull()
  })

  it('renders the glyph as decorative and mirrors it on data-icon', () => {
    const { getByTestId, container } = render(FeatureItem, {
      props: { title: TITLE, icon: 'ai ai-edge-nodes' }
    })
    const glyph = container.querySelector('i')

    expect(getByTestId(TESTID)).toHaveAttribute('data-icon', 'true')
    expect(glyph).toHaveAttribute('aria-hidden', 'true')
    expect(glyph).toHaveClass('ai-edge-nodes')
  })

  it('renders no glyph, and no data-icon, without an icon', () => {
    const { getByTestId, container } = render(FeatureItem, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).not.toHaveAttribute('data-icon')
    expect(container.querySelector('i')).toBeNull()
  })

  it('renders the whole claim as one link when href is set', () => {
    const { getByTestId, getByRole } = render(FeatureItem, {
      props: { title: TITLE, description: DESCRIPTION, href: '/products/cache' }
    })
    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('A')
    expect(root).toHaveAttribute('href', '/products/cache')
    expect(root).toHaveAttribute('data-linked', 'true')
    expect(getByRole('link')).toBe(root)
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('closes a linked headline on a decorative arrow', () => {
    const { container } = render(FeatureItem, { props: { title: TITLE, href: '/products/cache' } })
    const arrow = container.querySelector('.ai-arrow-up-right')

    expect(arrow).not.toBeNull()
    expect(arrow).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders a div, with no arrow and no data-linked, without an href', () => {
    const { getByTestId, container, queryByRole } = render(FeatureItem, { props: { title: TITLE } })

    expect(getByTestId(TESTID).tagName).toBe('DIV')
    expect(getByTestId(TESTID)).not.toHaveAttribute('data-linked')
    expect(container.querySelector('.ai-arrow-up-right')).toBeNull()
    expect(queryByRole('link')).toBeNull()
  })

  it('has no accessibility violations when linked', async () => {
    const { container } = render(FeatureItem, {
      props: {
        title: TITLE,
        description: DESCRIPTION,
        icon: 'ai ai-edge-nodes',
        href: '/products/cache'
      }
    })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(FeatureItem, {
      props: { title: TITLE, description: DESCRIPTION, icon: 'ai ai-edge-nodes' }
    })
    await expectNoA11yViolations(container)
  })

  describe('slot presence', () => {
    it('follows a v-if slot that appears and disappears after mount', async () => {
      const shown = ref(false)
      const { queryByTestId } = render({
        components: { FeatureItem },
        setup: () => ({ shown }),
        template: `<FeatureItem title="Edge"><template v-if="shown" #default><span data-testid="probe">Slotted</span></template></FeatureItem>`
      })
      expect(queryByTestId('feature-item')?.hasAttribute('data-described')).toBe(false)

      shown.value = true
      await nextTick()
      expect(queryByTestId('feature-item')?.hasAttribute('data-described')).toBe(true)
      expect(queryByTestId('probe')).not.toBeNull()

      shown.value = false
      await nextTick()
      expect(queryByTestId('feature-item')?.hasAttribute('data-described')).toBe(false)
      expect(queryByTestId('probe')).toBeNull()
    })
  })
})
