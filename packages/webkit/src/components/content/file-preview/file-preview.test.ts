import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/file-preview/default.vue'
import ErrorExample from '../../../../examples/file-preview/error.vue'
import Image from '../../../../examples/file-preview/image.vue'
import Loading from '../../../../examples/file-preview/loading.vue'
import Pdf from '../../../../examples/file-preview/pdf.vue'
import Text from '../../../../examples/file-preview/text.vue'
import Unknown from '../../../../examples/file-preview/unknown.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import FilePreview from './file-preview.vue'
import { decodeBase64Text, filePreviewType } from './lib/file-type'

const TEST_ID = 'file-preview'

const toBase64 = (text: string) => btoa(String.fromCharCode(...new TextEncoder().encode(text)))

const setPdfViewer = (enabled: boolean) =>
  Object.defineProperty(navigator, 'pdfViewerEnabled', { configurable: true, get: () => enabled })

describe('FilePreview', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'pdfViewerEnabled')
    vi.restoreAllMocks()
  })

  it('names the section after the file and shows its type and size', async () => {
    const view = render(Default)
    const root = view.getByTestId(TEST_ID)

    expect(view.getByRole('region', { name: 'settings.json' })).toBe(root)
    expect(view.getByTestId(`${TEST_ID}__meta`).textContent).toContain('application/json')
    expect(view.getByTestId(`${TEST_ID}__meta`).textContent).toContain('182')
    expect(root.getAttribute('data-type')).toBe('json')
    await expectNoA11yViolations(view.container)
  })

  it('lets a consumer data-testid win', () => {
    const view = render(FilePreview, {
      props: { fileName: 'a.txt', content: 'hello' },
      attrs: { 'data-testid': 'object-preview' }
    })
    expect(view.getByTestId('object-preview').getAttribute('data-type')).toBe('text')
    expect(view.getByTestId('object-preview__text').textContent).toBe('hello')
  })

  it('pretty-prints JSON that parses and shows JSON that does not as written', () => {
    const view = render(FilePreview, {
      props: { fileName: 'a.json', content: '{"a":1,"b":[2]}' }
    })
    expect(view.getByTestId(`${TEST_ID}__text`).textContent).toBe(
      '{\n  "a": 1,\n  "b": [\n    2\n  ]\n}'
    )
    const broken = within(
      render(FilePreview, { props: { fileName: 'b.json', content: '{"a":' } })
        .container as HTMLElement
    )
    expect(broken.getByTestId(`${TEST_ID}__text`).textContent).toBe('{"a":')
  })

  it('draws an image with the file name as its alternative text', async () => {
    const view = render(Image)
    const image = view.getByRole('img', { name: 'ai-gateway.svg' })
    expect(image.getAttribute('src')).toBeTruthy()
    expect(view.getByTestId(TEST_ID).getAttribute('data-type')).toBe('image')
    await expectNoA11yViolations(view.container)
  })

  it('falls back to the no-preview state when an image fails to load or has no src', async () => {
    const view = render(FilePreview, {
      props: { fileName: 'photo.png', src: 'data:image/png;base64,broken' }
    })
    await waitFor(() => expect(view.getByTestId(TEST_ID).getAttribute('data-type')).toBe('unknown'))
    expect(view.getByText('No preview for this file type')).toBeTruthy()
    const noSrc = within(
      render(FilePreview, { props: { fileName: 'photo.png' } }).container as HTMLElement
    )
    expect(noSrc.getByTestId(`${TEST_ID}__unsupported`)).toBeTruthy()
  })

  it('cuts long text at maxLength and says how much is shown', async () => {
    const view = render(Text)
    const text = view.getByTestId(`${TEST_ID}__text`)

    expect(text.textContent).toHaveLength(600)
    expect(view.getByTestId(TEST_ID).hasAttribute('data-truncated')).toBe(true)
    expect(view.getByTestId(`${TEST_ID}__truncated`).textContent).toContain(
      'Showing the first 600 characters'
    )
    expect(text.getAttribute('tabindex')).toBe('0')
    expect(view.getByRole('region', { name: 'Contents of access-2026-11-09.log' })).toBe(text)
    await expectNoA11yViolations(view.container)
  })

  it('does not mark short text as truncated', () => {
    const view = render(FilePreview, { props: { fileName: 'a.txt', content: 'short' } })
    expect(view.getByTestId(TEST_ID).hasAttribute('data-truncated')).toBe(false)
    expect(view.queryByTestId(`${TEST_ID}__truncated`)).toBeNull()
  })

  it('shows the no-preview state for a binary file and keeps the actions slot', async () => {
    const view = render(Unknown)
    expect(view.getByTestId(TEST_ID).getAttribute('data-type')).toBe('unknown')
    expect(view.getByText('Download the file to open it.')).toBeTruthy()
    expect(view.getByRole('button', { name: 'Copy link' })).toBeTruthy()
    await expectNoA11yViolations(view.container)
  })

  it('says an empty text file is empty', () => {
    const view = render(FilePreview, { props: { fileName: 'empty.txt' } })
    expect(view.getByTestId(`${TEST_ID}__empty`).textContent).toContain('This file is empty.')
  })

  it('shows a busy placeholder while loading and the error state with its message', async () => {
    const loading = render(Loading)
    const root = loading.getByTestId(TEST_ID)
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(root.hasAttribute('data-loading')).toBe(true)
    expect(loading.getByRole('status', { name: 'Loading preview' })).toBeTruthy()
    expect(loading.queryByTestId(`${TEST_ID}__text`)).toBeNull()
    await expectNoA11yViolations(loading.container)

    const failed = within(render(ErrorExample).container as HTMLElement)
    expect(failed.getByText('The preview could not load')).toBeTruthy()
    expect(failed.getByText(/preview service timed out/)).toBeTruthy()
    expect(failed.getByRole('button', { name: 'Download' })).toBeTruthy()
  })

  it('keeps the error example honest: the message never denies the access Download still offers', () => {
    const failed = within(render(ErrorExample).container as HTMLElement)
    expect(failed.getByRole('button', { name: 'Download' }).hasAttribute('disabled')).toBe(false)
    expect(failed.queryByText(/denied|403|forbidden/i)).toBeNull()
  })

  it('keeps the size whole and lets the type truncate first on a narrow card', () => {
    const view = render(FilePreview, {
      props: { fileName: 'a.json', mimeType: 'application/json', bytes: 182, content: '{}' }
    })
    const meta = view.getByTestId(`${TEST_ID}__meta`)
    const [kind, , size] = Array.from(meta.children)
    expect(kind?.textContent).toBe('application/json')
    expect(kind?.classList.contains('truncate')).toBe(true)
    expect(size?.textContent).toBe('182 B')
    expect(size?.classList.contains('shrink-0')).toBe(true)
    expect(meta.textContent).toBe('application/json · 182 B')
  })

  it('emits download with the click event', async () => {
    const view = render(FilePreview, { props: { fileName: 'a.txt', content: 'x' } })
    await fireEvent.click(view.getByRole('button', { name: 'Download' }))
    const emitted = view.emitted<unknown[]>()['download']
    expect(emitted).toHaveLength(1)
    expect(emitted![0]![0]).toBeInstanceOf(MouseEvent)
  })

  it('reads its strings from the ConfigProvider locale', () => {
    const view = render(ConfigProvider, {
      props: { locale: 'pt-BR', catalogs: LOCALES },
      slots: {
        default: () => h(FilePreview, { fileName: 'a.bin', mimeType: 'application/zip' })
      }
    })
    expect(view.getByRole('button', { name: 'Baixar' })).toBeTruthy()
    expect(view.getByText('Sem pré-visualização para este tipo de arquivo')).toBeTruthy()
  })

  it('draws a PDF from base64 in a named object when the browser has a PDF viewer', async () => {
    setPdfViewer(true)
    const view = render(Pdf)
    const root = view.getByTestId(TEST_ID)
    const document = await view.findByTestId(`${TEST_ID}__document`)

    expect(root.getAttribute('data-type')).toBe('pdf')
    expect(document.tagName).toBe('OBJECT')
    expect(document.getAttribute('type')).toBe('application/pdf')
    expect(document.getAttribute('data')).toMatch(/^blob:/)
    expect(document.getAttribute('title')).toBe('Preview of acme-invoice-1042.pdf')
    expect(view.getByTestId(TEST_ID).querySelector('i.az-file-pdf')).toBeTruthy()
    await expectNoA11yViolations(view.container)
  })

  it('keeps the PDF type and shows the no-preview body when the browser has no PDF viewer', async () => {
    setPdfViewer(false)
    const view = render(Pdf)
    await waitFor(() => expect(view.getByTestId(`${TEST_ID}__unsupported`)).toBeTruthy())
    expect(view.getByTestId(TEST_ID).getAttribute('data-type')).toBe('pdf')
    expect(view.queryByTestId(`${TEST_ID}__document`)).toBeNull()
    expect(view.getByRole('button', { name: 'Download' })).toBeTruthy()
    await expectNoA11yViolations(view.container)
  })

  it('prefers src over base64 and shows the no-preview body for a PDF with no source', async () => {
    setPdfViewer(true)
    const view = render(FilePreview, {
      props: { fileName: 'a.pdf', src: 'https://example.com/a.pdf', base64: toBase64('%PDF-1.4') }
    })
    const document = await view.findByTestId(`${TEST_ID}__document`)
    expect(document.getAttribute('data')).toBe('https://example.com/a.pdf')

    const empty = render(FilePreview, { props: { fileName: 'b.pdf' } })
    await waitFor(() =>
      expect(
        within(empty.container as HTMLElement).getByTestId(`${TEST_ID}__unsupported`)
      ).toBeTruthy()
    )
  })

  it('revokes the object URL it made when the source changes and on unmount', async () => {
    setPdfViewer(true)
    const revoke = vi.spyOn(URL, 'revokeObjectURL')
    const view = render(FilePreview, {
      props: { fileName: 'a.pdf', base64: toBase64('%PDF-1.4 one') }
    })
    const first = (await view.findByTestId(`${TEST_ID}__document`)).getAttribute('data')
    await view.rerender({ fileName: 'a.pdf', base64: toBase64('%PDF-1.4 two') })
    expect(revoke).toHaveBeenCalledWith(first)
    const second = view.getByTestId(`${TEST_ID}__document`).getAttribute('data')
    expect(second).not.toBe(first)
    view.unmount()
    expect(revoke).toHaveBeenCalledWith(second)
  })

  it('draws an image from base64, including a data URL', async () => {
    const pixel =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    const view = render(FilePreview, { props: { fileName: 'dot.png', base64: pixel } })
    const image = await view.findByRole('img', { name: 'dot.png' })
    expect(image.getAttribute('src')).toMatch(/^blob:/)
  })

  it('decodes base64 text and JSON as UTF-8 when there is no content', () => {
    const view = render(FilePreview, {
      props: { fileName: 'notes.txt', base64: toBase64('Olá, São Paulo') }
    })
    expect(view.getByTestId(`${TEST_ID}__text`).textContent).toBe('Olá, São Paulo')
    const json = within(
      render(FilePreview, {
        props: { fileName: 'a.json', base64: toBase64('{"a":1}'), content: '{"b":2}' }
      }).container as HTMLElement
    )
    expect(json.getByTestId(`${TEST_ID}__text`).textContent).toBe('{\n  "b": 2\n}')
    expect(decodeBase64Text('not base64!')).toBe('')
  })

  it.each([
    ['song.mp3', 'audio/mpeg', 'audio', 'az-headphones'],
    ['clip.webm', '', 'video', 'az-video']
  ])(
    'shows %s as a %s file card with Download and no player',
    (fileName, mimeType, type, glyph) => {
      const view = render(FilePreview, { props: { fileName, mimeType } })
      const root = view.getByTestId(TEST_ID)
      expect(root.getAttribute('data-type')).toBe(type)
      expect(root.querySelector(`header i.${glyph}`)).toBeTruthy()
      expect(view.getByTestId(`${TEST_ID}__unsupported`)).toBeTruthy()
      expect(root.querySelector('audio, video')).toBeNull()
      expect(view.getByRole('button', { name: 'Download' })).toBeTruthy()
    }
  )

  describe('filePreviewType', () => {
    it('reads the media type first, then the extension', () => {
      expect(filePreviewType('image/webp', 'x')).toBe('image')
      expect(filePreviewType('application/ld+json', 'x')).toBe('json')
      expect(filePreviewType('text/csv; charset=utf-8', 'x')).toBe('text')
      expect(filePreviewType('application/zip', 'x.json')).toBe('unknown')
      expect(filePreviewType('application/octet-stream', 'notes.md')).toBe('text')
      expect(filePreviewType('', 'logo.SVG')).toBe('image')
      expect(filePreviewType('', 'README')).toBe('unknown')
      expect(filePreviewType('application/pdf', 'x')).toBe('pdf')
      expect(filePreviewType('application/octet-stream', 'Invoice.PDF')).toBe('pdf')
      expect(filePreviewType('audio/ogg; codecs=opus', 'x')).toBe('audio')
      expect(filePreviewType('', 'talk.mov')).toBe('video')
    })
  })
})
