import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import Default from '../../../../examples/page-tabs/default.vue'
import WithActions from '../../../../examples/page-tabs/with-actions.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import TabsItem from '../tabs/tabs-item.vue'
import PageTabs from './page-tabs.vue'

const harness = (initial: string, testId?: string) => {
  const value = ref<string | number | null>(initial)
  const Harness = defineComponent({
    setup: () => () =>
      h(
        PageTabs,
        {
          value: value.value,
          'onUpdate:value': (next: string | number | null) => {
            value.value = next
          },
          ...(testId ? { 'data-testid': testId } : {})
        },
        {
          default: () => [
            h(TabsItem, { value: 'overview', label: 'Overview' }),
            h(TabsItem, { value: 'settings', label: 'Settings' })
          ]
        }
      )
  })
  return { Harness, value }
}

describe('PageTabs', () => {
  it('renders the strip with a tablist and the default testid', () => {
    const { Harness } = harness('overview')
    const { getByTestId, getByRole, getAllByRole } = within(render(Harness).container)

    expect(getByTestId('navigation-page-tabs')).toBeTruthy()
    expect(getByRole('tablist')).toBeTruthy()
    expect(getAllByRole('tab')).toHaveLength(2)
  })

  it('honours a consumer data-testid', () => {
    const { Harness } = harness('overview', 'service-tabs')
    const { getByTestId } = within(render(Harness).container)

    expect(getByTestId('service-tabs__tabs')).toBeTruthy()
  })

  it('reflects v-model:value and updates it when a tab is picked', async () => {
    const { Harness, value } = harness('overview')
    const { getByRole } = within(render(Harness).container)

    expect(getByRole('tab', { name: 'Overview' }).getAttribute('aria-selected')).toBe('true')

    await fireEvent.click(getByRole('tab', { name: 'Settings' }))

    expect(value.value).toBe('settings')
    expect(getByRole('tab', { name: 'Settings' }).getAttribute('aria-selected')).toBe('true')
  })

  it('renders the actions region only when given', () => {
    expect(
      within(render(Default).container).queryByTestId('navigation-page-tabs__actions')
    ).toBeNull()

    const actions = within(render(WithActions).container).getByTestId(
      'navigation-page-tabs__actions'
    )
    expect(within(actions).getByRole('button', { name: 'Deploy' })).toBeTruthy()
  })

  it('has no accessibility violations', async () => {
    await expectNoA11yViolations(render(Default).container)
    await expectNoA11yViolations(render(WithActions).container)
  })
})
