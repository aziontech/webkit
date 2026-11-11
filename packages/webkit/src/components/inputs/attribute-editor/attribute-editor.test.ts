import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import CustomCells from '../../../../examples/attribute-editor/custom-cells.vue'
import Default from '../../../../examples/attribute-editor/default.vue'
import Grouped from '../../../../examples/attribute-editor/grouped.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import AttributeEditor, { type AttributeEditorItem } from './attribute-editor.vue'

const definition = [
  { key: 'key', label: 'Key' },
  { key: 'value', label: 'Value' }
]

const Harness = (initial: AttributeEditorItem[], extra: Record<string, unknown> = {}) =>
  defineComponent({
    setup() {
      const items = ref(initial)
      return () =>
        h(AttributeEditor, {
          items: items.value,
          'onUpdate:items': (next: AttributeEditorItem[]) => (items.value = next),
          definition,
          ariaLabel: 'Variables',
          ...extra
        })
    }
  })

const GroupedHarness = (initial: AttributeEditorItem[][]) =>
  defineComponent({
    setup() {
      const groups = ref(initial)
      return () =>
        h(AttributeEditor, {
          groups: groups.value,
          'onUpdate:groups': (next: AttributeEditorItem[][]) => (groups.value = next),
          definition,
          ariaLabel: 'Criteria'
        })
    }
  })

describe('AttributeEditor', () => {
  it('renders one row per item with a labelled control per cell', () => {
    const view = render(Harness([{ key: 'A', value: '1' }]))
    expect(view.getAllByTestId('input-attribute-editor__row')).toHaveLength(1)
    expect((view.getByLabelText('Key') as HTMLInputElement).value).toBe('A')
    expect((view.getByLabelText('Value') as HTMLInputElement).value).toBe('1')
    expect(view.getByRole('list', { name: 'Variables' })).toBeTruthy()
  })

  it('shows the empty text with no rows', () => {
    const view = render(Harness([]))
    expect(view.getByTestId('input-attribute-editor__empty').textContent).toContain('No items yet.')
  })

  it('edits a cell through update:items', async () => {
    const view = render(Harness([{ key: 'A', value: '1' }]))
    await fireEvent.update(view.getByLabelText('Value'), '2')
    expect((view.getByLabelText('Value') as HTMLInputElement).value).toBe('2')
  })

  it('adds a row, focuses its first control and announces it', async () => {
    const view = render(Harness([{ key: 'A', value: '1' }]))
    await fireEvent.click(view.getByTestId('input-attribute-editor__add'))
    expect(view.getAllByTestId('input-attribute-editor__row')).toHaveLength(2)
    await waitFor(() =>
      expect(document.activeElement).toBe(view.getAllByLabelText('Key')[1] as HTMLElement)
    )
    expect(view.getByTestId('input-attribute-editor__status').textContent).toContain(
      'Item 2 added.'
    )
  })

  it('removes a row, moves focus to the row now in its place and announces it', async () => {
    const view = render(
      Harness([
        { key: 'A', value: '1' },
        { key: 'B', value: '2' }
      ])
    )
    const remove = view.getByRole('button', { name: 'Remove item 1' })
    await fireEvent.click(remove)
    expect(view.getAllByTestId('input-attribute-editor__row')).toHaveLength(1)
    await waitFor(() =>
      expect(document.activeElement).toBe(view.getByLabelText('Key') as HTMLElement)
    )
    expect((view.getByLabelText('Key') as HTMLInputElement).value).toBe('B')
    expect(view.getByTestId('input-attribute-editor__status').textContent).toContain(
      'Item 1 removed.'
    )
  })

  it('moves focus to Add after the last row is removed', async () => {
    const view = render(Harness([{ key: 'A', value: '1' }]))
    await fireEvent.click(view.getByRole('button', { name: 'Remove item 1' }))
    await waitFor(() =>
      expect(document.activeElement).toBe(view.getByTestId('input-attribute-editor__add'))
    )
  })

  it('keeps minItems rows and disables Add at the limit', () => {
    const view = render(Harness([{ key: 'A', value: '1' }], { minItems: 1, limit: 1 }))
    expect(view.queryByRole('button', { name: 'Remove item 1' })).toBeNull()
    expect((view.getByTestId('input-attribute-editor__add') as HTMLButtonElement).disabled).toBe(
      true
    )
    expect(view.getByTestId('input-attribute-editor__limit').textContent).toContain(
      'limit of 1 items'
    )
  })

  it('says how many rows are left under the limit', () => {
    const view = render(Harness([{ key: 'A', value: '1' }], { limit: 3 }))
    expect(view.getByTestId('input-attribute-editor__limit').textContent).toContain(
      'You can add 2 more items.'
    )
  })

  it('shows a cell error tied to its control', () => {
    const view = render(
      Harness([{ key: '', value: '1' }], { errors: [{ key: 'Key is required.' }] })
    )
    const input = view.getByLabelText('Key')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    const described = (input.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent ?? '')
      .join(' ')
    expect(described).toContain('Key is required.')
  })

  it('disables every control when disabled', () => {
    const view = render(Harness([{ key: 'A', value: '1' }], { disabled: true }))
    expect((view.getByLabelText('Key') as HTMLInputElement).disabled).toBe(true)
    expect((view.getByTestId('input-attribute-editor__add') as HTMLButtonElement).disabled).toBe(
      true
    )
    expect(view.queryByRole('button', { name: 'Remove item 1' })).toBeNull()
  })

  it('renders AND groups joined by OR, adds and removes groups', async () => {
    const view = render(
      GroupedHarness([
        [
          { key: 'a', value: '1' },
          { key: 'b', value: '2' }
        ],
        [{ key: 'c', value: '3' }]
      ])
    )
    expect(view.getAllByTestId('input-attribute-editor__group')).toHaveLength(2)
    expect(view.getByRole('group', { name: 'Group 1' })).toBeTruthy()
    await fireEvent.click(view.getByTestId('input-attribute-editor__add-group'))
    expect(view.getAllByTestId('input-attribute-editor__group')).toHaveLength(3)
    await fireEvent.click(view.getByRole('button', { name: 'Remove item 3' }))
    expect(view.getAllByTestId('input-attribute-editor__group')).toHaveLength(2)
    const adds = view.getAllByTestId('input-attribute-editor__add')
    await fireEvent.click(adds[0] as HTMLElement)
    expect(view.getAllByTestId('input-attribute-editor__row')).toHaveLength(4)
  })

  it('lays out under dir="rtl" without errors', async () => {
    const view = render(Harness([{ key: 'A', value: '1' }]), {
      container: document.body.appendChild(
        Object.assign(document.createElement('div'), { dir: 'rtl' })
      )
    })
    expect(view.getAllByTestId('input-attribute-editor__row')).toHaveLength(1)
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it.each([
    ['Default', Default],
    ['Grouped', Grouped],
    ['CustomCells', CustomCells]
  ])('renders the %s example with no axe violations', async (_name, Example) => {
    const { container } = render(Example)
    await expectNoA11yViolations(container)
  })
})
