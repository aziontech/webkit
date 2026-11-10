import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import CompactRows from '../../../../examples/setting-row/compact-rows.vue'
import Default from '../../../../examples/setting-row/default.vue'
import Nested from '../../../../examples/setting-row/nested.vue'
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
  })

  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(render(Default).container)
    await expectNoA11yViolations(render(Nested).container)
  })
})
