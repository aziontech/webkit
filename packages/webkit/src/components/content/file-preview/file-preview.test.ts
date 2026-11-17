import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/file-preview/default.vue'
import ErrorExample from '../../../../examples/file-preview/error.vue'
import Image from '../../../../examples/file-preview/image.vue'
import Loading from '../../../../examples/file-preview/loading.vue'
import Text from '../../../../examples/file-preview/text.vue'
import Unknown from '../../../../examples/file-preview/unknown.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import FilePreview from './file-preview.vue'
import { filePreviewType } from './lib/file-type'

const TEST_ID = 'file-preview'

describe('FilePreview', () => {
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
    expect(failed.getByText(/Access denied \(403\)/)).toBeTruthy()
    expect(failed.getByRole('button', { name: 'Download' })).toBeTruthy()
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

  describe('filePreviewType', () => {
    it('reads the media type first, then the extension', () => {
      expect(filePreviewType('image/webp', 'x')).toBe('image')
      expect(filePreviewType('application/ld+json', 'x')).toBe('json')
      expect(filePreviewType('text/csv; charset=utf-8', 'x')).toBe('text')
      expect(filePreviewType('application/zip', 'x.json')).toBe('unknown')
      expect(filePreviewType('application/octet-stream', 'notes.md')).toBe('text')
      expect(filePreviewType('', 'logo.SVG')).toBe('image')
      expect(filePreviewType('', 'README')).toBe('unknown')
    })
  })
})
