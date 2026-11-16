import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { type Component, defineComponent, h } from 'vue'

import DetailsPage from '../../../../blocks/detail/resource-detail/resource-detail.vue'
import Application from '../../../../blocks/detail/resource-detail/variants/application.vue'
import ApplicationBuild from '../../../../blocks/detail/resource-detail/variants/application-build.vue'
import Service from '../../../../blocks/detail/resource-detail/variants/service.vue'
import ConsoleLayout from '../../../components/layout/console-layout/console-layout.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const wait = { timeout: 4000 }

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
describe('resource-detail#ApplicationBuild', () => {
  it('raises the drop target while files hover and opens the deploy drawer on drop', async () => {
    const { container } = render(ApplicationBuild)
    const root = container.firstElementChild as HTMLElement
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(new File(['x'], 'site.zip'))
    root.dispatchEvent(
      new DragEvent('dragenter', { dataTransfer, bubbles: true, cancelable: true })
    )
    expect(await screen.findByText('Drop your project to deploy it')).toBeTruthy()
    root.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }))
    const drawer = await screen.findByRole('dialog', { name: 'Deploy storefront-app' })
    expect(drawer.textContent).toContain('site.zip')
  })
})

describe('detail/resource-detail', () => {
  it('gives Visit the live address and links the tabs that live on another route', async () => {
    const view = render(DetailsPage)
    const visit = view.getByRole('link', { name: /Visit/ })
    expect(visit.getAttribute('href')).toBe('https://analytics-app-z1x2c3.example.com')
    expect(view.getByRole('link', { name: '1213275262' }).getAttribute('href')).toBe(
      '/deployments/1213275262'
    )
    await fireEvent.click(view.getByRole('tab', { name: 'Versions' }))
    const open = await waitFor(() => view.getByRole('link', { name: 'Open Versions' }))
    expect(open.getAttribute('href')).toBe('/resources/analytics-app/versions')
  })

  it('renders the resource it is given, follows the tab model and emits its actions', async () => {
    const view = render(DetailsPage, {
      props: {
        tab: 'overview',
        resource: {
          name: 'acme-store',
          domain: 'store.example.com',
          deploymentId: '4410022',
          environment: 'Staging',
          status: 'Building',
          statusSeverity: 'info',
          createdAt: new Date(Date.UTC(2026, 10, 1)),
          createdBy: 'Jane Doe',
          framework: 'Astro',
          frameworkIcon: 'ai-color ai-astro'
        }
      }
    })
    expect(view.getByRole('link', { name: /Visit/ }).getAttribute('href')).toBe(
      'https://store.example.com'
    )
    expect(view.getByRole('link', { name: '4410022' }).getAttribute('href')).toBe(
      '/deployments/4410022'
    )
    expect(view.container.textContent).toContain('Astro')
    expect(view.container.textContent).toContain('by Jane Doe')
    expect(view.container.textContent).not.toContain('analytics-app')
    await fireEvent.click(view.getByRole('button', { name: 'Connect Git repository' }))
    const connect = view.emitted('connect-repository') as [MouseEvent][]
    expect(connect).toHaveLength(1)
    expect(connect[0][0]).toBeInstanceOf(MouseEvent)
    await fireEvent.click(view.getByRole('tab', { name: 'Build' }))
    expect(view.emitted('update:tab')).toEqual([['build']])
    await view.rerender({ tab: 'build' })
    const open = await waitFor(() => view.getByRole('link', { name: 'Open Build' }))
    expect(open.getAttribute('href')).toBe('/resources/acme-store/build')
  })

  it('adds a custom domain from an IconButton', () => {
    const view = render(Service)
    expect(view.getByRole('button', { name: 'Add a custom domain' })).toBeTruthy()
  })
})

describe('resource-detail#Application', () => {
  it('switches to the Topology tab and draws the diagram without axe findings', async () => {
    render(inConsoleLayout(Application))
    await fireEvent.click(screen.getByRole('tab', { name: 'Topology' }))
    expect(await screen.findByRole('heading', { name: 'Deployment topology' })).toBeTruthy()
    expect(screen.getByText('shop.example.com')).toBeTruthy()
    expect(screen.getByText('edge-guard')).toBeTruthy()
    await expectNoA11yViolations(document.body)
  })

  it('deploys from the drawer and reports with Edit and Redeploy', async () => {
    render(Application)
    await fireEvent.click(screen.getByRole('button', { name: 'Deploy' }))
    const drawer = await screen.findByRole('dialog', { name: 'Deploy storefront-app' })
    expect(within(drawer).getByText(/No topology change is staged/)).toBeTruthy()
    await fireEvent.click(within(drawer).getByRole('button', { name: 'Deploy' }))
    await waitFor(() => expect(screen.getByText('storefront-app is live.')).toBeTruthy(), wait)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Redeploy' })).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByRole('tab', { name: 'Topology' }).getAttribute('aria-selected')).toBe('true')
  })
})
