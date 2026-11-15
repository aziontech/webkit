import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/filter-menu/default.vue'
import Sizes from '../../../../examples/filter-menu/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import FilterMenu, { FilterMenuChips, type FilterMenuField, type FilterMenuModel } from './index'

const fields: FilterMenuField[] = [
  {
    id: 'owner',
    label: 'Author',
    options: [
      { value: 'jane', label: 'Jane Doe', avatar: '' },
      { value: 'john', label: 'John Smith', avatar: '' },
      { value: 'priya', label: 'Priya Patel', avatar: '' }
    ]
  },
  {
    id: 'status',
    label: 'Status',
    kind: 'single',
    options: [
      { value: 'live', label: 'Live' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  { id: 'modified', label: 'Last modified', kind: 'date' }
]

const WAIT = { timeout: 3000 }

const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 10))

const byTestId = (id: string): HTMLElement | null =>
  document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)
const trigger = (): HTMLButtonElement =>
  document.body.querySelector<HTMLButtonElement>(
    '[data-testid="data-filter-menu__trigger"] button'
  )!
const panel = (): HTMLElement | null => byTestId('data-filter-menu__panel')

function mount(start: FilterMenuModel = {}, withChips = false) {
  const model = ref<FilterMenuModel>(start)
  const updates: FilterMenuModel[] = []
  const edits: unknown[][] = []
  const removes: unknown[][] = []
  const onUpdate = (next: FilterMenuModel): void => {
    model.value = next
    updates.push(next)
  }
  const view = render(
    defineComponent({
      setup: () => () =>
        h('div', null, [
          h(FilterMenu, { fields, modelValue: model.value, 'onUpdate:modelValue': onUpdate }),
          withChips
            ? h(FilterMenuChips, {
                fields,
                modelValue: model.value,
                'onUpdate:modelValue': onUpdate,
                onEdit: (...args: unknown[]) => edits.push(args),
                onRemove: (...args: unknown[]) => removes.push(args)
              })
            : null
        ])
    })
  )
  return { view, model, updates, edits, removes }
}

async function openMenu(): Promise<HTMLElement> {
  await settle()
  await fireEvent.click(trigger())
  return waitFor(() => {
    const found = panel()
    expect(found).not.toBeNull()
    return found as HTMLElement
  }, WAIT)
}

async function openField(id: string): Promise<void> {
  await openMenu()
  await fireEvent.click(byTestId(`data-filter-menu__field-${id}`)!)
  await waitFor(
    () => expect(panel()?.querySelector(`[data-level="values:${id}"]`)).not.toBeNull(),
    WAIT
  )
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('FilterMenu', () => {
  it('renders the trigger with the data-testid fallback and lets a consumer data-testid win', () => {
    mount()
    expect(byTestId('data-filter-menu')).not.toBeNull()
    expect(trigger().textContent).toContain('Filter')
    document.body.innerHTML = ''
    render(FilterMenu, { props: { fields }, attrs: { 'data-testid': 'workload-filter' } })
    expect(byTestId('workload-filter')).not.toBeNull()
    expect(byTestId('data-filter-menu')).toBeNull()
  })

  it('counts the applied fields on a badge and in the trigger name, and drops the badge at zero', async () => {
    mount({ owner: ['jane', 'john'], status: ['live'], modified: [] })
    expect(byTestId('data-filter-menu__count')?.textContent?.trim()).toBe('2')
    expect(trigger().getAttribute('aria-label')).toBe('Filter, 2 applied')
    document.body.innerHTML = ''
    mount()
    expect(byTestId('data-filter-menu__count')).toBeNull()
    expect(trigger().getAttribute('aria-label')).toBe('Filter')
  })

  it('uses the label prop as the trigger text', () => {
    render(FilterMenu, { props: { fields, label: 'Filters' } })
    expect(trigger().textContent).toContain('Filters')
  })

  it('opens on the trigger, lists the fields with their applied summary, and marks the trigger expanded', async () => {
    mount({ owner: ['jane', 'priya'] })
    const opened = await openMenu()
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
    expect(opened.querySelector('[data-level="fields"]')).not.toBeNull()
    const author = byTestId('data-filter-menu__field-owner')!
    expect(author.hasAttribute('data-applied')).toBe(true)
    expect(author.textContent).toContain('Jane Doe')
    expect(author.textContent).toContain('+1')
    expect(byTestId('data-filter-menu__field-status')?.hasAttribute('data-applied')).toBe(false)
  })

  it('drills into a multi field: checkbox rows inside a named group toggle values in the model', async () => {
    const { updates } = mount({ owner: ['jane'] })
    await openField('owner')
    const group = panel()!.querySelector('[role="group"]')!
    expect(group.getAttribute('aria-label')).toBe('Author')
    const jane = byTestId('data-filter-menu__option-jane')!
    const john = byTestId('data-filter-menu__option-john')!
    expect(jane.getAttribute('role')).toBe('checkbox')
    expect(jane.getAttribute('aria-checked')).toBe('true')
    expect(john.getAttribute('aria-checked')).toBe('false')
    await fireEvent.click(john)
    expect(updates.at(-1)).toEqual({ owner: ['jane', 'john'] })
    await fireEvent.click(byTestId('data-filter-menu__option-jane')!)
    expect(updates.at(-1)).toEqual({ owner: ['john'] })
  })

  it('picks one value of a single field as a radio and returns to the fields', async () => {
    const { updates } = mount()
    await openField('status')
    expect(panel()!.querySelector('[role="radiogroup"]')).not.toBeNull()
    const live = byTestId('data-filter-menu__option-live')!
    expect(live.getAttribute('role')).toBe('radio')
    await fireEvent.click(live)
    expect(updates.at(-1)).toEqual({ status: ['live'] })
    await waitFor(() => expect(panel()?.querySelector('[data-level="fields"]')).not.toBeNull())
  })

  it('clears a field with Clear and deletes its key from the model', async () => {
    const { updates } = mount({ owner: ['jane'], status: ['live'] })
    await openField('owner')
    const clear = byTestId('data-filter-menu__clear')!
    expect(clear.textContent).toContain('Clear Author')
    await fireEvent.click(clear)
    expect(updates.at(-1)).toEqual({ status: ['live'] })
  })

  it('goes back to the fields with the Back button', async () => {
    mount()
    await openField('owner')
    const back = byTestId('data-filter-menu__back')!
    expect(back.getAttribute('aria-label')).toBe('Back to all filters')
    await fireEvent.click(back)
    await waitFor(() => expect(panel()?.querySelector('[data-level="fields"]')).not.toBeNull())
  })

  it('filters rows by the search and says when nothing matches', async () => {
    mount()
    await openField('owner')
    const input =
      byTestId('data-filter-menu__search')!.querySelector('input') ??
      byTestId('data-filter-menu__search')!
    expect(input.getAttribute('aria-label')).toBe('Search Author values')
    await fireEvent.update(input as HTMLInputElement, 'pri')
    expect(byTestId('data-filter-menu__option-priya')).not.toBeNull()
    expect(byTestId('data-filter-menu__option-jane')).toBeNull()
    await fireEvent.update(input as HTMLInputElement, 'zzz')
    expect(panel()!.textContent).toContain('No match for “zzz”.')
  })

  it('offers the built-in periods and a custom range on a date field, and stores the period id', async () => {
    const { updates } = mount()
    await openField('modified')
    expect(byTestId('data-filter-menu__option-7d')?.textContent).toContain('Last 7 days')
    expect(byTestId('data-filter-menu__custom')?.textContent).toContain('Custom range')
    await fireEvent.click(byTestId('data-filter-menu__option-7d')!)
    expect(updates.at(-1)).toEqual({ modified: ['7d'] })
  })

  it('opens the custom range calendar from a date field and goes back to the periods', async () => {
    mount()
    await openField('modified')
    await fireEvent.click(byTestId('data-filter-menu__custom')!)
    await waitFor(() => expect(byTestId('data-filter-menu__calendar')).not.toBeNull())
    expect(panel()?.querySelector('[data-level="custom:modified"]')).not.toBeNull()
    expect(byTestId('data-filter-menu__back')?.getAttribute('aria-label')).toBe(
      'Back to date periods'
    )
    await fireEvent.click(byTestId('data-filter-menu__back')!)
    await waitFor(() =>
      expect(panel()?.querySelector('[data-level="values:modified"]')).not.toBeNull()
    )
  })

  it('commits a whole-day custom range from the range picker as dates', async () => {
    const { updates } = mount()
    await openField('modified')
    await fireEvent.click(byTestId('data-filter-menu__custom')!)
    const picker = await waitFor(() => {
      const el = byTestId('data-filter-menu__calendar__popover')
      expect(el).not.toBeNull()
      return el as HTMLElement
    })
    expect(within(picker).queryByLabelText('Start time')).toBeNull()
    const start = within(picker).getByLabelText('Start')
    const end = within(picker).getByLabelText('End')
    await fireEvent.update(start, '11/2/2026')
    await fireEvent.change(start)
    await fireEvent.update(end, '11/9/2026')
    await fireEvent.change(end)
    await fireEvent.click(within(picker).getByRole('button', { name: 'Apply' }))
    const applied = updates.at(-1)?.['modified'] as { start: Date; end: Date }[]
    expect(applied[0].start).toBeInstanceOf(Date)
    expect(applied[0].start.getDate()).toBe(2)
    expect(applied[0].end.getDate()).toBe(9)
  })

  it('summarizes a custom range on the field row', async () => {
    mount({ modified: [{ start: new Date(2026, 10, 2), end: new Date(2026, 10, 9) }] })
    await openMenu()
    expect(byTestId('data-filter-menu__field-modified')?.textContent).toContain('Nov 2 – Nov 9')
  })

  it('moves focus between the rows of a level with the arrow keys, wrapping at the ends', async () => {
    mount()
    await openMenu()
    const rows = [...panel()!.querySelectorAll<HTMLElement>('[data-filter-row]')]
    rows[0]!.focus()
    await fireEvent.keyDown(rows[0]!, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(rows[1])
    await fireEvent.keyDown(rows[1]!, { key: 'ArrowUp' })
    await fireEvent.keyDown(rows[0]!, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(rows.at(-1))
  })

  it('focuses the first value when a field opens', async () => {
    mount()
    await openField('status')
    await waitFor(() =>
      expect(document.activeElement).toBe(byTestId('data-filter-menu__option-live'))
    )
  })

  it('opens at a field through the exposed open()', async () => {
    const menu = ref<InstanceType<typeof FilterMenu> | null>(null)
    render(defineComponent({ setup: () => () => h(FilterMenu, { ref: menu, fields }) }))
    menu.value?.open('status')
    await waitFor(() =>
      expect(panel()?.querySelector('[data-level="values:status"]')).not.toBeNull()
    )
  })

  it('has no a11y violations closed and open', async () => {
    const { view } = mount({ owner: ['jane'] })
    await expectNoA11yViolations(view.container)
    await openField('owner')
    await expectNoA11yViolations(panel()!)
  })

  describe('FilterMenu.Chips', () => {
    it('renders one chip per applied field with its label, first value and +N, in a named group', () => {
      mount({ owner: ['jane', 'john', 'priya'], status: ['live'] }, true)
      const group = byTestId('data-filter-menu-chips')!
      expect(group.getAttribute('role')).toBe('group')
      expect(group.getAttribute('aria-label')).toBe('Applied filters')
      const owner = byTestId('data-filter-menu-chips__chip-owner')!
      expect(owner.textContent).toContain('Author')
      expect(owner.textContent).toContain('Jane Doe')
      expect(owner.textContent).toContain('+2')
      expect(byTestId('data-filter-menu-chips__chip-status')?.textContent).toContain('Live')
      expect(byTestId('data-filter-menu-chips__chip-modified')).toBeNull()
    })

    it('renders nothing when no field is applied', () => {
      mount({}, true)
      expect(byTestId('data-filter-menu-chips')).toBeNull()
    })

    it('reopens the menu that shares its fields at the chip field, emitting edit with the event first', async () => {
      const { edits } = mount({ status: ['live'] }, true)
      await settle()
      const chip = byTestId('data-filter-menu-chips__chip-status')!
      const body = chip.querySelector<HTMLElement>('[role="button"], button') ?? chip
      await fireEvent.click(body)
      expect(edits.length).toBe(1)
      expect(edits[0]![0]).toBeInstanceOf(Event)
      expect((edits[0]![1] as FilterMenuField).id).toBe('status')
      await waitFor(() =>
        expect(panel()?.querySelector('[data-level="values:status"]')).not.toBeNull()
      )
    })

    it('removes a field from the model with the remove button, emitting remove with the event first', async () => {
      const { removes, updates } = mount({ owner: ['jane'], status: ['live'] }, true)
      const chip = byTestId('data-filter-menu-chips__chip-owner')!
      const remove =
        chip.querySelector<HTMLElement>('[data-testid$="__remove"]') ??
        [...chip.querySelectorAll<HTMLElement>('button')].at(-1)!
      await fireEvent.click(remove)
      expect(removes.length).toBe(1)
      expect(removes[0]![0]).toBeInstanceOf(MouseEvent)
      expect((removes[0]![1] as FilterMenuField).id).toBe('owner')
      expect(updates.at(-1)).toEqual({ status: ['live'] })
      await nextTick()
    })

    it('has no a11y violations', async () => {
      const { view } = mount({ owner: ['jane', 'john'] }, true)
      await expectNoA11yViolations(view.container)
    })
  })

  describe('examples', () => {
    it('render the Default and Sizes examples', async () => {
      const first = render(Default)
      expect(first.getByTestId('data-filter-menu')).toBeTruthy()
      expect(first.getByTestId('data-filter-menu-chips')).toBeTruthy()
      await expectNoA11yViolations(first.container)
      first.unmount()
      const sizes = render(Sizes)
      expect(sizes.getAllByTestId('data-filter-menu__count')).toHaveLength(3)
    })
  })

  describe('open state, disabled and long value lists', () => {
    it('opens from defaultOpen and reports and follows v-model:open', async () => {
      const seeded = render(FilterMenu, { props: { fields, defaultOpen: true } })
      await waitFor(() => expect(panel()).not.toBeNull(), WAIT)
      seeded.unmount()
      document.body.innerHTML = ''

      const view = render(FilterMenu, { props: { fields, open: false, 'onUpdate:open': () => {} } })
      await settle()
      await fireEvent.click(trigger())
      expect(view.emitted()['update:open']).toEqual([[true]])
      expect(trigger().getAttribute('aria-expanded')).toBe('false')
      await view.rerender({ open: true })
      await waitFor(() => expect(panel()).not.toBeNull(), WAIT)
    })

    it('opens and closes through v-model:open', async () => {
      const open = ref(false)
      const opens: boolean[] = []
      render(
        defineComponent({
          setup: () => () =>
            h(FilterMenu, {
              fields,
              open: open.value,
              'onUpdate:open': (value: boolean) => {
                opens.push(value)
                open.value = value
              }
            })
        })
      )
      await settle()
      open.value = true
      await waitFor(() => expect(panel()).not.toBeNull(), WAIT)
      await fireEvent.click(trigger())
      expect(opens.at(-1)).toBe(false)
      await waitFor(() => expect(panel()).toBeNull(), WAIT)
    })

    it('does not open while disabled', async () => {
      render(FilterMenu, { props: { fields, disabled: true } })
      await settle()
      expect(trigger().disabled).toBe(true)
      await fireEvent.click(trigger())
      await settle()
      expect(panel()).toBeNull()
    })

    it('renders at most 100 values and says how many more there are', async () => {
      const hosts: FilterMenuField[] = [
        {
          id: 'host',
          label: 'Host',
          options: Array.from({ length: 1000 }, (_, i) => ({
            value: `h${i}`,
            label: `host-${i}.example.com`
          }))
        }
      ]
      render(FilterMenu, { props: { fields: hosts } })
      await openField('host')
      expect(panel()!.querySelectorAll('[data-filter-row][role="checkbox"]')).toHaveLength(100)
      expect(byTestId('data-filter-menu__more-values')?.textContent).toContain('900 more values')
    })

    it('warns when FilterMenu.Chips has no FilterMenu with the same fields array', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(
        defineComponent({
          setup: () => () =>
            h('div', null, [
              h(FilterMenu, { fields: [...fields], modelValue: { status: ['live'] } }),
              h(FilterMenuChips, { fields: [...fields], modelValue: { status: ['live'] } })
            ])
        })
      )
      await settle()
      const chip = byTestId('data-filter-menu-chips__chip-status')!
      await fireEvent.click(chip.querySelector<HTMLElement>('[role="button"], button') ?? chip)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('no FilterMenu has these fields'))
      warn.mockRestore()
    })

    it('does not warn when both share one fields array', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount({ status: ['live'] }, true)
      await settle()
      const chip = byTestId('data-filter-menu-chips__chip-status')!
      await fireEvent.click(chip.querySelector<HTMLElement>('[role="button"], button') ?? chip)
      expect(warn).not.toHaveBeenCalledWith(
        expect.stringContaining('no FilterMenu has these fields')
      )
      warn.mockRestore()
    })
  })
})
