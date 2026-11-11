import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/tag-editor/default.vue'
import Validation from '../../../../examples/tag-editor/validation.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import TagEditor, { type TagEditorTag } from './tag-editor.vue'

const Harness = (initial: TagEditorTag[], extra: Record<string, unknown> = {}) =>
  defineComponent({
    setup() {
      const tags = ref(initial)
      return () =>
        h(TagEditor, {
          tags: tags.value,
          'onUpdate:tags': (next: TagEditorTag[]) => (tags.value = next),
          ...extra
        })
    }
  })

const keys = (view: ReturnType<typeof render>) =>
  view.getAllByLabelText(/^Key/) as HTMLInputElement[]

const errorOf = (input: HTMLElement) =>
  (input.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .map((id) => document.getElementById(id)?.textContent ?? '')
    .join(' ')

describe('TagEditor', () => {
  it('renders saved tags with a read-only key and new tags editable', () => {
    const view = render(
      Harness([
        { key: 'team', value: 'payments', existing: true },
        { key: 'env', value: 'dev' }
      ])
    )
    expect(keys(view)[0]?.readOnly).toBe(true)
    expect(keys(view)[1]?.readOnly).toBe(false)
    expect(view.getByRole('list', { name: 'Tags' })).toBeTruthy()
  })

  it('marks a saved tag for removal and restores it with Undo', async () => {
    const view = render(Harness([{ key: 'team', value: 'payments', existing: true }]))
    await fireEvent.click(view.getByRole('button', { name: 'Remove tag 1' }))
    expect(view.getByTestId('input-tag-editor__marked').textContent).toContain(
      'removed when you save'
    )
    expect(keys(view)[0]?.disabled).toBe(true)
    await fireEvent.click(view.getByRole('button', { name: 'Undo removal of tag 1' }))
    expect(view.queryByTestId('input-tag-editor__marked')).toBeNull()
  })

  it('deletes a new tag on Remove', async () => {
    const view = render(Harness([{ key: 'env', value: 'dev' }]))
    await fireEvent.click(view.getByRole('button', { name: 'Remove tag 1' }))
    expect(view.getByText('No tags associated with the resource.')).toBeTruthy()
  })

  it('flags reserved prefixes, duplicates, invalid characters and long keys while typing', async () => {
    const view = render(
      Harness(
        [
          { key: 'azion:managed', value: '' },
          { key: 'region', value: 'a' },
          { key: 'region', value: 'b' },
          { key: 'bad#key', value: '' },
          { key: 'x'.repeat(10), value: '' }
        ],
        { keyMaxLength: 8 }
      )
    )
    await nextTick()
    const inputs = keys(view)
    expect(errorOf(inputs[0] as HTMLElement)).toContain('Keys cannot start with "azion:".')
    expect(errorOf(inputs[1] as HTMLElement)).toContain('already used')
    expect(errorOf(inputs[3] as HTMLElement)).toContain('Use letters, numbers')
    expect(errorOf(inputs[4] as HTMLElement)).toContain('Use 8 characters or fewer.')
  })

  it('does not flag an empty new row while typing', () => {
    const view = render(Harness([{ key: '', value: '' }]))
    expect(keys(view)[0]?.getAttribute('aria-invalid')).not.toBe('true')
  })

  it('validate() returns false and shows the required error', async () => {
    const tags = ref<TagEditorTag[]>([{ key: '', value: '' }])
    const editor = ref<{ validate: () => boolean } | null>(null)
    const view = render(
      defineComponent({
        setup: () => () =>
          h(TagEditor, {
            ref: editor,
            tags: tags.value,
            'onUpdate:tags': (next: TagEditorTag[]) => (tags.value = next)
          })
      })
    )
    expect(editor.value?.validate()).toBe(false)
    await nextTick()
    await nextTick()
    expect(errorOf(keys(view)[0] as HTMLElement)).toContain('Enter a key.')
  })

  it('does not count tags marked for removal toward the limit', () => {
    const view = render(
      Harness(
        [
          { key: 'a', value: '1', existing: true, markedForRemoval: true },
          { key: 'b', value: '2' }
        ],
        { limit: 2 }
      )
    )
    expect(view.getByText('You can add 1 more tag.')).toBeTruthy()
    expect((view.getByRole('button', { name: 'Add new tag' }) as HTMLButtonElement).disabled).toBe(
      false
    )
  })

  it('adds a tag and shows the server error passed through errors', async () => {
    const view = render(Harness([{ key: 'a', value: '1' }], { errors: [{ value: 'Rejected.' }] }))
    await nextTick()
    expect(errorOf(view.getAllByLabelText('Value')[0] as HTMLElement)).toContain('Rejected.')
    await fireEvent.click(view.getByRole('button', { name: 'Add new tag' }))
    expect(keys(view)).toHaveLength(2)
  })

  it('offers key suggestions through a datalist', () => {
    const view = render(Harness([{ key: '', value: '' }], { keySuggestions: ['team', 'owner'] }))
    const list = keys(view)[0]?.getAttribute('list')
    expect(list).toBeTruthy()
    const options = document.getElementById(list as string)?.querySelectorAll('option')
    expect(options).toHaveLength(2)
  })

  it('renders under dir="rtl" with no axe violations', async () => {
    const holder = document.body.appendChild(
      Object.assign(document.createElement('div'), { dir: 'rtl' })
    )
    const view = render(Harness([{ key: 'team', value: 'payments' }]), { container: holder })
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it.each([
    ['Default', Default],
    ['Validation', Validation]
  ])('renders the %s example with no axe violations', async (_name, Example) => {
    const { container } = render(Example)
    await expectNoA11yViolations(container)
  })
})
