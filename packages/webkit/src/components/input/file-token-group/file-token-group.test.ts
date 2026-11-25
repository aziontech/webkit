import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import Default from '../../../../examples/file-token-group/default.vue'
import Horizontal from '../../../../examples/file-token-group/horizontal.vue'
import ReadOnly from '../../../../examples/file-token-group/readonly.vue'
import Uploading from '../../../../examples/file-token-group/uploading.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
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
        onRemove: (_event: MouseEvent, { index }: { index: number }) => {
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
    const tokens = view.getAllByTestId('file-token-group__token')
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

  it('emits remove with the index and moves focus to the next token', async () => {
    const view = render(Controlled)
    const remove = view.getByRole('button', { name: 'Remove b.png' })
    remove.focus()
    await fireEvent.click(remove)
    await waitFor(() => expect(view.queryByText('b.png')).toBeNull())
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('Remove c.css')
    )
  })

  it('emits remove with the event first and the index and item, from pointer and keyboard', async () => {
    const user = userEvent.setup()
    const items = files()
    const view = render(FileTokenGroup, { props: { items } })
    await user.click(view.getByRole('button', { name: 'Remove b.png' }))
    view.getByRole('button', { name: 'Remove c.css' }).focus()
    await user.keyboard('{Enter}')
    const dismissed = view.emitted('remove') as [
      Event,
      { index: number; item: FileTokenGroupItem }
    ][]
    expect(dismissed).toHaveLength(2)
    expect(dismissed[0]![0]).toBeInstanceOf(MouseEvent)
    expect(dismissed[0]![1]).toEqual({ index: 1, item: items[1] })
    expect(dismissed[1]![0]).toBeInstanceOf(Event)
    expect(dismissed[1]![1]).toEqual({ index: 2, item: items[2] })
  })

  it('moves focus to the list when the last token is removed', async () => {
    const One = defineComponent({
      setup() {
        const items = ref<FileTokenGroupItem[]>([{ file: { name: 'only.txt', size: 1 } }])
        return () =>
          h(FileTokenGroup, {
            items: items.value,
            onRemove: () => {
              items.value = []
            }
          })
      }
    })
    const view = render(One)
    await fireEvent.click(view.getByRole('button', { name: 'Remove only.txt' }))
    await waitFor(() => expect(document.activeElement).toBe(view.getByRole('list')))
  })

  it('names the button Cancel upload and states the amount while a file uploads', () => {
    const view = render(FileTokenGroup, {
      props: {
        items: [
          { file: { name: 'app.js', size: 1024 }, loading: true, progress: 64 },
          { file: { name: 'styles.css' }, loading: true },
          { file: { name: 'done.txt' } }
        ]
      }
    })
    expect(view.getByRole('button', { name: 'Cancel upload of app.js' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Cancel upload of styles.css' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Remove done.txt' })).toBeTruthy()
    const meta = view.getAllByTestId('file-token-group__meta').map((el) => el.textContent ?? '')
    expect(meta[0]).toContain('64%')
    expect(meta[1]).toContain('Uploading…')
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
          ConfigProvider,
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
    expect(view.getByTestId('file-token-group').getAttribute('dir')).toBe('rtl')
    expect(view.getByText('a.txt').tagName).toBe('BDI')
  })

  it('isolates the size and its unit as one run under rtl', () => {
    const view = render(FileTokenGroup, {
      props: { items: [{ file: { name: 'certificate-error.png', size: 248_000 } }] },
      attrs: { dir: 'rtl' }
    })
    const size = view.getByTestId('file-token-group__meta').firstElementChild
    expect(size?.tagName).toBe('BDI')
    expect(size?.getAttribute('dir')).toBeNull()
    expect(size?.textContent).toBe('242.2 kB')
  })

  it('has no axe violations', async () => {
    for (const example of [Default, Uploading, Horizontal]) {
      const view = render(example)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })

  describe('names', () => {
    it('emits remove only, not the removed dismiss', async () => {
      const items = files()
      const view = render(FileTokenGroup, { props: { items } })
      await fireEvent.click(view.getByRole('button', { name: 'Remove a.txt' }))
      expect(view.emitted<unknown[]>('remove')?.[0]?.[1]).toEqual({ index: 0, item: items[0] })
      expect(view.emitted('dismiss')).toBeUndefined()
    })

    it('lays tokens out with orientation and ignores the removed alignment', () => {
      const next = render(FileTokenGroup, { props: { items: files(), orientation: 'horizontal' } })
      expect(next.getByTestId('file-token-group').getAttribute('data-orientation')).toBe(
        'horizontal'
      )
      next.unmount()
      const legacy = render(FileTokenGroup, {
        props: { items: files() },
        attrs: { alignment: 'horizontal' }
      })
      expect(legacy.getByTestId('file-token-group').getAttribute('data-orientation')).toBe(
        'vertical'
      )
    })

    it('renders the ReadOnly example with no remove buttons', () => {
      const view = render(ReadOnly)
      expect(view.queryAllByRole('button', { name: /^Remove/ })).toHaveLength(0)
    })
  })
})
