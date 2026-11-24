import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import CustomCells from '../../../../examples/attribute-editor/custom-cells.vue'
import Default from '../../../../examples/attribute-editor/default.vue'
import EmptyAndDisabled from '../../../../examples/attribute-editor/empty-and-disabled.vue'
import Groups from '../../../../examples/attribute-editor/groups.vue'
import Reorderable from '../../../../examples/attribute-editor/reorderable.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { hostable } from '../../../test/hostable'
import AttributeEditorRoot, { type AttributeEditorItem } from './attribute-editor.vue'

const AttributeEditor = hostable(AttributeEditorRoot)

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

const GroupedHarness = (initial: AttributeEditorItem[][], extra: Record<string, unknown> = {}) =>
  defineComponent({
    setup() {
      const groups = ref(initial)
      return () =>
        h(AttributeEditor, {
          groups: groups.value,
          'onUpdate:groups': (next: AttributeEditorItem[][]) => (groups.value = next),
          definition,
          ariaLabel: 'Criteria',
          ...extra
        })
    }
  })

describe('AttributeEditor', () => {
  describe('basics', () => {
    it('marks a required column in the grid header as it does in the stacked label', async () => {
      const view = render(Default)
      await nextTick()
      const header = view.getByTestId('attribute-editor__header')
      const marks = header.querySelectorAll('[data-testid="attribute-editor__header-required"]')
      expect(marks).toHaveLength(1)
      expect(marks[0]!.textContent).toBe('*')
      expect(marks[0]!.parentElement!.textContent).toBe('Key*')
    })

    it('renders one row per item with a labelled control per cell', () => {
      const view = render(Harness([{ key: 'A', value: '1' }]))
      expect(view.getAllByTestId('attribute-editor__row')).toHaveLength(1)
      expect((view.getByLabelText('Key') as HTMLInputElement).value).toBe('A')
      expect((view.getByLabelText('Value') as HTMLInputElement).value).toBe('1')
      expect(view.getByRole('list', { name: 'Variables' })).toBeTruthy()
    })

    it('states the container width its row layout needs in data-fit', () => {
      const pair = render(Harness([{ key: 'A', value: '1' }]))
      expect(pair.getByTestId('attribute-editor').dataset['fit']).toBe('md')
      pair.unmount()
      const four = [
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'default', label: 'Default' },
        { key: 'primary', label: 'Primary' }
      ]
      const wide = render(Harness([{ name: 'id' }], { definition: four }))
      expect(wide.getByTestId('attribute-editor').dataset['fit']).toBe('xl')
      wide.unmount()
      const reorder = render(
        Harness([{ name: 'id' }, { name: 'created_at' }], {
          definition: four,
          reorderable: true,
          size: 'large'
        })
      )
      expect(reorder.getByTestId('attribute-editor').dataset['fit']).toBe('3xl')
    })

    it('shows the empty text with no rows', () => {
      const view = render(Harness([]))
      expect(view.getByTestId('attribute-editor__empty').textContent).toContain('No items yet.')
    })

    it('shows emptyTitle in place of the catalog text', () => {
      const view = render(Harness([], { emptyTitle: 'No variables yet.' }))
      expect(view.getByTestId('attribute-editor__empty').textContent).toContain('No variables yet.')
    })

    it('edits a cell through update:items', async () => {
      const view = render(Harness([{ key: 'A', value: '1' }]))
      await fireEvent.update(view.getByLabelText('Value'), '2')
      expect((view.getByLabelText('Value') as HTMLInputElement).value).toBe('2')
    })

    it('keeps its own rows when v-model:items is not bound', async () => {
      const view = render(AttributeEditor, {
        props: { items: [{ key: 'A', value: '1' }], definition, ariaLabel: 'Variables' }
      })
      await fireEvent.click(view.getByTestId('attribute-editor__add'))
      expect(view.getAllByTestId('attribute-editor__row')).toHaveLength(2)
      expect(view.emitted<unknown[]>('update:items')?.[0]?.[0]).toHaveLength(2)
    })

    it('starts empty and adds rows with no items passed at all', async () => {
      const view = render(AttributeEditor, { props: { definition, ariaLabel: 'Variables' } })
      await fireEvent.click(view.getByTestId('attribute-editor__add'))
      expect(view.getAllByTestId('attribute-editor__row')).toHaveLength(1)
    })

    it('adds a row, focuses its first control and announces it', async () => {
      const view = render(Harness([{ key: 'A', value: '1' }]))
      await fireEvent.click(view.getByTestId('attribute-editor__add'))
      expect(view.getAllByTestId('attribute-editor__row')).toHaveLength(2)
      await waitFor(() =>
        expect(document.activeElement).toBe(view.getAllByLabelText('Key')[1] as HTMLElement)
      )
      expect(view.getByTestId('attribute-editor__status').textContent).toContain('Item 2 added.')
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
      expect(view.getAllByTestId('attribute-editor__row')).toHaveLength(1)
      await waitFor(() =>
        expect(document.activeElement).toBe(view.getByLabelText('Key') as HTMLElement)
      )
      expect((view.getByLabelText('Key') as HTMLInputElement).value).toBe('B')
      expect(view.getByTestId('attribute-editor__status').textContent).toContain('Item 1 removed.')
    })

    it('emits add and remove with the DOM event first, from pointer and keyboard', async () => {
      const user = userEvent.setup()
      const items = [
        { key: 'A', value: '1' },
        { key: 'B', value: '2' }
      ]
      const view = render(AttributeEditor, { props: { items, definition } })
      await user.click(view.getByTestId('attribute-editor__add'))
      view.getByRole('button', { name: 'Remove item 2' }).focus()
      await user.keyboard('{Enter}')
      const adds = view.emitted('add') as [Event, { index: number }][]
      expect(adds).toHaveLength(1)
      expect(adds[0]![0]).toBeInstanceOf(MouseEvent)
      expect(adds[0]![1]).toEqual({ index: 2 })
      const removes = view.emitted('remove') as [Event, { index: number; item: unknown }][]
      expect(removes).toHaveLength(1)
      expect(removes[0]![0]).toBeInstanceOf(Event)
      expect(removes[0]![1]).toEqual({ index: 1, item: items[1] })
    })

    it('passes the event through the row slot remove', async () => {
      const items = [{ key: 'A', value: '1' }]
      const view = render(AttributeEditor, {
        props: { items, definition },
        slots: {
          row: `<template #row="{ remove }"><button type="button" @click="remove">Drop</button></template>`
        }
      })
      await fireEvent.click(view.getByRole('button', { name: 'Drop' }))
      const removes = view.emitted('remove') as [Event, { index: number; item: unknown }][]
      expect(removes).toHaveLength(1)
      expect(removes[0]![0]).toBeInstanceOf(MouseEvent)
      expect(removes[0]![1]).toEqual({ index: 0, item: items[0] })
    })

    it('moves focus to Add after the last row is removed', async () => {
      const view = render(Harness([{ key: 'A', value: '1' }]))
      await fireEvent.click(view.getByRole('button', { name: 'Remove item 1' }))
      await waitFor(() =>
        expect(document.activeElement).toBe(view.getByTestId('attribute-editor__add'))
      )
    })

    it('keeps minItems rows and disables Add at the limit', () => {
      const view = render(Harness([{ key: 'A', value: '1' }], { minItems: 1, limit: 1 }))
      expect(view.queryByRole('button', { name: 'Remove item 1' })).toBeNull()
      expect((view.getByTestId('attribute-editor__add') as HTMLButtonElement).disabled).toBe(true)
      expect(view.getByTestId('attribute-editor__limit').textContent).toContain('limit of 1 items')
    })

    it('says how many rows are left under the limit', () => {
      const view = render(Harness([{ key: 'A', value: '1' }], { limit: 3 }))
      expect(view.getByTestId('attribute-editor__limit').textContent).toContain(
        'You can add 2 more items.'
      )
    })

    it('shows a cell error tied to its control', async () => {
      const view = render(
        Harness([{ key: '', value: '1' }], { errors: [{ key: 'Key is required.' }] })
      )
      await nextTick()
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
      expect((view.getByTestId('attribute-editor__add') as HTMLButtonElement).disabled).toBe(true)
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
      expect(view.getAllByTestId('attribute-editor__group')).toHaveLength(2)
      expect(view.getByRole('group', { name: 'Group 1' })).toBeTruthy()
      await fireEvent.click(view.getByTestId('attribute-editor__add-group'))
      expect(view.getAllByTestId('attribute-editor__group')).toHaveLength(3)
      await fireEvent.click(view.getByRole('button', { name: 'Remove item 3' }))
      expect(view.getAllByTestId('attribute-editor__group')).toHaveLength(2)
      const adds = view.getAllByTestId('attribute-editor__add')
      await fireEvent.click(adds[0] as HTMLElement)
      expect(view.getAllByTestId('attribute-editor__row')).toHaveLength(4)
    })

    const keys = (view: ReturnType<typeof render>) =>
      view.getAllByLabelText('Key').map((input) => (input as HTMLInputElement).value)

    const threeRows = () => [
      { key: 'A', value: '1' },
      { key: 'B', value: '2' },
      { key: 'C', value: '3' }
    ]

    it('draws no reorder controls unless reorderable, nor with a single row', () => {
      expect(render(Harness(threeRows())).queryAllByTestId('attribute-editor__grip')).toHaveLength(
        0
      )
      const single = render(Harness([{ key: 'A', value: '1' }], { reorderable: true }))
      expect(single.queryAllByTestId('attribute-editor__grip')).toHaveLength(0)
    })

    it('moves a row with Move up and Move down, announces it and keeps focus on the row', async () => {
      const view = render(Harness(threeRows(), { reorderable: true }))
      expect(
        (view.getByRole('button', { name: 'Move item 1 up' }) as HTMLButtonElement).disabled
      ).toBe(true)
      expect(
        (view.getByRole('button', { name: 'Move item 3 down' }) as HTMLButtonElement).disabled
      ).toBe(true)
      const down = view.getByRole('button', { name: 'Move item 1 down' })
      down.focus()
      await fireEvent.click(down)
      expect(keys(view)).toEqual(['B', 'A', 'C'])
      expect(view.getByTestId('attribute-editor__status').textContent).toContain(
        'Item 1 moved to position 2.'
      )
      await waitFor(() =>
        expect(document.activeElement).toBe(view.getByRole('button', { name: 'Move item 2 down' }))
      )
      await fireEvent.click(view.getByRole('button', { name: 'Move item 2 up' }))
      expect(keys(view)).toEqual(['A', 'B', 'C'])
    })

    it('emits the new order through update:items', async () => {
      const items = threeRows()
      const view = render(AttributeEditor, { props: { items, definition, reorderable: true } })
      await fireEvent.click(view.getByRole('button', { name: 'Move item 3 up' }))
      const updates = view.emitted('update:items') as [AttributeEditorItem[]][]
      expect(updates[0]![0]).toEqual([items[0], items[2], items[1]])
    })

    it('moves a row with the arrow keys on its grip, described by the hint', async () => {
      const user = userEvent.setup()
      const view = render(Harness(threeRows(), { reorderable: true }))
      const grip = view.getByRole('button', { name: 'Reorder item 1' })
      const hint = document.getElementById(grip.getAttribute('aria-describedby') ?? '')
      expect(hint?.textContent).toContain('Drag, or press Arrow Up or Arrow Down to move.')
      grip.focus()
      await user.keyboard('{ArrowDown}')
      expect(keys(view)).toEqual(['B', 'A', 'C'])
      await user.keyboard('{ArrowDown}')
      expect(keys(view)).toEqual(['B', 'C', 'A'])
      await waitFor(() =>
        expect(document.activeElement).toBe(view.getByRole('button', { name: 'Reorder item 3' }))
      )
    })

    it('moves a row with Alt+Arrow from any of its controls and keeps focus in the control', async () => {
      const user = userEvent.setup()
      const view = render(Harness(threeRows(), { reorderable: true }))
      const input = view.getAllByLabelText('Value')[2] as HTMLInputElement
      input.focus()
      await user.keyboard('{Alt>}{ArrowUp}{/Alt}')
      expect(keys(view)).toEqual(['A', 'C', 'B'])
      await waitFor(() => expect(document.activeElement).toBe(input))
      await user.keyboard('{ArrowUp}')
      expect(keys(view)).toEqual(['A', 'C', 'B'])
    })

    it('moves a row by dragging its grip onto another row', async () => {
      const view = render(Harness(threeRows(), { reorderable: true }))
      const rows = view.getAllByTestId('attribute-editor__row')
      await fireEvent.pointerDown(view.getByRole('button', { name: 'Reorder item 1' }))
      await fireEvent.dragStart(rows[0] as HTMLElement)
      expect(rows[0]!.hasAttribute('data-dragging')).toBe(true)
      const target = rows[2] as HTMLElement
      const box = target.getBoundingClientRect()
      await fireEvent.dragOver(target, { clientY: box.bottom - 1 })
      expect(target.getAttribute('data-drop')).toBe('after')
      await fireEvent.drop(target, { clientY: box.bottom - 1 })
      expect(keys(view)).toEqual(['B', 'C', 'A'])
      expect(view.getAllByTestId('attribute-editor__row')[2]!.hasAttribute('data-dragging')).toBe(
        false
      )
    })

    it('does not start a drag without the grip', async () => {
      const view = render(Harness(threeRows(), { reorderable: true }))
      const rows = view.getAllByTestId('attribute-editor__row')
      await fireEvent.dragStart(rows[0] as HTMLElement)
      expect(rows[0]!.hasAttribute('data-dragging')).toBe(false)
    })

    it('disables every reorder control when disabled', () => {
      const view = render(Harness(threeRows(), { reorderable: true, disabled: true }))
      for (const name of ['Reorder item 2', 'Move item 2 up', 'Move item 2 down'])
        expect((view.getByRole('button', { name }) as HTMLButtonElement).disabled).toBe(true)
    })

    it('reorders rows inside a group and whole groups in grouped mode', async () => {
      const user = userEvent.setup()
      const view = render(
        GroupedHarness(
          [
            [
              { key: 'a', value: '1' },
              { key: 'b', value: '2' }
            ],
            [{ key: 'c', value: '3' }]
          ],
          { reorderable: true }
        )
      )
      await fireEvent.click(view.getByRole('button', { name: 'Move item 2 up' }))
      expect(keys(view)).toEqual(['b', 'a', 'c'])
      const groupDown = view.getByRole('button', { name: 'Move group 1 down' })
      groupDown.focus()
      await fireEvent.click(groupDown)
      expect(keys(view)).toEqual(['c', 'b', 'a'])
      expect(view.getByTestId('attribute-editor__status').textContent).toContain(
        'Group 1 moved to position 2.'
      )
      await waitFor(() =>
        expect(document.activeElement).toBe(view.getByRole('button', { name: 'Reorder group 2' }))
      )
      await user.keyboard('{ArrowUp}')
      expect(keys(view)).toEqual(['b', 'a', 'c'])
    })

    it('lays out under dir="rtl" without errors', async () => {
      const view = render(Harness([{ key: 'A', value: '1' }]), {
        container: document.body.appendChild(
          Object.assign(document.createElement('div'), { dir: 'rtl' })
        )
      })
      expect(view.getAllByTestId('attribute-editor__row')).toHaveLength(1)
      await expectNoA11yViolations(view.container as HTMLElement)
    })

    it.each([
      ['Default', Default],
      ['Groups', Groups],
      ['CustomCells', CustomCells],
      ['Reorderable', Reorderable]
    ])('renders the %s example with no axe violations', async (_name, Example) => {
      const { container } = render(Example)
      await expectNoA11yViolations(container)
    })
  })

  describe('EmptyAndDisabled example', () => {
    it('shows the empty text in the first editor and disables the second', async () => {
      const view = render(EmptyAndDisabled)
      expect(view.getAllByTestId('attribute-editor__empty')[0]!.textContent).toContain(
        'No environment variables yet.'
      )
      const adds = view.getAllByTestId('attribute-editor__add') as HTMLButtonElement[]
      expect(adds[1]!.disabled).toBe(true)
      await expectNoA11yViolations(view.container)
    })
  })
})
