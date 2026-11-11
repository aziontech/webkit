import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import Default from '../../../../examples/file-token-group/default.vue'
import Horizontal from '../../../../examples/file-token-group/horizontal.vue'
import Uploading from '../../../../examples/file-token-group/uploading.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import FileTokenGroup, { type FileTokenGroupItem } from './file-token-group.vue'

const files = (): FileTokenGroupItem[] => [
  { file: { name: 'a.txt', size: 2048 } },
  { file: { name: 'b.png', size: 1024, type: 'image/png' }, error: 'Larger than 300 MB' },
  { file: { name: 'c.css', size: 10 } }
]

const Controlled = defineComponent({
  setup() {
    const items = ref(files())
    return () =>
      h(FileTokenGroup, {
        items: items.value,
        onDismiss: (index: number) => {
          items.value = items.value.filter((_, position) => position !== index)
        }
      })
  }
})

describe('FileTokenGroup', () => {
  it('renders a named list with one token per file, size and error', () => {
    const view = render(FileTokenGroup, { props: { items: files() } })
    const list = view.getByRole('list', { name: 'Files' })
    expect(list.querySelectorAll('li')).toHaveLength(3)
    expect(view.getByText('2 kB')).toBeTruthy()
    expect(view.getByText('Larger than 300 MB')).toBeTruthy()
    const tokens = view.getAllByTestId('input-file-token-group__token')
    expect(tokens.map((token) => token.getAttribute('data-status'))).toEqual([
      'idle',
      'error',
      'idle'
    ])
  })

  it('names a file from a folder by its relative path', () => {
    const file = new File(['x'], 'main.css', { type: 'text/css' })
    Object.defineProperty(file, 'webkitRelativePath', { value: 'site/css/main.css' })
    const view = render(FileTokenGroup, {
      props: {
        items: [
          { file },
          { file: { name: 'logo.svg', webkitRelativePath: 'site/logo.svg' }, loading: true }
        ]
      }
    })
    expect(view.getByText('site/css/main.css').closest('[title]')).toHaveAttribute(
      'title',
      'site/css/main.css'
    )
    expect(view.getByRole('button', { name: 'Remove site/css/main.css' })).toBeTruthy()
    expect(view.getByRole('progressbar', { name: 'Uploading site/logo.svg' })).toBeTruthy()
  })

  it('describes the remove button with the error', () => {
    const view = render(FileTokenGroup, { props: { items: files() } })
    const remove = view.getByRole('button', { name: 'Remove b.png' })
    const id = remove.getAttribute('aria-describedby')
    expect(id && document.getElementById(id)?.textContent).toContain('Larger than 300 MB')
  })

  it('emits dismiss with the index and moves focus to the next token', async () => {
    const view = render(Controlled)
    const remove = view.getByRole('button', { name: 'Remove b.png' })
    remove.focus()
    await fireEvent.click(remove)
    await waitFor(() => expect(view.queryByText('b.png')).toBeNull())
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('Remove c.css')
    )
  })

  it('moves focus to the list when the last token is removed', async () => {
    const One = defineComponent({
      setup() {
        const items = ref<FileTokenGroupItem[]>([{ file: { name: 'only.txt', size: 1 } }])
        return () =>
          h(FileTokenGroup, {
            items: items.value,
            onDismiss: () => {
              items.value = []
            }
          })
      }
    })
    const view = render(One)
    await fireEvent.click(view.getByRole('button', { name: 'Remove only.txt' }))
    await waitFor(() => expect(document.activeElement).toBe(view.getByRole('list')))
  })

  it('shows a progress bar while loading', () => {
    const view = render(Uploading)
    const bars = view.getAllByRole('progressbar')
    expect(bars).toHaveLength(2)
    expect(
      view.getByRole('progressbar', { name: 'Uploading app.js' }).getAttribute('aria-valuenow')
    ).toBe('64')
    expect(view.getByText(/· Modified /)).toBeTruthy()
  })

  it('limits the tokens behind a Show more toggle', async () => {
    const view = render(Horizontal)
    expect(view.getAllByRole('listitem')).toHaveLength(3)
    const toggle = view.getByRole('button', { name: 'Show 3 more files' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    await fireEvent.click(toggle)
    expect(view.getAllByRole('listitem')).toHaveLength(6)
    expect(
      view.getByRole('button', { name: 'Show fewer files' }).getAttribute('aria-expanded')
    ).toBe('true')
  })

  it('hides remove buttons when read-only', () => {
    const view = render(FileTokenGroup, { props: { items: files(), readonly: true } })
    expect(view.queryAllByRole('button')).toHaveLength(0)
  })

  it('reads the active locale', () => {
    const Host = defineComponent({
      render: () =>
        h(
          WebkitProvider,
          { locale: 'pt-BR', catalogs: LOCALES },
          { default: () => h(FileTokenGroup, { items: files() }) }
        )
    })
    const view = render(Host)
    expect(view.getByRole('list', { name: 'Arquivos' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Remover a.txt' })).toBeTruthy()
  })

  it('keeps file names in bdi under rtl', () => {
    const view = render(FileTokenGroup, { props: { items: files() }, attrs: { dir: 'rtl' } })
    expect(view.getByTestId('input-file-token-group').getAttribute('dir')).toBe('rtl')
    expect(view.getByText('a.txt').tagName).toBe('BDI')
  })

  it('has no axe violations', async () => {
    for (const example of [Default, Uploading, Horizontal]) {
      const view = render(example)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
