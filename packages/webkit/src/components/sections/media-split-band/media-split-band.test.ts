import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Code from '../../../../examples/media-split-band/code.vue'
import ProductMedia from '../../../../examples/media-split-band/product-media.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import MediaSplitBand from './media-split-band.vue'

const TESTID = 'sections-media-split-band'
const SPLIT_TESTID = 'marketing-media-split'
const EYEBROW = 'Our values'
const TITLE = 'Four values shape every role at Azion'
const DESCRIPTION = 'Quality, Drive, Accountability, and Innovation.'

const primaryAction = { label: 'Join us', href: '/careers' }
const secondaryAction = { label: 'Read the culture', href: '/culture', trailing: true }

const image = {
  src: '/marketing-components/illustrations/branches.svg',
  alt: 'Branches of a deployment',
  width: 360,
  height: 165
}

const codeTabs = [
  {
    label: 'OpenAI SDK',
    value: 'openai-sdk',
    language: 'ts',
    code: 'const client = new OpenAI()',
    fileName: 'client.ts',
    icon: 'ai-color ai-openai'
  },
  {
    label: 'GitHub Copilot',
    value: 'github-copilot',
    language: 'json',
    code: '[]',
    fileName: 'chatLanguageModels.json',
    icon: 'ai-color ai-microsoft-copilot'
  },
  { label: 'Empty', value: 'empty', code: '' }
]

const band = (props: Record<string, unknown> = {}) =>
  render(MediaSplitBand, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      image,
      ...props
    }
  })

describe('MediaSplitBand', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(MediaSplitBand, {
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

  it('defaults to the medium size', () => {
    const { getByTestId } = band()

    expect(getByTestId(SPLIT_TESTID).getAttribute('data-size')).toBe('medium')
  })

  it('renders an image with its alt and intrinsic size', () => {
    const { getByRole } = band()

    const picture = getByRole('img', { name: image.alt })
    expect(picture.getAttribute('src')).toBe(image.src)
    expect(picture.getAttribute('width')).toBe('360')
    expect(picture.getAttribute('height')).toBe('165')
  })

  it('draws the scene instead of the image when both are set', async () => {
    const { container, getByTestId } = band({ scene: { component: 'BrandGlobeScene' } })

    expect(container.querySelector(`img[src="${image.src}"]`)).toBeNull()
    await waitFor(
      () => expect(getByTestId(SPLIT_TESTID).getAttribute('data-media')).not.toBeNull(),
      { timeout: 5000 }
    )
  })

  it('omits the media cell when no media is set', () => {
    const { getByTestId } = band({ image: undefined })

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
    expect(button).toHaveAttribute('data-kind', 'outlined')
  })

  it('draws a lone secondary action the same way and links the band to it', () => {
    const { getByRole, getByTestId } = band({ secondaryAction })

    expect(getByRole('link', { name: secondaryAction.label })).toHaveAttribute(
      'data-kind',
      'outlined'
    )
    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-href')).toBe(true)
  })

  it('draws two actions as secondary then outlined', () => {
    const { getAllByRole } = band({ primaryAction, secondaryAction })

    expect(getAllByRole('link').map((link) => link.getAttribute('data-kind'))).toEqual([
      'secondary',
      'outlined'
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

  it('aligns the copy to the top at size medium and centres it at size large', () => {
    expect(band().getByTestId(SPLIT_TESTID)).toHaveAttribute('data-align', 'top')
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

    expect(
      getByTestId(TESTID).querySelector('[data-testid="marketing-texture-material"]')
    ).toHaveAttribute('data-kind', 'dots')
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'values' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'values')
  })

  it('binds the scene props onto the scene', async () => {
    const { findByTestId } = band({
      image: undefined,
      scene: { component: 'ProductWidget', props: { name: 'kv-store-key' } }
    })

    expect(await findByTestId('content-product-widget')).toHaveAttribute(
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

  it('draws a product widget, inset, instead of the image', async () => {
    const { container, findByTestId, getByTestId } = band({ widget: 'data-stream-source' })

    const widget = await findByTestId('content-product-widget', {}, { timeout: 5000 })
    expect(widget.getAttribute('data-name')).toBe('data-stream-source')
    expect(container.querySelector(`img[src="${image.src}"]`)).toBeNull()
    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-padded')).toBe(true)
  })

  it('draws a diagram, inset, when no widget is set', async () => {
    const { findByTestId, getByTestId, queryByTestId } = band({ diagram: 'cache' })

    const diagram = await findByTestId('marketing-diagram', {}, { timeout: 5000 })
    expect(diagram.getAttribute('data-name')).toBe('cache')
    expect(queryByTestId('content-product-widget')).toBeNull()
    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-padded')).toBe(true)
  })

  it('prefers the widget over the diagram', async () => {
    const { findByTestId, queryByTestId } = band({ widget: 'kv-store-key', diagram: 'cache' })

    await findByTestId('content-product-widget', {}, { timeout: 5000 })
    expect(queryByTestId('marketing-diagram')).toBeNull()
  })

  it('frames an image whole on a plate when image.framed is set', () => {
    const { getByRole, getByTestId } = band({ image: { ...image, framed: true } })

    expect(getByRole('img', { name: image.alt }).getAttribute('src')).toBe(image.src)
    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-padded')).toBe(true)
  })

  it('lets a plain image run flush', () => {
    const { getByTestId } = band()

    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-padded')).toBe(false)
  })

  it('has no a11y violations with a widget and with a diagram', async () => {
    const { container, findByTestId } = render(ProductMedia)

    await findByTestId('content-product-widget', {}, { timeout: 5000 })
    await findByTestId('marketing-diagram', {}, { timeout: 5000 })
    await expectNoA11yViolations(container)
  })

  it('draws a code sample, one tab per file with code, opening defaultFile', async () => {
    const { findAllByRole, container, getByTestId } = band({
      image: undefined,
      codeTabs,
      defaultFile: 'github-copilot'
    })

    const tabs = await findAllByRole('tab', {}, { timeout: 5000 })
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(['OpenAI SDK', 'GitHub Copilot'])
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(container.querySelectorAll('[role="tab"] i.ai-color')).toHaveLength(2)
    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-padded')).toBe(true)
  })

  it('opens the first tab when defaultFile names no tab', async () => {
    const { findAllByRole } = band({ image: undefined, codeTabs, defaultFile: 'nope' })

    const tabs = await findAllByRole('tab', {}, { timeout: 5000 })
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('does not link the band to a lone action while it shows code', async () => {
    const { findAllByRole, getByTestId } = band({ image: undefined, codeTabs, primaryAction })

    await findAllByRole('tab', {}, { timeout: 5000 })
    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-href')).toBe(false)
  })

  it('lets an action kind win over the drawn kind and draws its leading icon', () => {
    const { getByRole } = band({
      primaryAction: { ...primaryAction, kind: 'transparent' },
      secondaryAction: { ...secondaryAction, icon: 'ai ai-github', trailing: false }
    })

    expect(getByRole('link', { name: 'Join us' })).toHaveAttribute('data-kind', 'transparent')
    const second = getByRole('link', { name: secondaryAction.label })
    expect(second).toHaveAttribute('data-kind', 'outlined')
    expect(second.querySelector('.ai-github')).not.toBeNull()
  })

  it('has no a11y violations with a code sample', async () => {
    const { container, findByRole } = render(Code)

    await findByRole('button', { name: 'Copy the cache settings sample' }, { timeout: 5000 })
    await expectNoA11yViolations(container)
  })
})
