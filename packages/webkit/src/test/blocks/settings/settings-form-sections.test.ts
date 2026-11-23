import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DeploymentProtectionCard from '../../../../blocks/settings/settings-form/parts/deployment-protection-card.vue'
import GeneralGroupCard from '../../../../blocks/settings/settings-form/parts/general-group-card.vue'
import NotificationsGroupCard from '../../../../blocks/settings/settings-form/parts/notifications-group-card.vue'
import PreviewToolbarCard from '../../../../blocks/settings/settings-form/parts/preview-toolbar-card.vue'
import SavePerCard from '../../../../blocks/settings/settings-form/variants/save-per-card.vue'
import SavePerGroup from '../../../../blocks/settings/settings-form/variants/save-per-group.vue'
import SavingOneCard from '../../../../blocks/settings/settings-form/variants/saving-one-card.vue'
import SavingOneGroup from '../../../../blocks/settings/settings-form/variants/saving-one-group.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const blockFiles = import.meta.glob('../../../../blocks/settings/settings-form/**/*.{vue,ts}', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

const toastText = () => document.body.textContent ?? ''
const retryButton = () =>
  Array.from(document.body.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === 'Retry'
  ) as HTMLButtonElement | undefined

describe('settings/settings-form · save per group and per card', () => {
  it('never fakes a save with a timer', () => {
    expect(Object.keys(blockFiles).length).toBeGreaterThan(10)
    for (const [path, source] of Object.entries(blockFiles))
      expect(source, path).not.toMatch(/setTimeout|setInterval/)
  })

  it.each([SavePerGroup, SavePerCard])(
    'opens with every Save disabled until its card changes',
    (Variant) => {
      const view = render(Variant)
      const saves = view.getAllByRole('button', { name: 'Save' }) as HTMLButtonElement[]
      expect(saves).toHaveLength(2)
      for (const save of saves) expect(save.disabled).toBe(true)
    }
  )

  it('enables only the edited group, emits its values, and confirms once loading ends', async () => {
    const view = render(SavePerGroup)
    const [general, notifications] = view.getAllByRole('form')
    await fireEvent.click(within(notifications).getByRole('switch', { name: 'Security alerts' }))
    const save = within(notifications).getByRole('button', { name: 'Save' }) as HTMLButtonElement
    await waitFor(() => expect(save.disabled).toBe(false))
    expect(
      (within(general).getByRole('button', { name: 'Save' }) as HTMLButtonElement).disabled
    ).toBe(true)
    await fireEvent.click(save)
    const [event, payload] = view.emitted<unknown[]>('submit')?.[0] ?? []
    expect(event).toBeInstanceOf(Event)
    expect(payload).toEqual({
      group: 'notifications',
      values: { productUpdates: true, securityAlerts: false }
    })
    expect(toastText()).not.toContain('Notification settings saved.')
  })

  it('shows success only when loading falls without an error, then the card is clean', async () => {
    const view = render(NotificationsGroupCard, {
      props: { defaultDraft: { productUpdates: false } }
    })
    const save = view.getByRole('button', { name: 'Save' }) as HTMLButtonElement
    expect(save.disabled).toBe(false)
    await fireEvent.click(save)
    expect(view.emitted('submit')).toHaveLength(1)
    await view.rerender({ loading: true })
    expect(view.getByRole('switch', { name: 'Product updates' })).toBeDisabled()
    await view.rerender({ loading: false })
    await waitFor(() => expect(toastText()).toContain('Notification settings saved.'))
    await waitFor(() => expect(save.disabled).toBe(true))
  })

  it('keeps the edits and offers Retry in an error toast when the save fails', async () => {
    const view = render(PreviewToolbarCard, { props: { defaultDraft: { prod: 'enabled' } } })
    await fireEvent.click(view.getByRole('button', { name: 'Save' }))
    await view.rerender({ loading: true })
    await view.rerender({ loading: false, error: "The request didn't reach the server." })
    await waitFor(() =>
      expect(toastText()).toContain("The Preview Toolbar settings weren't saved.")
    )
    expect(toastText()).not.toContain('Preview Toolbar saved.')
    expect((view.getByRole('button', { name: 'Save' }) as HTMLButtonElement).disabled).toBe(false)
    await fireEvent.click(retryButton() as HTMLButtonElement)
    expect(view.emitted<unknown[]>('submit')?.[1]?.[1]).toEqual({
      preprod: 'default',
      prod: 'enabled'
    })
  })

  it('validates General before it emits', async () => {
    const view = render(GeneralGroupCard)
    await fireEvent.update(view.getByLabelText('Full name'), '')
    await fireEvent.click(view.getByRole('button', { name: 'Save' }))
    expect(view.emitted('submit')).toBeUndefined()
    expect(view.getByText('This field is required.')).toBeTruthy()
  })

  it('locks only the saving card and keeps the other editable', () => {
    const card = render(SavingOneCard)
    const [toolbar, protection] = card.getAllByRole('form')
    expect(within(toolbar).getByRole('button', { name: 'Save' }).getAttribute('aria-busy')).toBe(
      'true'
    )
    expect(within(protection).getByRole('switch')).toBeEnabled()
    card.unmount()
    const group = render(SavingOneGroup)
    const [general, notifications] = group.getAllByRole('form')
    expect(within(general).getByRole('button', { name: 'Save' }).getAttribute('aria-busy')).toBe(
      'true'
    )
    expect(within(notifications).getByRole('switch', { name: 'Product updates' })).toBeEnabled()
  })

  it('asks the browser to confirm leaving while a card is dirty', async () => {
    const view = render(DeploymentProtectionCard)
    const clean = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(clean)
    expect(clean.defaultPrevented).toBe(false)
    await fireEvent.click(view.getByRole('switch'))
    const dirty = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(dirty)
    expect(dirty.defaultPrevented).toBe(true)
  })
})
