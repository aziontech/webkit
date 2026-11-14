import '../../../test/reflow.css'

import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import CompactRows from '../../../../examples/setting-row/compact-rows.vue'
import Default from '../../../../examples/setting-row/default.vue'
import Nested from '../../../../examples/setting-row/nested.vue'
import Stackable from '../../../../examples/setting-row/stackable.vue'
import WithHint from '../../../../examples/setting-row/with-hint.vue'
import WithMessage from '../../../../examples/setting-row/with-message.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ItemList from '../../content/item/item-list.vue'
import SettingRow from './setting-row.vue'

const inList = (props: Record<string, unknown>, slots: Record<string, string> = {}) =>
  defineComponent({
    setup: () => () =>
      h(ItemList, null, {
        default: () =>
          h(SettingRow, props, {
            default: () => h('input', { 'aria-label': String(props['title']) }),
            ...Object.fromEntries(
              Object.entries(slots).map(([name, html]) => [
                name,
                () => h('span', { innerHTML: html })
              ])
            )
          })
      })
  })

describe('SettingRow', () => {
  it('renders the title, description and control with the default testid', () => {
    const { getByTestId, getByRole } = within(
      render(inList({ title: 'Name', description: 'A unique name.' })).container
    )

    expect(getByTestId('layout-setting-row')).toBeTruthy()
    expect(getByTestId('layout-setting-row__title').textContent?.trim()).toBe('Name')
    expect(getByTestId('layout-setting-row__description').textContent?.trim()).toBe(
      'A unique name.'
    )
    expect(getByTestId('layout-setting-row__control').contains(getByRole('textbox'))).toBe(true)
  })

  it('honours a consumer data-testid', () => {
    const { getByTestId } = within(
      render(
        defineComponent({
          setup: () => () =>
            h(ItemList, null, {
              default: () => h(SettingRow, { title: 'Name', 'data-testid': 'name-row' })
            })
        })
      ).container
    )

    expect(getByTestId('name-row__title').textContent?.trim()).toBe('Name')
  })

  it('omits the description when none is given', () => {
    const { queryByTestId } = within(render(inList({ title: 'Name' })).container)

    expect(queryByTestId('layout-setting-row__description')).toBeNull()
  })

  it.each(['field', 'compact', 'stacked'] as const)(
    'mirrors kind=%s onto data-row-kind',
    (kind) => {
      const { getByTestId } = within(render(inList({ title: 'Name', kind })).container)

      expect(getByTestId('layout-setting-row').getAttribute('data-row-kind')).toBe(kind)
      expect(getByTestId('layout-setting-row__control').getAttribute('data-kind')).toBe(kind)
    }
  )

  it.each([0, 1, 2] as const)('mirrors level=%s onto data-level', (level) => {
    const { getByTestId } = within(render(inList({ title: 'Name', level })).container)

    expect(getByTestId('layout-setting-row').getAttribute('data-level')).toBe(String(level))
  })

  it('sets data-stackable only when stackable is on', () => {
    const off = within(render(inList({ title: 'Name' })).container)
    expect(off.getByTestId('layout-setting-row').hasAttribute('data-stackable')).toBe(false)

    const on = within(render(inList({ title: 'Address', stackable: true })).container)
    expect(on.getByTestId('layout-setting-row').hasAttribute('data-stackable')).toBe(true)
  })

  it('renders a Hint beside the title when hint is set', () => {
    const hint = 'The edge serves the cached copy until this many seconds pass.'
    const { getByTestId, getByRole } = within(
      render(inList({ title: 'Cache TTL', hint })).container
    )

    const glyph = getByTestId('layout-setting-row__hint__trigger')
    expect(getByTestId('layout-setting-row__title').contains(glyph)).toBe(true)
    expect(getByRole('button', { name: hint })).toBe(glyph)
  })

  it('renders no Hint when hint is empty', () => {
    const { queryByTestId, queryByRole } = within(render(inList({ title: 'Name' })).container)

    expect(queryByTestId('layout-setting-row__hint__trigger')).toBeNull()
    expect(queryByRole('button')).toBeNull()
  })

  it('keeps the whole description in the DOM for assistive technology', () => {
    const description =
      'The first sentence says what it does. The second adds detail. The third adds even more detail that a two-line clamp would hide on screen.'
    const { getByTestId } = within(render(inList({ title: 'Name', description })).container)

    expect(getByTestId('layout-setting-row__description').textContent?.trim()).toBe(description)
  })

  it('renders rich title and description slots', () => {
    const { getByTestId } = within(
      render(
        inList({ title: 'Name' }, { title: '<b>Name</b>', description: '<a href="#x">Docs</a>' })
      ).container
    )

    expect(getByTestId('layout-setting-row__title').querySelector('b')).toBeTruthy()
    expect(getByTestId('layout-setting-row__description').querySelector('a')).toBeTruthy()
  })

  it('renders the examples', () => {
    expect(within(render(Default).container).getAllByTestId('layout-setting-row')).toHaveLength(3)
    expect(within(render(CompactRows).container).getAllByRole('switch')).toHaveLength(2)
    expect(within(render(WithMessage).container).getByText('This field is required.')).toBeTruthy()
    const levels = within(render(Nested).container)
      .getAllByTestId('layout-setting-row')
      .map((el) => el.dataset['level'])
    expect(levels).toEqual(['0', '0', '1', '1', '1', '2'])
    expect(within(render(Stackable).container).getAllByRole('textbox')).toHaveLength(2)
    expect(
      within(render(WithHint).container).getAllByTestId('layout-setting-row__hint__trigger')
    ).toHaveLength(2)
  })

  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(render(Default).container)
    await expectNoA11yViolations(render(Nested).container)
    await expectNoA11yViolations(render(WithHint).container)
  })
})

const boxOf = (width: number) => {
  const host = document.createElement('div')
  host.style.width = `${width}px`
  document.body.appendChild(host)
  return host
}

describe('SettingRow in a narrow box', () => {
  const mountIn = (width: number, props: Record<string, unknown> = {}) =>
    render(SettingRow, {
      props: { title: 'Cache TTL', description: 'How long the edge keeps a copy.', ...props },
      slots: { default: '<input aria-label="TTL" />' },
      container: boxOf(width)
    })

  const beside = (view: ReturnType<typeof mountIn>) => {
    const title = view.getByTestId('layout-setting-row__title')
    const control = view.getByTestId('layout-setting-row__control')
    return control.getBoundingClientRect().top < title.getBoundingClientRect().bottom
  }

  it('keeps the control beside the copy by default, as the console does on a phone', () => {
    expect(beside(mountIn(320))).toBe(true)
  })

  it('top-aligns the title with a tall control', () => {
    const view = render(SettingRow, {
      props: { title: 'Nameservers', description: 'Set Azion Edge DNS as the authority.' },
      slots: { default: '<textarea aria-label="Nameservers" rows="8"></textarea>' },
      container: boxOf(900)
    })
    const row = view.getByTestId('layout-setting-row').getBoundingClientRect()
    const title = view.getByTestId('layout-setting-row__title').getBoundingClientRect()
    const control = view.getByTestId('layout-setting-row__control').getBoundingClientRect()

    expect(Math.abs(title.top - control.top)).toBeLessThan(row.height / 4)
  })

  it('moves a stackable field control under the copy at full width', () => {
    expect(beside(mountIn(320, { stackable: true }))).toBe(false)
  })

  it('keeps a stackable control beside the copy in a wide box', () => {
    expect(beside(mountIn(900, { stackable: true }))).toBe(true)
  })
})
