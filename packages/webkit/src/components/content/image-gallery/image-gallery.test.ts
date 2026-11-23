import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { h } from 'vue'

import Base64 from '../../../../examples/image-gallery/base64.vue'
import Default from '../../../../examples/image-gallery/default.vue'
import ErrorExample from '../../../../examples/image-gallery/error.vue'
import Loading from '../../../../examples/image-gallery/loading.vue'
import Single from '../../../../examples/image-gallery/single.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import ImageGallery from './image-gallery.vue'
import { imageFileName, imageSource } from './lib/image-source'

const TEST_ID = 'image-gallery'
const PIXEL =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

function viewer() {
  return within(document.body).getByRole('dialog')
}

describe('ImageGallery', () => {
  it('renders a named list of thumbnail buttons that open a dialog', async () => {
    const view = render(Default)
    const root = view.getByTestId(TEST_ID)
    const list = view.getByRole('list', { name: 'Images' })
    const buttons = within(list).getAllByRole('button')

    expect(root.getAttribute('data-layout')).toBe('grid')
    expect(buttons).toHaveLength(4)
    expect(buttons[0]!.getAttribute('aria-haspopup')).toBe('dialog')
    expect(view.getByRole('button', { name: 'DDoS protection illustration' })).toBe(buttons[1])
    await expectNoA11yViolations(view.container)
  })

  it('lets a consumer data-testid win', () => {
    const view = render(ImageGallery, {
      props: { items: [{ src: `data:image/png;base64,${PIXEL}` }] },
      attrs: { 'data-testid': 'chat-images' }
    })
    expect(view.getByTestId('chat-images').getAttribute('data-layout')).toBe('single')
    expect(view.getAllByTestId('chat-images__item')).toHaveLength(1)
  })

  it('names an image with no alt by its position', () => {
    const view = render(ImageGallery, {
      props: {
        items: [
          { data: PIXEL, mimeType: 'image/png' },
          { data: PIXEL, mimeType: 'image/png' }
        ]
      }
    })
    expect(view.getByTestId(TEST_ID).getAttribute('data-layout')).toBe('pair')
    expect(view.getByRole('button', { name: 'Image 2 of 2' })).toBeTruthy()
  })

  it('builds a data URL from base64 data and its media type', async () => {
    const view = render(Base64)
    const image = view.getByRole('img', { name: /Orange sunset/ }) as HTMLImageElement
    expect(image.getAttribute('src')!.startsWith('data:image/svg+xml;base64,')).toBe(true)
    await expectNoA11yViolations(view.container)
  })

  it('opens the viewer on the selected image and moves with Previous and Next', async () => {
    const view = render(Default)
    const opener = view.getByRole('button', { name: 'Usage chart illustration' })
    await userEvent.click(opener)

    const dialog = await waitFor(() => viewer())
    const ui = within(dialog)
    expect(ui.getByRole('heading', { name: 'Usage chart illustration' })).toBeTruthy()
    expect(ui.getByText('3 of 4')).toBeTruthy()

    await userEvent.click(ui.getByRole('button', { name: 'Next image' }))
    await waitFor(() => expect(ui.getByText('4 of 4')).toBeTruthy())
    const next = ui.getByRole('button', { name: 'Next image' }) as HTMLButtonElement
    expect(next.disabled).toBe(true)
    expect(document.activeElement).toBe(ui.getByRole('button', { name: 'Previous image' }))

    await userEvent.click(ui.getByRole('button', { name: 'Previous image' }))
    await waitFor(() => expect(ui.getByText('3 of 4')).toBeTruthy())
    await expectNoA11yViolations(dialog)

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(opener))
  })

  it('follows the arrow keys, Home and End in the viewer', async () => {
    const view = render(Default)
    await userEvent.click(view.getByRole('button', { name: 'AI gateway illustration' }))
    const ui = within(await waitFor(() => viewer()))

    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(ui.getByText('2 of 4')).toBeTruthy())
    await userEvent.keyboard('{End}')
    await waitFor(() => expect(ui.getByText('4 of 4')).toBeTruthy())
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() => expect(ui.getByText('3 of 4')).toBeTruthy())
    await userEvent.keyboard('{Home}')
    await waitFor(() => expect(ui.getByText('1 of 4')).toBeTruthy())
    expect((ui.getByRole('button', { name: 'Previous image' }) as HTMLButtonElement).disabled).toBe(
      true
    )
  })

  it('swaps the arrow keys under rtl', async () => {
    const view = render(ConfigProvider, {
      props: { dir: 'rtl' },
      slots: { default: () => h(Default) }
    })
    await userEvent.click(view.getByRole('button', { name: 'AI gateway illustration' }))
    const ui = within(await waitFor(() => viewer()))

    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() => expect(ui.getByText('2 of 4')).toBeTruthy())
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(ui.getByText('1 of 4')).toBeTruthy())
  })

  it('downloads through a link named after the file', async () => {
    const view = render(Single)
    await userEvent.click(view.getByRole('button', { name: 'AI gateway illustration' }))
    const ui = within(await waitFor(() => viewer()))
    expect(ui.queryByRole('button', { name: 'Next image' })).toBeNull()
    expect(ui.queryByText(/of 1/)).toBeNull()

    const link = ui.getByRole('link', { name: 'Download' })
    expect(link.getAttribute('download')).toBe('acme-ai-gateway.svg')
    link.addEventListener('click', (event) => event.preventDefault())
    await userEvent.click(link)
    expect(within(document.body).getByRole('dialog')).toBeTruthy()
  })

  it('emits download on the root component', async () => {
    const view = render(ImageGallery, {
      props: {
        items: [{ key: 'one', data: PIXEL, alt: 'A white pixel' }],
        onDownload: (event: MouseEvent) => event.preventDefault()
      }
    })
    await userEvent.click(view.getByRole('button', { name: 'A white pixel' }))
    const ui = within(await waitFor(() => viewer()))
    const link = ui.getByRole('link', { name: 'Download' })
    expect(link.getAttribute('download')).toBe('image-1.png')
    await userEvent.click(link)

    const emitted = view.emitted<unknown[]>()['download']
    expect(emitted).toHaveLength(1)
    expect(emitted![0]![0]).toBeInstanceOf(MouseEvent)
    expect(emitted![0]![1]).toMatchObject({ key: 'one', alt: 'A white pixel' })
  })

  it('holds a placeholder per image still generating and announces it', async () => {
    const view = render(Loading)
    const root = view.getByTestId(TEST_ID)
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(root.hasAttribute('data-loading')).toBe(true)
    expect(root.getAttribute('data-layout')).toBe('grid')
    expect(view.getAllByTestId(`${TEST_ID}__item`)).toHaveLength(1)
    const placeholders = view.getAllByTestId(`${TEST_ID}__placeholder`)
    expect(placeholders).toHaveLength(3)
    expect(placeholders.every((item) => item.getAttribute('aria-hidden') === 'true')).toBe(true)
    expect(view.getByRole('status').textContent).toContain('Generating images')
    await expectNoA11yViolations(view.container)
  })

  it('shows no placeholder once the images reach the expected count, then says they are ready', async () => {
    const items = [
      { key: 'a', data: PIXEL, alt: 'First' },
      { key: 'b', data: PIXEL, alt: 'Second' }
    ]
    const view = render(ImageGallery, { props: { items, loading: true, expectedCount: 2 } })
    expect(view.queryAllByTestId(`${TEST_ID}__placeholder`)).toHaveLength(0)

    await view.rerender({ items, loading: false, expectedCount: 2 })
    expect(view.getByRole('status').textContent).toContain('Images ready')
    expect(view.getByTestId(TEST_ID).hasAttribute('aria-busy')).toBe(false)
  })

  it('replaces the grid with the error in an alert region', async () => {
    const view = render(ErrorExample)
    const root = view.getByTestId(TEST_ID)
    expect(root.hasAttribute('data-error')).toBe(true)
    expect(view.queryByRole('list')).toBeNull()
    const alert = view.getByRole('alert')
    expect(alert.textContent).toContain('The images could not load')
    expect(alert.textContent).toContain('The image model was busy')
    expect(alert.textContent).not.toMatch(/try again/i)
    await expectNoA11yViolations(view.container)
  })

  it('lets the error win over images and placeholders', () => {
    const view = render(ImageGallery, {
      props: { items: [{ data: PIXEL }], loading: true, expectedCount: 3, error: 'Quota reached.' }
    })
    expect(view.queryByRole('list')).toBeNull()
    expect(view.queryAllByTestId(`${TEST_ID}__placeholder`)).toHaveLength(0)
  })

  it('shows the empty state with no images', () => {
    const view = render(ImageGallery)
    expect(view.getByTestId(TEST_ID).hasAttribute('data-empty')).toBe(true)
    expect(view.getByText('No images')).toBeTruthy()
  })

  it('marks an image that fails to load and keeps its name', async () => {
    const view = render(ImageGallery, {
      props: { items: [{ key: 'gone', src: 'data:image/png;base64,broken', alt: 'Lost image' }] }
    })
    const button = view.getByRole('button', { name: 'Lost image' })
    await waitFor(() => expect(button.hasAttribute('data-broken')).toBe(true))
    expect(view.getByRole('button', { name: 'Lost image' })).toBe(button)

    await userEvent.click(button)
    const ui = within(await waitFor(() => viewer()))
    expect(ui.getByText('This image could not load')).toBeTruthy()
    expect(ui.getByRole('link', { name: 'Download' })).toBeTruthy()
  })

  it('reads its strings from the ConfigProvider locale', () => {
    const view = render(ConfigProvider, {
      props: { locale: 'pt-BR', catalogs: LOCALES },
      slots: {
        default: () =>
          h(ImageGallery, {
            items: [{ data: PIXEL }, { data: PIXEL }]
          })
      }
    })
    expect(view.getByRole('list', { name: 'Imagens' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Imagem 1 de 2' })).toBeTruthy()
  })

  describe('image-source', () => {
    it('prefers src, keeps a data URL as is and defaults the media type', () => {
      expect(imageSource({ src: 'https://example.com/a.png', data: PIXEL })).toBe(
        'https://example.com/a.png'
      )
      expect(imageSource({ data: 'data:image/webp;base64,AAAA' })).toBe(
        'data:image/webp;base64,AAAA'
      )
      expect(imageSource({ data: 'AAAA' })).toBe('data:image/png;base64,AAAA')
      expect(imageSource({})).toBe('')
    })

    it('names the download from the item, the URL or the media type', () => {
      expect(imageFileName({ fileName: 'cover.png' }, 1)).toBe('cover.png')
      expect(imageFileName({ src: 'https://example.com/images/harbor.jpg?v=2' }, 2)).toBe(
        'harbor.jpg'
      )
      expect(imageFileName({ data: 'AAAA', mimeType: 'image/jpeg' }, 3)).toBe('image-3.jpg')
      expect(imageFileName({ data: 'data:image/webp;base64,AAAA' }, 4)).toBe('image-4.webp')
    })
  })
})
