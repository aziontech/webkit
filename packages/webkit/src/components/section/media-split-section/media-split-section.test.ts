import { render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ProductMedia from '../../../../examples/media-split-section/product-media.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import MediaSplitSection from './media-split-section.vue'

const TESTID = 'media-split-section'
const SPLIT_TESTID = 'media-split'
const EYEBROW = 'Our values'
const TITLE = 'Four values shape every role at Azion'
const DESCRIPTION = 'Quality, Drive, Accountability, and Innovation.'

const primaryAction = { label: 'Join us', href: '/careers' }
const secondaryAction = { label: 'Read the culture', href: '/culture', trailing: true }

const ILLUSTRATION = 'branches'
const ILLUSTRATION_LABEL = 'Branches of a deployment'

const band = (props: Record<string, unknown> = {}) =>
  render(MediaSplitSection, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      illustration: ILLUSTRATION,
      ...props
    }
  })

describe('MediaSplitSection', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(MediaSplitSection, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'values-band' }
    })

    expect(getByTestId('values-band')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the h2 that names the band region', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByRole('region', { name: TITLE })).toBeInTheDocument()
  })

  it('renders the eyebrow and the description', () => {
    const { getByText } = band()

    expect(getByText(EYEBROW)).toBeInTheDocument()
    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it.each(['medium', 'large'] as const)('forwards size=%s to the media split', (size) => {
    const { getByTestId } = band({ size })

    expect(getByTestId(SPLIT_TESTID).getAttribute('data-size')).toBe(size)
  })

  it('sets every band action at the 40px touch floor', () => {
    const { container } = band({
      primaryAction,
      secondaryAction: { label: 'Read more', href: '/about' }
    })
    const buttons = [...container.querySelectorAll('[data-testid="button"]')]

    expect(buttons).toHaveLength(2)
    buttons.forEach((button) => expect(button).toHaveAttribute('data-size', 'large'))
  })

  it('defaults to the medium size', () => {
    const { getByTestId } = band()

    expect(getByTestId(SPLIT_TESTID).getAttribute('data-size')).toBe('medium')
  })

  it('draws the illustration from the registry under its accessible name', async () => {
    const { findByTestId } = band({ illustrationAriaLabel: ILLUSTRATION_LABEL })

    const scene = await findByTestId('illustration')
    await waitFor(() => expect(scene).toHaveAttribute('aria-label', ILLUSTRATION_LABEL))
    expect(scene).toHaveAttribute('role', 'img')
    expect(scene.getAttribute('data-placeholder')).toBeNull()
  })

  it('draws the scene instead of the illustration when both are set', async () => {
    const { getByTestId, queryByTestId } = band({ scene: { component: 'BrandGlobeScene' } })

    expect(queryByTestId('illustration')).toBeNull()
    await waitFor(
      () => expect(getByTestId(SPLIT_TESTID).getAttribute('data-media')).not.toBeNull(),
      { timeout: 5000 }
    )
  })

  it('omits the media cell when no media is set', () => {
    const { getByTestId } = band({ illustration: '' })

    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media')).toBe(false)
  })

  it('links the whole band to its only action', () => {
    const { getByTestId, getAllByRole } = band({ primaryAction })

    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-href')).toBe(true)
    expect(
      getAllByRole('link').some((link) => link.getAttribute('href') === primaryAction.href)
    ).toBe(true)
  })

  it('leaves the band unlinked with two actions and renders both buttons in order', () => {
    const { getByTestId, getAllByRole } = band({ primaryAction, secondaryAction })

    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-href')).toBe(false)
    expect(getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      primaryAction.href,
      secondaryAction.href
    ])
  })

  it('draws a lone action as an outlined button closed by the chevron', () => {
    const { getByRole } = band({ primaryAction: { label: 'Join us', href: '/careers' } })

    const button = getByRole('link', { name: 'Join us' })
    expect(button).toHaveAttribute('data-variant', 'outline')
  })

  it('draws a lone secondary action the same way and links the band to it', () => {
    const { getByRole, getByTestId } = band({ secondaryAction })

    expect(getByRole('link', { name: secondaryAction.label })).toHaveAttribute(
      'data-variant',
      'outline'
    )
    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-href')).toBe(true)
  })

  it('draws two actions as secondary then outlined', () => {
    const { getAllByRole } = band({ primaryAction, secondaryAction })

    expect(getAllByRole('link').map((link) => link.getAttribute('data-variant'))).toEqual([
      'secondary',
      'outline'
    ])
  })

  it('leaves the band unlinked with one action when linked is off', () => {
    const { getByTestId, getByRole } = band({ primaryAction, linked: false })

    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-href')).toBe(false)
    expect(getByRole('link', { name: primaryAction.label })).toHaveAttribute(
      'href',
      primaryAction.href
    )
  })

  it('aligns the copy to the start at size medium and centres it at size large', () => {
    expect(band().getByTestId(SPLIT_TESTID)).toHaveAttribute('data-align', 'start')
    expect(band({ size: 'large' }).getAllByTestId(SPLIT_TESTID)[1]).toHaveAttribute(
      'data-align',
      'center'
    )
  })

  it('forwards the orientation to the media split', () => {
    const { getByTestId } = band({ orientation: 'vertical' })

    expect(getByTestId(SPLIT_TESTID)).toHaveAttribute('data-orientation', 'vertical')
  })

  it('paints the chosen texture under the media', () => {
    const { getByTestId } = band({ texture: 'dots' })

    expect(getByTestId(TESTID).querySelector('[data-testid="texture"]')).toHaveAttribute(
      'data-variant',
      'dots'
    )
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'values' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'values')
  })

  it('binds the scene props onto the scene', async () => {
    const { findByTestId } = band({
      illustration: '',
      scene: { component: 'ConsoleMockup', props: { name: 'kv-store-key' } }
    })

    expect(await findByTestId('console-mockup', {}, { timeout: 5000 })).toHaveAttribute(
      'data-name',
      'kv-store-key'
    )
  })

  it('is not a link without actions', () => {
    const { getByTestId, queryAllByRole } = band()

    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-href')).toBe(false)
    expect(queryAllByRole('link')).toHaveLength(0)
  })

  it('renders only the root when title is empty', () => {
    const { getByTestId, queryByTestId } = band({ title: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByTestId(SPLIT_TESTID)).toBeNull()
  })

  it('has no a11y violations with two actions', async () => {
    const { container } = band({ primaryAction, secondaryAction })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when the band links', async () => {
    const { container } = band({ primaryAction })

    await expectNoA11yViolations(container)
  })

  it('draws a product widget, inset, instead of the illustration', async () => {
    const { findByTestId, getByTestId, queryByTestId } = band({ widget: 'data-stream-source' })

    const widget = await findByTestId('console-mockup', {}, { timeout: 5000 })
    expect(widget.getAttribute('data-name')).toBe('data-stream-source')
    expect(queryByTestId('illustration')).toBeNull()
    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-padded')).toBe(true)
  })

  it('draws neither a diagram nor code: a band with only those has no media and warns', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { getByTestId, queryByTestId, queryAllByRole } = band({
      illustration: '',
      diagram: 'cache',
      codeTabs: [{ label: 'A', value: 'a', code: 'const a = 1' }]
    })

    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(queryByTestId('diagram')).toBeNull()
    expect(queryAllByRole('tab')).toHaveLength(0)
    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media')).toBe(false)
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0]?.[0]).toContain('has no media')
  })

  it('treats a Diagram scene as no media', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    band({ illustration: '', scene: { component: 'Diagram', props: { name: 'cache' } } })

    expect(warn).toHaveBeenCalledOnce()
  })

  it('does not warn with a media set', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    band()

    expect(warn).not.toHaveBeenCalled()
  })

  it('insets an illustration like a widget, and lets a scene run flush', () => {
    const { getByTestId, unmount } = band()
    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-padded')).toBe(true)
    unmount()

    const scene = band({ scene: { component: 'BrandGlobeScene' } })
    expect(scene.getByTestId(SPLIT_TESTID).hasAttribute('data-media-padded')).toBe(false)
  })

  it('has no a11y violations with a widget and with an illustration', async () => {
    const { container, findByTestId } = render(ProductMedia)

    await findByTestId('console-mockup', {}, { timeout: 5000 })
    await expectNoA11yViolations(container)
  })

  it('lets an action variant win over the drawn variant and draws its leading icon', () => {
    const { getByRole } = band({
      primaryAction: { ...primaryAction, variant: 'ghost' },
      secondaryAction: { ...secondaryAction, icon: 'az az-github', trailing: false }
    })

    expect(getByRole('link', { name: 'Join us' })).toHaveAttribute('data-variant', 'ghost')
    const second = getByRole('link', { name: secondaryAction.label })
    expect(second).toHaveAttribute('data-variant', 'outline')
    expect(second.querySelector('.az-github')).not.toBeNull()
  })
})
