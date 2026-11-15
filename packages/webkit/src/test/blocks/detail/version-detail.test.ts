import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { type Component, defineComponent, h } from 'vue'

import DeviceGroups from '../../../../blocks/detail/version-detail/variants/device-groups.vue'
import EnvironmentCrumb from '../../../../blocks/detail/version-detail/variants/environment-crumb.vue'
import Revert from '../../../../blocks/detail/version-detail/variants/revert.vue'
import ConsoleLayout from '../../../components/layout/console-layout/console-layout.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button, a')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLElement

const inConsoleLayout = (page: Component) =>
  defineComponent({
    render: () =>
      h(
        ConsoleLayout,
        { breadcrumbs: [{ label: 'Resources', href: '/resources' }] },
        { default: () => h(page) }
      )
  })

afterEach(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})
describe('version-detail#DeviceGroups', () => {
  it('validates the add drawer and adds the group to the table', async () => {
    render(DeviceGroups)
    await fireEvent.click(screen.getByRole('button', { name: 'Add Device Group' }))
    const drawer = await screen.findByRole('dialog', { name: 'Add Device Group' })
    const submit = drawer.querySelector<HTMLButtonElement>('button[type="submit"]')!
    await fireEvent.click(submit)
    expect(await screen.findByText('Enter a name for the device group.')).toBeTruthy()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Name' }), 'smart-tv')
    await fireEvent.update(
      screen.getByRole('textbox', { name: 'Regular expression' }),
      '(SmartTV|Tizen)'
    )
    await fireEvent.click(submit)
    await waitFor(() => expect(screen.getByRole('button', { name: 'smart-tv' })).toBeTruthy(), {
      timeout: 4000
    })
  })
})

describe('detail/version-detail', () => {
  it('opens earlier versions as links and marks the viewed one as the current page', () => {
    render(Revert)
    const history = document.querySelector('[aria-current="page"]') as HTMLAnchorElement
    expect(history.tagName).toBe('A')
    expect(history.getAttribute('href')).toBe('/resources/web-app/versions/AK7D0ZX4')
  })

  it('tells a search with no match apart from an empty list', async () => {
    const view = render(DeviceGroups)
    const root = view.container as HTMLElement
    await fireEvent.update(view.getByRole('textbox', { name: 'Search device groups' }), 'zzz-none')
    await waitFor(() => expect(root.textContent).toContain('No matching device groups'))
    await fireEvent.click(buttonByText('Clear search', root))
    await waitFor(() => expect(root.textContent).not.toContain('No matching device groups'))
  })
})

describe('version-detail#EnvironmentCrumb', () => {
  it('names the environment and the version crumbs', async () => {
    render(inConsoleLayout(EnvironmentCrumb))
    const header = within(screen.getByTestId('layout-console-layout__header'))
    await waitFor(() =>
      expect(header.getByRole('combobox', { name: 'Switch environment' })).toBeTruthy()
    )
    expect(header.getByRole('combobox', { name: 'Switch version' })).toBeTruthy()
    const environments = screen.getAllByRole('combobox', { name: 'Switch environment' })
    expect(environments).toHaveLength(2)
    for (const trigger of environments) expect(trigger.textContent).toContain('Production')
    expect(screen.getAllByRole('combobox', { name: 'Switch version' })).toHaveLength(2)
  })
})
