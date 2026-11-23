import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import Default from '../../../../examples/transfer-list/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import TransferList, {
  TransferListControls,
  TransferListSource,
  TransferListTarget,
  type TransferListValue
} from './index'

// A small, stable dataset: three available (source), one selected (target).
const makeModel = (): TransferListValue => [
  [
    { id: 1, label: 'Functions' },
    { id: 2, label: 'WAF' },
    { id: 3, label: 'Image Processor' }
  ],
  [{ id: 4, label: 'Cache' }]
]

// A realistic composed tree wired through the compound sub-components, with a
// wrapper that owns v-model and records the emitted events. Mirrors the
// canonical consumer usage (root owns the [source, target] pair; Source /
// Controls / Target compose by hand; #item renders the label).
const Harness = (opts: { disabled?: boolean; moveOnDoubleClick?: boolean } = {}) =>
  defineComponent({
    components: { TransferList, TransferListSource, TransferListTarget, TransferListControls },
    setup() {
      const model = ref(makeModel())
      return {
        model,
        disabled: opts.disabled ?? false,
        moveOnDoubleClick: opts.moveOnDoubleClick ?? true
      }
    },
    template: `
      <TransferList
        v-model="model"
        item-key="id"
        :disabled="disabled"
        :move-on-double-click="moveOnDoubleClick"
      >
        <TransferListSource title="Available">
          <template #item="{ item }">{{ item.label }}</template>
        </TransferListSource>
        <TransferListControls />
        <TransferListTarget title="Selected">
          <template #item="{ item }">{{ item.label }}</template>
        </TransferListTarget>
      </TransferList>
    `
  })

describe('TransferList', () => {
  describe('composition compound', () => {
    describe('compound API (Object.assign dot-notation)', () => {
      it('attaches every public sub-component to the root compound', () => {
        // Grounded in index.ts: Object.assign(TransferList, { Source, Target, Controls }).
        expect(TransferList.Source).toBe(TransferListSource)
        expect(TransferList.Target).toBe(TransferListTarget)
        expect(TransferList.Controls).toBe(TransferListControls)
      })
    })

    describe('root render + testids', () => {
      it('renders the root grid with the default data-testid', () => {
        const { getByTestId } = render(Harness())
        const root = getByTestId('transfer-list')
        expect(root.tagName).toBe('DIV')
      })

      it('renders each list with its default testid and semantic listbox role', () => {
        const { getByTestId, getAllByRole } = render(Harness())
        const source = getByTestId('transfer-list-source')
        const target = getByTestId('transfer-list-target')
        expect(source.tagName).toBe('SECTION')
        expect(target.tagName).toBe('SECTION')
        // Each list's TransitionGroup renders a role=listbox ul.
        const listboxes = getAllByRole('listbox')
        expect(listboxes).toHaveLength(2)
        for (const box of listboxes) expect(box.getAttribute('aria-multiselectable')).toBe('true')
      })

      it('renders the headers as the accessible names of the lists', () => {
        const { getByTestId } = render(Harness())
        expect(getByTestId('transfer-list-source__header').textContent).toContain('Available')
        expect(getByTestId('transfer-list-target__header').textContent).toContain('Selected')
        // header text is also mirrored onto the listbox aria-label.
        expect(getByTestId('transfer-list-source__list').getAttribute('aria-label')).toBe(
          'Available'
        )
        expect(getByTestId('transfer-list-target__list').getAttribute('aria-label')).toBe(
          'Selected'
        )
      })

      it('renders the initial items through the #item slot', () => {
        const { getByTestId } = render(Harness())
        const sourceOptions = within(getByTestId('transfer-list-source__list')).getAllByRole(
          'option'
        )
        const targetOptions = within(getByTestId('transfer-list-target__list')).getAllByRole(
          'option'
        )
        expect(sourceOptions).toHaveLength(3)
        expect(targetOptions).toHaveLength(1)
        expect(sourceOptions.map((o) => o.textContent?.trim())).toEqual([
          'Functions',
          'WAF',
          'Image Processor'
        ])
        expect(targetOptions[0].textContent?.trim()).toBe('Cache')
      })
    })

    describe('selection via injected context', () => {
      it('toggles aria-selected / data-selected on click through the shared context', async () => {
        const { getByTestId } = render(Harness())
        const [firstOption] = within(getByTestId('transfer-list-source__list')).getAllByRole(
          'option'
        )
        expect(firstOption.getAttribute('aria-selected')).toBe('false')
        expect(firstOption.hasAttribute('data-selected')).toBe(false)

        await fireEvent.click(firstOption)
        expect(firstOption.getAttribute('aria-selected')).toBe('true')
        expect(firstOption.getAttribute('data-selected')).toBe('true')

        // A second click deselects (toggleSelection).
        await fireEvent.click(firstOption)
        expect(firstOption.getAttribute('aria-selected')).toBe('false')
        expect(firstOption.hasAttribute('data-selected')).toBe(false)
      })

      it('toggles selection with Enter and Space keydown on a focused option', async () => {
        const { getByTestId } = render(Harness())
        const options = within(getByTestId('transfer-list-source__list')).getAllByRole('option')

        await fireEvent.keyDown(options[0], { key: 'Enter' })
        expect(options[0].getAttribute('aria-selected')).toBe('true')

        await fireEvent.keyDown(options[1], { key: ' ' })
        expect(options[1].getAttribute('aria-selected')).toBe('true')
      })
    })

    describe('context-aware controls (props-free, driven by inject)', () => {
      it('disables move buttons that have no eligible action initially', () => {
        const { getByTestId } = render(Harness())
        // No selection anywhere -> the two "move selected" buttons are disabled.
        expect(
          (getByTestId('transfer-list-controls__move-to-target') as HTMLButtonElement).disabled
        ).toBe(true)
        expect(
          (getByTestId('transfer-list-controls__move-to-source') as HTMLButtonElement).disabled
        ).toBe(true)
        // Source has items -> move-all-to-target enabled; target has items -> move-all-to-source enabled.
        expect(
          (getByTestId('transfer-list-controls__move-all-to-target') as HTMLButtonElement).disabled
        ).toBe(false)
        expect(
          (getByTestId('transfer-list-controls__move-all-to-source') as HTMLButtonElement).disabled
        ).toBe(false)
      })

      it('enables move-to-target once a source option is selected (hasSelection via inject)', async () => {
        const { getByTestId } = render(Harness())
        const moveSelected = getByTestId(
          'transfer-list-controls__move-to-target'
        ) as HTMLButtonElement
        expect(moveSelected.disabled).toBe(true)

        const [firstOption] = within(getByTestId('transfer-list-source__list')).getAllByRole(
          'option'
        )
        await fireEvent.click(firstOption)
        expect(moveSelected.disabled).toBe(false)
      })

      it('moves the selected source item to the target and emits move + updates v-model', async () => {
        const { getByTestId } = render(Harness())
        const [firstOption] = within(getByTestId('transfer-list-source__list')).getAllByRole(
          'option'
        )
        await fireEvent.click(firstOption)

        await fireEvent.click(getByTestId('transfer-list-controls__move-to-target'))

        // Source lost one, target gained one (v-model round-trip observed in the DOM).
        const sourceOptions = within(getByTestId('transfer-list-source__list')).getAllByRole(
          'option'
        )
        const targetOptions = within(getByTestId('transfer-list-target__list')).getAllByRole(
          'option'
        )
        expect(sourceOptions).toHaveLength(2)
        expect(targetOptions).toHaveLength(2)
        expect(sourceOptions.map((o) => o.textContent?.trim())).toEqual(['WAF', 'Image Processor'])
        expect(targetOptions.map((o) => o.textContent?.trim())).toEqual(['Cache', 'Functions'])
      })

      it('moves within local state and still emits update:modelValue when no v-model is bound', async () => {
        const { getByTestId, emitted } = render(TransferList, {
          props: { modelValue: makeModel(), itemKey: 'id' },
          slots: {
            default: () => [
              h(TransferListSource, { title: 'Available' }),
              h(TransferListControls),
              h(TransferListTarget, { title: 'Selected' })
            ]
          }
        })
        await fireEvent.click(getByTestId('transfer-list-controls__move-all-to-target'))

        expect(
          within(getByTestId('transfer-list-source__list')).queryAllByRole('option')
        ).toHaveLength(0)
        expect(
          within(getByTestId('transfer-list-target__list')).getAllByRole('option')
        ).toHaveLength(4)
        const updates = emitted()['update:modelValue'] as unknown[][]
        expect(updates).toHaveLength(1)
        expect(updates[0][0]).toEqual([[], [...makeModel()[1], ...makeModel()[0]]])
      })

      it('keeps the parent pair when a controlled v-model refuses the update', async () => {
        const Controlled = defineComponent({
          components: {
            TransferList,
            TransferListSource,
            TransferListTarget,
            TransferListControls
          },
          setup() {
            const model = ref(makeModel())
            const refused = ref(0)
            return { model, refused }
          },
          template: `
          <div>
            <TransferList :model-value="model" item-key="id" @update:model-value="refused++">
              <TransferListSource title="Available" />
              <TransferListControls />
              <TransferListTarget title="Selected" />
            </TransferList>
            <output data-testid="refused">{{ refused }}</output>
          </div>
        `
        })
        const { getByTestId } = render(Controlled)
        await fireEvent.click(getByTestId('transfer-list-controls__move-all-to-target'))

        expect(getByTestId('refused').textContent).toBe('1')
        expect(
          within(getByTestId('transfer-list-source__list')).getAllByRole('option')
        ).toHaveLength(3)
        expect(
          within(getByTestId('transfer-list-target__list')).getAllByRole('option')
        ).toHaveLength(1)
      })

      it('move-all-to-target empties the source and fills the target', async () => {
        const { getByTestId } = render(Harness())
        await fireEvent.click(getByTestId('transfer-list-controls__move-all-to-target'))

        const sourceOptions = within(getByTestId('transfer-list-source__list')).queryAllByRole(
          'option'
        )
        const targetOptions = within(getByTestId('transfer-list-target__list')).getAllByRole(
          'option'
        )
        expect(sourceOptions).toHaveLength(0)
        expect(targetOptions).toHaveLength(4)
        // After emptying the source, move-all-to-target locks (count('source') === 0).
        expect(
          (getByTestId('transfer-list-controls__move-all-to-target') as HTMLButtonElement).disabled
        ).toBe(true)
      })

      it('move-all-to-source pulls every target item back', async () => {
        const { getByTestId } = render(Harness())
        await fireEvent.click(getByTestId('transfer-list-controls__move-all-to-source'))

        const sourceOptions = within(getByTestId('transfer-list-source__list')).getAllByRole(
          'option'
        )
        const targetOptions = within(getByTestId('transfer-list-target__list')).queryAllByRole(
          'option'
        )
        expect(sourceOptions).toHaveLength(4)
        expect(targetOptions).toHaveLength(0)
      })
    })

    describe('events with correct payloads', () => {
      it('fires move with (event, { direction, items }) after a selected move', async () => {
        let payload: { direction: string; items: unknown[] } | undefined
        let moveEvent: unknown
        const Tree = defineComponent({
          components: {
            TransferList,
            TransferListSource,
            TransferListControls,
            TransferListTarget
          },
          setup() {
            const model = ref(makeModel())
            const onMove = (event: Event, p: { direction: string; items: unknown[] }) => {
              moveEvent = event
              payload = p
            }
            return { model, onMove }
          },
          template: `
          <TransferList v-model="model" item-key="id" @move="onMove">
            <TransferListSource title="Available">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListSource>
            <TransferListControls />
            <TransferListTarget title="Selected">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListTarget>
          </TransferList>
        `
        })
        const { getByTestId } = render(Tree)
        const [firstOption] = within(getByTestId('transfer-list-source__list')).getAllByRole(
          'option'
        )
        await fireEvent.click(firstOption)
        await fireEvent.click(getByTestId('transfer-list-controls__move-to-target'))

        expect(moveEvent).toBeInstanceOf(MouseEvent)
        expect(payload).toBeDefined()
        expect(payload?.direction).toBe('to-target')
        expect(payload?.items).toEqual([{ id: 1, label: 'Functions' }])
      })

      it('fires item-double-click(event, { list, item, index }) and moves the item by default', async () => {
        let dbl: { list: string; item: unknown; index: number } | undefined
        let dblEvent: unknown
        const Tree = defineComponent({
          components: {
            TransferList,
            TransferListSource,
            TransferListControls,
            TransferListTarget
          },
          setup() {
            const model = ref(makeModel())
            const onDouble = (
              event: unknown,
              p: { list: string; item: unknown; index: number }
            ) => {
              dblEvent = event
              dbl = p
            }
            return { model, onDouble }
          },
          template: `
          <TransferList v-model="model" item-key="id" @item-double-click="onDouble">
            <TransferListSource title="Available">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListSource>
            <TransferListControls />
            <TransferListTarget title="Selected">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListTarget>
          </TransferList>
        `
        })
        const { getByTestId } = render(Tree)
        const options = within(getByTestId('transfer-list-source__list')).getAllByRole('option')
        await fireEvent.dblClick(options[1]) // WAF (index 1)

        expect(dblEvent).toBeInstanceOf(MouseEvent)
        expect(dbl).toEqual({ list: 'source', item: { id: 2, label: 'WAF' }, index: 1 })
        // Default moveOnDoubleClick=true: WAF moves to the target.
        expect(
          within(getByTestId('transfer-list-source__list')).getAllByRole('option')
        ).toHaveLength(2)
        const targetLabels = within(getByTestId('transfer-list-target__list'))
          .getAllByRole('option')
          .map((o) => o.textContent?.trim())
        expect(targetLabels).toContain('WAF')
      })

      it('fires item-double-click but does NOT move when moveOnDoubleClick is false', async () => {
        let dbl: { list: string; item: unknown; index: number } | undefined
        const Tree = defineComponent({
          components: {
            TransferList,
            TransferListSource,
            TransferListControls,
            TransferListTarget
          },
          setup() {
            const model = ref(makeModel())
            const onDouble = (
              _event: unknown,
              p: { list: string; item: unknown; index: number }
            ) => {
              dbl = p
            }
            return { model, onDouble }
          },
          template: `
          <TransferList v-model="model" item-key="id" :move-on-double-click="false" @item-double-click="onDouble">
            <TransferListSource title="Available">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListSource>
            <TransferListControls />
            <TransferListTarget title="Selected">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListTarget>
          </TransferList>
        `
        })
        const { getByTestId } = render(Tree)
        const options = within(getByTestId('transfer-list-source__list')).getAllByRole('option')
        await fireEvent.dblClick(options[0])

        expect(dbl).toEqual({ list: 'source', item: { id: 1, label: 'Functions' }, index: 0 })
        // No move: source keeps all three.
        expect(
          within(getByTestId('transfer-list-source__list')).getAllByRole('option')
        ).toHaveLength(3)
        expect(
          within(getByTestId('transfer-list-target__list')).getAllByRole('option')
        ).toHaveLength(1)
      })
    })

    describe('disabled state', () => {
      it('locks all move controls and marks lists aria-disabled when disabled', async () => {
        const { getByTestId } = render(Harness({ disabled: true }))
        for (const id of [
          'transfer-list-controls__move-to-target',
          'transfer-list-controls__move-all-to-target',
          'transfer-list-controls__move-to-source',
          'transfer-list-controls__move-all-to-source'
        ]) {
          expect((getByTestId(id) as HTMLButtonElement).disabled).toBe(true)
        }
        expect(getByTestId('transfer-list-source__list').getAttribute('aria-disabled')).toBe('true')
        expect(getByTestId('transfer-list').getAttribute('data-disabled')).toBe('true')
      })

      it('does not toggle selection on click when disabled', async () => {
        const { getByTestId } = render(Harness({ disabled: true }))
        const [firstOption] = within(getByTestId('transfer-list-source__list')).getAllByRole(
          'option'
        )
        await fireEvent.click(firstOption)
        expect(firstOption.getAttribute('aria-selected')).toBe('false')
      })
    })

    describe('loading state', () => {
      it('shows a spinner placeholder and busy list on the loading side, and locks all moves', () => {
        const Tree = defineComponent({
          components: {
            TransferList,
            TransferListSource,
            TransferListControls,
            TransferListTarget
          },
          setup: () => ({ model: ref(makeModel()) }),
          template: `
          <TransferList v-model="model" item-key="id">
            <TransferListSource title="Available" :loading="true">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListSource>
            <TransferListControls />
            <TransferListTarget title="Selected">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListTarget>
          </TransferList>
        `
        })
        const { getByTestId, queryAllByRole } = render(Tree)
        // Loading list renders the loading placeholder (not options) and aria-busy.
        expect(getByTestId('transfer-list-source__loading')).toBeTruthy()
        expect(
          within(getByTestId('transfer-list-source__list')).queryAllByRole('option')
        ).toHaveLength(0)
        expect(getByTestId('transfer-list-source__list').getAttribute('aria-busy')).toBe('true')
        // setLoading reported to the root -> anyLoading -> every move control locked.
        for (const id of [
          'transfer-list-controls__move-to-target',
          'transfer-list-controls__move-all-to-target',
          'transfer-list-controls__move-to-source',
          'transfer-list-controls__move-all-to-source'
        ]) {
          expect((getByTestId(id) as HTMLButtonElement).disabled).toBe(true)
        }
        // The non-loading target still renders its option.
        expect(queryAllByRole('option').length).toBeGreaterThan(0)
      })
    })

    describe('default slot render-props on the root', () => {
      it('exposes move / hasSelection / count / disabled / loading to the default slot', async () => {
        const Tree = defineComponent({
          components: {
            TransferList,
            TransferListSource,
            TransferListControls,
            TransferListTarget
          },
          setup: () => ({ model: ref(makeModel()) }),
          template: `
          <TransferList v-model="model" item-key="id" v-slot="{ move, hasSelection, count, disabled, loading }">
            <TransferListSource title="Available">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListSource>
            <TransferListControls />
            <TransferListTarget title="Selected">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListTarget>
            <button
              data-testid="slot-move"
              :data-has-source="String(hasSelection('source'))"
              :data-source-count="count('source')"
              :data-disabled="String(disabled)"
              :data-loading="String(loading)"
              @click="move($event, 'to-target')"
            >custom</button>
          </TransferList>
        `
        })
        const { getByTestId } = render(Tree)
        const slotBtn = getByTestId('slot-move')
        // count('source') === 3, no selection, not disabled, not loading.
        expect(slotBtn.getAttribute('data-source-count')).toBe('3')
        expect(slotBtn.getAttribute('data-has-source')).toBe('false')
        expect(slotBtn.getAttribute('data-disabled')).toBe('false')
        expect(slotBtn.getAttribute('data-loading')).toBe('false')

        // Select a source item, then invoke the slot-provided move($event, 'to-target').
        const [firstOption] = within(getByTestId('transfer-list-source__list')).getAllByRole(
          'option'
        )
        await fireEvent.click(firstOption)
        expect(slotBtn.getAttribute('data-has-source')).toBe('true')

        await fireEvent.click(slotBtn)
        expect(
          within(getByTestId('transfer-list-target__list')).getAllByRole('option')
        ).toHaveLength(2)
      })
    })

    describe('accessibility', () => {
      it('has no axe violations for the composed tree', async () => {
        const { container } = render(Harness())
        await expectNoA11yViolations(container)
      })

      it('has no axe violations after moving an item', async () => {
        const { container, getByTestId } = render(Harness())
        const [firstOption] = within(getByTestId('transfer-list-source__list')).getAllByRole(
          'option'
        )
        await fireEvent.click(firstOption)
        await fireEvent.click(getByTestId('transfer-list-controls__move-to-target'))
        await expectNoA11yViolations(container)
      })
    })

    describe('story fixture', () => {
      it('renders the composed Default story fixture through the sub-components', () => {
        const { getByTestId, getByText } = render(Default)
        expect(getByTestId('transfer-list')).toBeTruthy()
        expect(getByTestId('transfer-list-source__header').textContent).toContain('Available')
        expect(getByTestId('transfer-list-target__header').textContent).toContain('Selected')
        expect(getByText('Functions')).toBeTruthy()
        expect(getByText('Cache')).toBeTruthy()
      })
    })
  })

  describe('keyboard, identity and empty lists', () => {
    const Keyed = (itemKey: string) =>
      defineComponent({
        components: { TransferList, TransferListSource, TransferListTarget, TransferListControls },
        setup: () => ({ model: ref(makeModel()), itemKey }),
        template: `
        <TransferList v-model="model" :item-key="itemKey">
          <TransferListSource title="Available">
            <template #item="{ item }">{{ item.label }}</template>
          </TransferListSource>
          <TransferListControls />
          <TransferListTarget title="Selected">
            <template #item="{ item }">{{ item.label }}</template>
          </TransferListTarget>
        </TransferList>
      `
      })

    const sourceOptions = (container: HTMLElement) =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          '[data-testid="transfer-list-source__list"] [role="option"]'
        )
      )

    it('keeps one tab stop per list and moves it with the arrows, Home and End', async () => {
      const view = render(Harness())
      const options = sourceOptions(view.container as HTMLElement)
      expect(options.map((option) => option.tabIndex)).toEqual([0, -1, -1])
      options[0]!.focus()
      await fireEvent.keyDown(options[0]!, { key: 'ArrowDown' })
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(document.activeElement).toBe(sourceOptions(view.container as HTMLElement)[1])
      expect(sourceOptions(view.container as HTMLElement).map((option) => option.tabIndex)).toEqual(
        [-1, 0, -1]
      )
      await fireEvent.keyDown(document.activeElement!, { key: 'End' })
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(document.activeElement).toBe(sourceOptions(view.container as HTMLElement)[2])
      await fireEvent.keyDown(document.activeElement!, { key: 'Home' })
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(document.activeElement).toBe(sourceOptions(view.container as HTMLElement)[0])
    })

    it('extends the selection with Shift and the arrows', async () => {
      const view = render(Harness())
      const options = sourceOptions(view.container as HTMLElement)
      options[0]!.focus()
      await fireEvent.keyDown(options[0]!, { key: 'ArrowDown', shiftKey: true })
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(
        sourceOptions(view.container as HTMLElement).map((o) => o.getAttribute('aria-selected'))
      ).toEqual(['true', 'true', 'false'])
    })

    it('keys the selection by itemKey, so it follows the record when the list changes', async () => {
      const model = ref(makeModel())
      const view = render(
        defineComponent({
          components: {
            TransferList,
            TransferListSource,
            TransferListTarget,
            TransferListControls
          },
          setup: () => ({ model }),
          template: `
          <TransferList v-model="model" item-key="id">
            <TransferListSource title="Available">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListSource>
            <TransferListControls />
            <TransferListTarget title="Selected">
              <template #item="{ item }">{{ item.label }}</template>
            </TransferListTarget>
          </TransferList>
        `
        })
      )
      await fireEvent.click(sourceOptions(view.container as HTMLElement)[1]!)
      model.value = [[{ id: 9, label: 'Logs' }, ...model.value[0]!], model.value[1]!]
      await new Promise((resolve) => setTimeout(resolve, 0))
      const selected = sourceOptions(view.container as HTMLElement).filter(
        (option) => option.getAttribute('aria-selected') === 'true'
      )
      expect(selected.map((option) => option.textContent?.trim())).toEqual(['WAF'])
    })

    it('has no dataKey prop: a data-key attribute stays an attribute', () => {
      const view = render(Keyed(''), { attrs: { 'data-key': 'id' } })
      expect(sourceOptions(view.container as HTMLElement)).toHaveLength(3)
      expect(view.getByTestId('transfer-list').getAttribute('data-key')).toBe('id')
    })

    it('shows an empty state in a list with no items', async () => {
      const view = render(Harness())
      await fireEvent.click(
        within(view.container as HTMLElement).getByRole('button', { name: 'Move all to target' })
      )
      const empty = view.getByTestId('transfer-list-source__empty')
      expect(empty.textContent).toContain('No items')
      await expectNoA11yViolations(view.container)
    })
  })
})
