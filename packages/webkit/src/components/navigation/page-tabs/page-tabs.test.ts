import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import Default from '../../../../examples/page-tabs/default.vue'
import FormColumn from '../../../../examples/page-tabs/form-column.vue'
import WithActions from '../../../../examples/page-tabs/with-actions.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import TabsTrigger from '../tabs/tabs-trigger.vue'
import PageTabs from './page-tabs.vue'

const harness = (initial: string, testId?: string) => {
  const value = ref<string | number | null>(initial)
  const Harness = defineComponent({
    setup: () => () =>
      h(
        PageTabs,
        {
          modelValue: value.value,
          'onUpdate:modelValue': (next: string | number | null) => {
            value.value = next
          },
          ...(testId ? { 'data-testid': testId } : {})
        },
        {
          default: () => [
            h(TabsTrigger, { value: 'overview', label: 'Overview' }),
            h(TabsTrigger, { value: 'settings', label: 'Settings' })
          ]
        }
      )
  })
  return { Harness, value }
}

describe('PageTabs', () => {
  it('renders the strip with a tablist and the default testid', () => {
    const { Harness } = harness('overview')
    const { getByTestId, getByRole, getAllByRole } = within(
      render(Harness).container as HTMLElement
    )

    expect(getByTestId('page-tabs')).toBeTruthy()
    expect(getByRole('tablist')).toBeTruthy()
    expect(getAllByRole('tab')).toHaveLength(2)
  })

  it('honours a consumer data-testid', () => {
    const { Harness } = harness('overview', 'service-tabs')
    const { getByTestId } = within(render(Harness).container as HTMLElement)

    expect(getByTestId('service-tabs__tabs')).toBeTruthy()
  })

  it('reflects v-model and updates it when a tab is picked', async () => {
    const { Harness, value } = harness('overview')
    const { getByRole } = within(render(Harness).container as HTMLElement)

    expect(getByRole('tab', { name: 'Overview' }).getAttribute('aria-selected')).toBe('true')

    await fireEvent.click(getByRole('tab', { name: 'Settings' }))

    expect(value.value).toBe('settings')
    expect(getByRole('tab', { name: 'Settings' }).getAttribute('aria-selected')).toBe('true')
  })

  it('renders the actions region only when given', () => {
    expect(
      within(render(Default).container as HTMLElement).queryByTestId('page-tabs__actions')
    ).toBeNull()

    const actions = within(render(WithActions).container as HTMLElement).getByTestId(
      'page-tabs__actions'
    )
    expect(within(actions).getByRole('button', { name: 'Deploy' })).toBeTruthy()
  })

  it('lines the tab row up with the full width by default', () => {
    const { Harness } = harness('overview')
    const { getByTestId } = within(render(Harness).container as HTMLElement)

    expect(getByTestId('page-tabs').getAttribute('data-column')).toBe('full')
  })

  it.each(['data', 'form', 'focused'] as const)('mirrors column=%s on the root', (column) => {
    const { getByTestId } = within(
      render(PageTabs, {
        props: { column },
        slots: { default: () => h(TabsTrigger, { value: 'overview', label: 'Overview' }) }
      }).container as HTMLElement
    )

    expect(getByTestId('page-tabs').getAttribute('data-column')).toBe(column)
    expect(getByTestId('page-tabs__row').contains(getByTestId('page-tabs__tabs'))).toBe(true)
  })

  it('renders the form column example with its tabs', () => {
    const { getByTestId, getAllByRole } = within(render(FormColumn).container as HTMLElement)

    expect(getByTestId('page-tabs').getAttribute('data-column')).toBe('form')
    expect(getAllByRole('tab')).toHaveLength(3)
  })

  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(render(Default).container)
    await expectNoA11yViolations(render(WithActions).container)
    await expectNoA11yViolations(render(FormColumn).container)
  })
})
