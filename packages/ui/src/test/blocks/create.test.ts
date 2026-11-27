import '../reflow.css'

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'

import CreateDeployDrawer from '../../../blocks/create/create-deploy-drawer/create-deploy-drawer.vue'
import CreateDeployDrawerBuilding from '../../../blocks/create/create-deploy-drawer/variants/building.vue'
import CreateDeployDrawerDependencies from '../../../blocks/create/create-deploy-drawer/variants/dependencies.vue'
import CreateDrawerItemRows from '../../../blocks/create/create-drawer/variants/item-rows.vue'
import CreateHub from '../../../blocks/create/create-hub/create-hub.vue'
import CreateHubConnectError from '../../../blocks/create/create-hub/variants/connect-error.vue'
import CreateOrganization from '../../../blocks/create/create-page/variants/create-organization.vue'
import CreateService from '../../../blocks/create/create-page/variants/create-service.vue'
import { useToastRegion } from '../toast-region'

useToastRegion()

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const atWidth = async (width: number): Promise<void> => {
  await page.viewport(width, 900)
  await vi.waitFor(() => expect(window.innerWidth).toBe(width))
  await frame()
}

const headingStart = (name: string): number => {
  const heading = screen.getByRole('heading', { name })
  const range = document.createRange()
  range.selectNodeContents(heading)
  return range.getBoundingClientRect().left
}

afterEach(async () => {
  cleanup()
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  await page.viewport(1280, 900)
})

describe('create blocks, styled', () => {
  it('starts the hub section headings on the content edge, like a SettingsGroup label', async () => {
    await atWidth(390)
    render(CreateHub)
    const content = screen.getByRole('heading', { name: 'Import from GitHub' }).closest('section')!
    const edge = content.getBoundingClientRect().left
    expect(Math.abs(headingStart('Import from GitHub') - edge)).toBeLessThan(1)
    expect(Math.abs(headingStart('Start from template') - edge)).toBeLessThan(1)
  })

  it('starts the Create Service group headings on the edge of their cards', async () => {
    await atWidth(390)
    render(CreateService)
    for (const name of ['General', 'Delivery settings']) {
      const section = screen.getByRole('heading', { name }).closest('section')!
      const card = section.querySelector('[data-testid="card"]')!
      expect(Math.abs(headingStart(name) - card.getBoundingClientRect().left)).toBeLessThan(1)
    }
  })

  it('gives the GitHub connect error more room than the button above it', async () => {
    await atWidth(1280)
    const view = render(CreateHubConnectError)
    const error = view.getByTestId('create-hub__connect-error')
    const button = view.getByRole('button', { name: 'Continue with GitHub' })
    expect(error.getBoundingClientRect().width).toBeGreaterThan(
      button.getBoundingClientRect().width + 80
    )
  })

  it('lays the organization marks out three per row on a phone and six in one row on a wide screen', async () => {
    const rows = () => {
      const marks = screen.getByTestId('create-organization__marks')
      const tops = [...marks.querySelectorAll('input[type="radio"]')].map(
        (input) => input.closest('label')!.getBoundingClientRect().top
      )
      return new Set(tops.map((top) => Math.round(top))).size
    }
    await atWidth(390)
    render(CreateOrganization)
    expect(rows()).toBe(2)
    cleanup()
    await atWidth(1280)
    render(CreateOrganization)
    expect(rows()).toBe(1)
    expect(getComputedStyle(screen.getByText('In the header')).textTransform).toBe('none')
  })

  it('pads the deploy drawer resource rows inside their card', async () => {
    await atWidth(390)
    render(CreateDeployDrawer)
    await fireEvent.click(screen.getByRole('button', { name: 'Deploy' }))
    const dialog = await screen.findByRole('dialog')
    const row = await waitFor(() => within(dialog).getAllByTestId('deploy-resources-card__row')[0]!)
    const card = row.closest('[data-testid="card"]')!
    const media = row.querySelector('[data-slot="item-media"]')!.getBoundingClientRect()
    expect(media.left - card.getBoundingClientRect().left).toBeGreaterThan(8)
  })

  it('keeps the building time on one line with room before the spinner', async () => {
    await atWidth(390)
    render(CreateDeployDrawerBuilding)
    await fireEvent.click(screen.getByRole('button', { name: 'Deploy' }))
    const dialog = await screen.findByRole('dialog')
    const elapsed = await waitFor(() => within(dialog).getByTestId('build-item__elapsed'))
    const range = document.createRange()
    range.selectNodeContents(elapsed)
    expect(range.getClientRects()).toHaveLength(1)
  })

  it('keeps a disabled Deploy on the end edge, with its reason before it', async () => {
    await atWidth(1280)
    render(CreateDeployDrawerDependencies)
    await fireEvent.click(screen.getByRole('button', { name: 'Deploy' }))
    const dialog = await screen.findByRole('dialog')
    const deploy = within(dialog).getByTestId('create-deploy-drawer__deploy')
    expect((deploy as HTMLButtonElement).disabled).toBe(true)
    const row = deploy.parentElement!
    expect(
      Math.abs(row.getBoundingClientRect().right - deploy.getBoundingClientRect().right)
    ).toBeLessThan(2)
  })

  it('ends the Add Origin drawer on an end-aligned button, not a full-width bar, on a phone', async () => {
    await atWidth(390)
    render(CreateDrawerItemRows)
    await fireEvent.click(screen.getByRole('button', { name: 'Add Origin' }))
    const dialog = await screen.findByRole('dialog')
    const submit = [...dialog.querySelectorAll<HTMLButtonElement>('button[type="submit"]')].at(-1)!
    const footer = submit.parentElement!
    expect(submit.getBoundingClientRect().width).toBeLessThan(
      footer.getBoundingClientRect().width * 0.75
    )
    expect(
      Math.abs(footer.getBoundingClientRect().right - submit.getBoundingClientRect().right)
    ).toBeLessThan(2)
  })
})
