import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { type Component, defineComponent, h } from 'vue'

import DetailVersion, {
  type VersionDetailVersion
} from '../../../../blocks/detail/detail-version/detail-version.vue'
import DeviceGroups from '../../../../blocks/detail/detail-version/variants/device-groups.vue'
import EnvironmentCrumb from '../../../../blocks/detail/detail-version/variants/environment-crumb.vue'
import Revert from '../../../../blocks/detail/detail-version/variants/revert.vue'
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
describe('detail-version#DeviceGroups', () => {
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

describe('detail/detail-version', () => {
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

describe('detail-version#EnvironmentCrumb', () => {
  it('names the environment and the version crumbs', async () => {
    render(inConsoleLayout(EnvironmentCrumb))
    const header = within(screen.getByTestId('console-layout__header'))
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

describe('detail-version#CacheSettings', () => {
  it('renders the cache settings panel inside the version page and opens a row in the drawer', async () => {
    const { default: CacheSettings } =
      await import('../../../../blocks/detail/detail-version/variants/cache-settings.vue')
    render(CacheSettings)
    expect(screen.getByTestId('version-detail-bar')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Add Cache Settings' })).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'static-assets' }))
    expect(await screen.findByRole('dialog', { name: 'Edit Cache Settings' })).toBeTruthy()
  })
})

describe('detail-version resource names', () => {
  it.each(['source', 'device-groups', 'cache-settings', 'functions-instances'])(
    'keeps the full name of every linked row in a title in %s',
    async (variant) => {
      const { default: Variant } = (await import(
        `../../../../blocks/detail/detail-version/variants/${variant}.vue`
      )) as { default: Component }
      const { container } = render(Variant)
      const links = Array.from(
        container.querySelectorAll<HTMLElement>('[role="cell"] [data-variant="link"]')
      )
      expect(links.length).toBeGreaterThan(0)
      for (const link of links) {
        expect(link.getAttribute('title')).toBe(link.textContent?.trim())
      }
    }
  )
})

describe('detail-version data', () => {
  const versions: VersionDetailVersion[] = [
    {
      id: 'B2DRAFT1',
      name: 'B2DRAFT1',
      state: 'draft',
      comment: 'Tune the cache',
      author: 'Jane Doe',
      createdAt: '2026-11-10T10:00:00Z'
    },
    {
      id: 'B1LIVE01',
      name: 'B1LIVE01',
      state: 'deployed',
      comment: 'Initial release',
      author: 'Alex Morgan',
      createdAt: '2026-11-08T12:00:00Z',
      createdOn: 'Nov 14, 2026'
    },
    {
      id: 'B0OLD001',
      name: 'B0OLD001',
      state: 'ready',
      comment: 'First import',
      author: 'Sam Lee',
      createdAt: '2026-11-03T12:00:00Z'
    }
  ]
  const settings = { name: 'acme-store', active: true, modules: { cache: true } }

  it('renders the versions it is given and emits save with the draft settings', async () => {
    const view = render(DetailVersion, { props: { versions, settings, historyOpen: true } })
    const history = view.getByTestId('version-detail-history')
    expect(history.textContent).toContain('B1LIVE01')
    expect(history.textContent).toContain('Initial release')
    expect(document.body.textContent).not.toContain('ADA8FMMR')
    expect((view.getByRole('textbox', { name: 'Name' }) as HTMLInputElement).value).toBe(
      'acme-store'
    )
    await fireEvent.click(view.getByRole('button', { name: 'Save and deploy' }))
    const [[event, payload]] = view.emitted('save') as [
      [MouseEvent, { action: string; settings: typeof settings }]
    ]
    expect(event).toBeInstanceOf(MouseEvent)
    expect(payload.action).toBe('deploy')
    expect(payload.settings.name).toBe('acme-store')
  })

  it('emits redeploy on a deployed version and revert after the confirmation', async () => {
    const deployed = render(DetailVersion, { props: { versions, versionId: 'B1LIVE01' } })
    await fireEvent.click(deployed.getByRole('button', { name: 'Redeploy' }))
    expect(deployed.emitted('redeploy')).toHaveLength(1)
    deployed.unmount()

    const earlier = render(DetailVersion, { props: { versions, versionId: 'B0OLD001' } })
    await fireEvent.click(earlier.getByRole('button', { name: 'Revert to B0OLD001' }))
    const dialog = await screen.findByRole('alertdialog', { name: 'Revert to B0OLD001?' })
    expect(dialog.textContent).toContain('What changes against B1LIVE01')
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Revert to B0OLD001' }))
    const [[, version]] = earlier.emitted('revert') as [[MouseEvent, VersionDetailVersion]]
    expect(version.id).toBe('B0OLD001')
  })

  it('keeps a space before every quoted name in the detail samples', () => {
    const samples = import.meta.glob<string>('../../../../blocks/detail/*/sample.ts', {
      query: '?raw',
      import: 'default',
      eager: true
    })
    expect(Object.keys(samples).length).toBeGreaterThan(3)
    for (const source of Object.values(samples)) expect(source).not.toMatch(/[A-Za-z]"[A-Z]/)
  })
})
