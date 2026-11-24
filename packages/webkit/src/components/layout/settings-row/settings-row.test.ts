import '../../../test/reflow.css'

import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import CompactRows from '../../../../examples/settings-row/compact-rows.vue'
import Default from '../../../../examples/settings-row/default.vue'
import Nested from '../../../../examples/settings-row/nested.vue'
import Stackable from '../../../../examples/settings-row/stackable.vue'
import WithHint from '../../../../examples/settings-row/with-hint.vue'
import WithMessage from '../../../../examples/settings-row/with-message.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ItemList from '../../content/item/item-list.vue'
import SettingsRow, { type SettingsRowProps } from './settings-row.vue'

const inList = (props: SettingsRowProps, slots: Record<string, string> = {}) =>
  defineComponent({
    setup: () => () =>
      h(ItemList, null, {
        default: () =>
          h(SettingsRow, props, {
            default: () => h('input', { 'aria-label': props.title }),
            ...Object.fromEntries(
              Object.entries(slots).map(([name, html]) => [
                name,
                () => h('span', { innerHTML: html })
              ])
            )
          })
      })
  })

describe('SettingsRow', () => {
  it('renders the title, description and control with the default testid', () => {
    const { getByTestId, getByRole } = within(
      render(inList({ title: 'Name', description: 'A unique name.' })).container as HTMLElement
    )

    expect(getByTestId('settings-row')).toBeTruthy()
    expect(getByTestId('settings-row__title').textContent?.trim()).toBe('Name')
    expect(getByTestId('settings-row__description').textContent?.trim()).toBe('A unique name.')
    expect(getByTestId('settings-row__control').contains(getByRole('textbox'))).toBe(true)
  })

  it('honours a consumer data-testid', () => {
    const { getByTestId } = within(
      render(
        defineComponent({
          setup: () => () =>
            h(ItemList, null, {
              default: () => h(SettingsRow, { title: 'Name', 'data-testid': 'name-row' })
            })
        })
      ).container as HTMLElement
    )

    expect(getByTestId('name-row__title').textContent?.trim()).toBe('Name')
  })

  it('omits the description when none is given', () => {
    const { queryByTestId } = within(render(inList({ title: 'Name' })).container as HTMLElement)

    expect(queryByTestId('settings-row__description')).toBeNull()
  })

  it.each(['field', 'compact', 'stacked'] as const)(
    'mirrors variant=%s onto data-row-variant',
    (variant) => {
      const { getByTestId } = within(
        render(inList({ title: 'Name', variant })).container as HTMLElement
      )

      expect(getByTestId('settings-row').getAttribute('data-row-variant')).toBe(variant)
      expect(getByTestId('settings-row__control').getAttribute('data-variant')).toBe(variant)
    }
  )

  it.each([0, 1, 2] as const)('mirrors depth=%s onto data-depth', (depth) => {
    const { getByTestId } = within(
      render(inList({ title: 'Name', depth })).container as HTMLElement
    )

    expect(getByTestId('settings-row').getAttribute('data-depth')).toBe(String(depth))
  })

  it('sets data-stackable only when stackable is on', () => {
    const off = within(render(inList({ title: 'Name' })).container as HTMLElement)
    expect(off.getByTestId('settings-row').hasAttribute('data-stackable')).toBe(false)

    const on = within(
      render(inList({ title: 'Address', stackable: true })).container as HTMLElement
    )
    expect(on.getByTestId('settings-row').hasAttribute('data-stackable')).toBe(true)
  })

  it('renders a Hint beside the title when hint is set', () => {
    const hint = 'The edge serves the cached copy until this many seconds pass.'
    const { getByTestId, getByRole } = within(
      render(inList({ title: 'Cache TTL', hint })).container as HTMLElement
    )

    const glyph = getByTestId('settings-row__hint__trigger')
    expect(getByTestId('settings-row__title').contains(glyph)).toBe(true)
    expect(getByRole('button', { name: hint })).toBe(glyph)
  })

  it('marks a required row after its title, as a required field label does', () => {
    const { getByTestId, queryByTestId } = within(
      render(inList({ title: 'Name', required: true })).container as HTMLElement
    )

    const marker = getByTestId('settings-row__required')
    expect(getByTestId('settings-row__title').contains(marker)).toBe(true)
    expect(marker.textContent?.trim()).toBe('*')
    expect(marker.getAttribute('aria-hidden')).toBe('true')
    const optional = render(inList({ title: 'Region' })).container as HTMLElement
    expect(within(optional).queryByTestId('settings-row__required')).toBeNull()
    expect(queryByTestId('settings-row__required')).toBe(marker)
  })

  it('renders no Hint when hint is empty', () => {
    const { queryByTestId, queryByRole } = within(
      render(inList({ title: 'Name' })).container as HTMLElement
    )

    expect(queryByTestId('settings-row__hint__trigger')).toBeNull()
    expect(queryByRole('button')).toBeNull()
  })

  it('keeps the whole description in the DOM for assistive technology', () => {
    const description =
      'The first sentence says what it does. The second adds detail. The third adds even more detail that a two-line clamp would hide on screen.'
    const { getByTestId } = within(
      render(inList({ title: 'Name', description })).container as HTMLElement
    )

    expect(getByTestId('settings-row__description').textContent?.trim()).toBe(description)
  })

  it('renders rich title and description slots', () => {
    const { getByTestId } = within(
      render(
        inList({ title: 'Name' }, { title: '<b>Name</b>', description: '<a href="#x">Docs</a>' })
      ).container as HTMLElement
    )

    expect(getByTestId('settings-row__title').querySelector('b')).toBeTruthy()
    expect(getByTestId('settings-row__description').querySelector('a')).toBeTruthy()
  })

  it('renders the examples', () => {
    expect(
      within(render(Default).container as HTMLElement).getAllByTestId('settings-row')
    ).toHaveLength(3)
    expect(
      within(render(CompactRows).container as HTMLElement).getAllByRole('switch')
    ).toHaveLength(2)
    expect(
      within(render(WithMessage).container as HTMLElement).getByText('This field is required.')
    ).toBeTruthy()
    const depths = within(render(Nested).container as HTMLElement)
      .getAllByTestId('settings-row')
      .map((el) => el.dataset['depth'])
    expect(depths).toEqual(['0', '0', '1', '1', '1', '2'])
    expect(within(render(Stackable).container as HTMLElement).getAllByRole('textbox')).toHaveLength(
      2
    )
    expect(
      within(render(WithHint).container as HTMLElement).getAllByTestId(
        'settings-row__hint__trigger'
      )
    ).toHaveLength(2)
  })

  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(render(Default).container)
    await expectNoA11yViolations(render(Nested).container)
    await expectNoA11yViolations(render(WithHint).container)
  })

  const boxOf = (width: number) => {
    const host = document.createElement('div')
    host.style.width = `${width}px`
    document.body.appendChild(host)
    return host
  }

  describe('in a narrow box', () => {
    const mountIn = (width: number, props: Record<string, unknown> = {}) =>
      render(SettingsRow, {
        props: { title: 'Cache TTL', description: 'How long the edge keeps a copy.', ...props },
        slots: { default: '<input aria-label="TTL" />' },
        container: boxOf(width)
      })

    const beside = (view: ReturnType<typeof mountIn>) => {
      const title = view.getByTestId('settings-row__title')
      const control = view.getByTestId('settings-row__control')
      return control.getBoundingClientRect().top < title.getBoundingClientRect().bottom
    }

    it('moves a field control under the copy on a phone', () => {
      expect(beside(mountIn(320))).toBe(false)
    })

    it('keeps a switch or button at the end side on a phone', () => {
      expect(beside(mountIn(320, { variant: 'compact' }))).toBe(true)
    })

    it('wraps a long description in full on a phone, never clamped', () => {
      const description =
        'The first sentence says what it does. The second adds detail. The third adds even more detail that a two-line clamp would hide on screen.'
      const view = mountIn(320, { description })
      const element = view.getByTestId('settings-row__description')

      expect(element.scrollHeight).toBeLessThanOrEqual(element.clientHeight + 1)
      expect(element.getBoundingClientRect().height).toBeGreaterThan(
        parseFloat(getComputedStyle(element).lineHeight) * 2.5
      )
    })

    it('top-aligns the title with a tall control', () => {
      const view = render(SettingsRow, {
        props: { title: 'Nameservers', description: 'Set Azion Edge DNS as the authority.' },
        slots: { default: '<textarea aria-label="Nameservers" rows="8"></textarea>' },
        container: boxOf(900)
      })
      const row = view.getByTestId('settings-row').getBoundingClientRect()
      const title = view.getByTestId('settings-row__title').getBoundingClientRect()
      const control = view.getByTestId('settings-row__control').getBoundingClientRect()

      expect(Math.abs(title.top - control.top)).toBeLessThan(row.height / 4)
    })

    it('keeps a field control beside the copy in a wide box', () => {
      expect(beside(mountIn(900))).toBe(true)
    })

    it('stacks a stackable field control in a drawer-width box', () => {
      expect(beside(mountIn(520))).toBe(true)
      expect(beside(mountIn(520, { stackable: true }))).toBe(false)
    })

    it('keeps a stackable control beside the copy in a wide box', () => {
      expect(beside(mountIn(900, { stackable: true }))).toBe(true)
    })
  })
})
