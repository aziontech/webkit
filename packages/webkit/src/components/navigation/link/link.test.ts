import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/link/default.vue'
import Disabled from '../../../../examples/link/disabled.vue'
import Sizes from '../../../../examples/link/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Link from './link.vue'

describe('Link', () => {
  it('renders as an anchor with the default testid and label', () => {
    const { getByTestId } = render(Link, { props: { label: 'Learn More' } })
    const root = getByTestId('link')

    expect(root.tagName).toBe('A')
    expect(getByTestId('link__label').textContent?.trim()).toBe('Learn More')
  })

  it('honors a consumer-provided data-testid across sub-elements', () => {
    const { getByTestId } = render(Link, {
      props: { label: 'Docs' },
      attrs: { 'data-testid': 'custom-link' }
    })

    expect(getByTestId('custom-link').tagName).toBe('A')
    expect(getByTestId('custom-link__content')).toBeTruthy()
    expect(getByTestId('custom-link__label').textContent?.trim()).toBe('Docs')
  })

  it('renders no surface element behind the label', () => {
    const { queryByTestId } = render(Link, { props: { label: 'Docs' } })
    expect(queryByTestId('link__ghost')).toBeNull()
  })

  it('applies href and defaults target to _self with no rel', () => {
    const { getByTestId } = render(Link, {
      props: { href: 'https://example.com', target: '_self' }
    })
    const root = getByTestId('link')

    expect(root.getAttribute('href')).toBe('https://example.com')
    expect(root.getAttribute('target')).toBe('_self')
    expect(root.getAttribute('rel')).toBeNull()
  })

  it('adds rel="noopener noreferrer" when target is _blank', () => {
    const { getByTestId } = render(Link, {
      props: { href: 'https://example.com', target: '_blank' }
    })
    const root = getByTestId('link')

    expect(root.getAttribute('target')).toBe('_blank')
    expect(root.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('renders the trailing icon when icon is set, hidden from assistive tech', () => {
    const { getByTestId } = render(Link, { props: { icon: 'ai ai-arrow-right' } })
    const icon = getByTestId('link__icon')

    expect(icon.classList.contains('ai-arrow-right')).toBe(true)
    expect(icon.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders no icon for a same-tab link by default', () => {
    const { queryByTestId } = render(Link, { props: { href: '/domains' } })

    expect(queryByTestId('link__icon')).toBeNull()
  })

  it('shows the external-link glyph for a _blank target when icon is empty', () => {
    const { getByTestId } = render(Link, {
      props: { href: 'https://example.com', target: '_blank' }
    })

    expect(getByTestId('link__icon').classList.contains('ai-external-link')).toBe(true)
  })

  it('ignores a removed showIcon attribute', () => {
    const { queryByTestId, getByTestId } = render(Link, { attrs: { showIcon: true } })

    expect(queryByTestId('link__icon')).toBeNull()
    expect(getByTestId('link').hasAttribute('showicon')).toBe(true)
  })

  it('renders the default slot as the label, falling back to label and the catalog', () => {
    const slotted = render(Link, {
      props: { label: 'Prop label' },
      slots: { default: 'Slotted label' }
    })
    expect(slotted.getByTestId('link__label').textContent?.trim()).toBe('Slotted label')
    slotted.unmount()

    const fallback = render(Link)
    expect(fallback.getByTestId('link__label').textContent?.trim()).toBe('Learn more')
  })

  it('renders # when href is empty so the anchor stays focusable', () => {
    const { getByTestId } = render(Link)

    expect(getByTestId('link').getAttribute('href')).toBe('#')
  })

  it('forwards consumer attributes and listeners to the anchor', async () => {
    let focused = 0
    const { getByTestId } = render(Link, {
      props: { label: 'Report', href: '/report.csv' },
      attrs: {
        id: 'report-link',
        'aria-describedby': 'report-hint',
        download: 'report.csv',
        'data-track': 'report',
        class: 'consumer-class',
        onFocus: () => {
          focused += 1
        }
      }
    })
    const root = getByTestId('link')

    expect(root.id).toBe('report-link')
    expect(root.getAttribute('aria-describedby')).toBe('report-hint')
    expect(root.getAttribute('download')).toBe('report.csv')
    expect(root.getAttribute('data-track')).toBe('report')
    expect(root.classList.contains('consumer-class')).toBe(true)

    root.focus()
    expect(focused).toBe(1)
  })

  it('omits the trailing icon when no icon is set and the target stays in the tab', () => {
    const { queryByTestId } = render(Link, { props: { icon: '', target: '_self' } })

    expect(queryByTestId('link__icon')).toBeNull()
  })

  it('emits click with the MouseEvent when enabled', async () => {
    const { getByTestId, emitted } = render(Link, { props: { disabled: false } })

    await fireEvent.click(getByTestId('link'))

    const clicks = emitted<unknown[]>().click
    expect(clicks).toHaveLength(1)
    expect(clicks[0][0]).toBeInstanceOf(MouseEvent)
  })

  it('does not emit click and exposes disabled a11y state when disabled', async () => {
    const { getByTestId, emitted } = render(Link, { props: { disabled: true } })
    const root = getByTestId('link')

    expect(root.getAttribute('aria-disabled')).toBe('true')
    expect(root.getAttribute('tabindex')).toBe('-1')
    expect(root.getAttribute('data-disabled')).toBe('true')

    await fireEvent.click(root)

    expect(emitted().click).toBeUndefined()
  })

  it('reflects the size prop on data-size and has no disabled attrs when enabled', () => {
    const { getByTestId } = render(Link, { props: { size: 'medium', disabled: false } })
    const root = getByTestId('link')

    expect(root.getAttribute('data-size')).toBe('medium')
    expect(root.getAttribute('aria-disabled')).toBeNull()
    expect(root.getAttribute('data-disabled')).toBeNull()
    expect(root.getAttribute('tabindex')).toBeNull()
  })

  it.each(['small', 'medium', 'large'] as const)('renders size variant %s', (size) => {
    const { getByTestId } = render(Link, { props: { size } })
    expect(getByTestId('link').getAttribute('data-size')).toBe(size)
  })

  it('has no a11y violations in the default render', async () => {
    const { container } = render(Link, { props: { label: 'Learn More' } })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the disabled render', async () => {
    const { container } = render(Link, { props: { label: 'Learn More', disabled: true } })
    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story', () => {
    const { getByTestId } = render(Default)
    expect(getByTestId('link').tagName).toBe('A')
  })

  it('renders the composed Sizes story', () => {
    const { getAllByTestId } = render(Sizes)
    const sizes = getAllByTestId('link').map((el) => el.getAttribute('data-size'))
    expect(sizes).toContain('large')
    expect(sizes).toContain('medium')
    expect(sizes).toContain('small')
  })

  it('renders the composed Disabled story with disabled a11y state', () => {
    const { getByTestId } = render(Disabled)
    expect(getByTestId('link').getAttribute('aria-disabled')).toBe('true')
  })
})
