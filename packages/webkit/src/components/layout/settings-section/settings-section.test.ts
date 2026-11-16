import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import Collapsible from '../../../../examples/settings-section/collapsible.vue'
import Default from '../../../../examples/settings-section/default.vue'
import Stacked from '../../../../examples/settings-section/stacked.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import SettingsSection from './settings-section.vue'

describe('SettingsSection', () => {
  it('renders a section with the title as an h2 and the body', () => {
    const { getByTestId, getByRole } = within(
      render(SettingsSection, {
        props: { title: 'General' },
        slots: { default: '<p>Body</p>' }
      }).container as HTMLElement
    )

    expect(getByTestId('settings-section').tagName).toBe('SECTION')
    expect(getByRole('heading', { level: 2 }).textContent?.trim()).toBe('General')
    expect(getByTestId('settings-section__body').textContent?.trim()).toBe('Body')
  })

  it('honours a consumer data-testid', () => {
    const { getByTestId } = within(
      render(SettingsSection, {
        props: { title: 'General' },
        attrs: { 'data-testid': 'general-band' }
      }).container as HTMLElement
    )

    expect(getByTestId('general-band__title')).toBeTruthy()
  })

  it('renders the Hint only when hint is set', () => {
    const bare = within(
      render(SettingsSection, { props: { title: 'General' } }).container as HTMLElement
    )
    expect(bare.queryByTestId('hint')).toBeNull()

    const hinted = within(
      render(SettingsSection, { props: { title: 'General', hint: 'What this band holds.' } })
        .container as HTMLElement
    )
    expect(hinted.getByTestId('hint')).toBeTruthy()
  })

  it('renders the gutter copy-link and the h2 id only with an anchor', () => {
    const bare = within(
      render(SettingsSection, { props: { title: 'General' } }).container as HTMLElement
    )
    expect(bare.queryByTestId('settings-section__copy-link')).toBeNull()

    const anchored = within(
      render(SettingsSection, { props: { title: 'General', anchor: 'general' } })
        .container as HTMLElement
    )
    expect(anchored.getByRole('heading', { level: 2 }).id).toBe('general')
    expect(anchored.getByRole('button', { name: 'Copy link to the General section' })).toBeTruthy()
  })

  it('confirms a copied link on the button itself', async () => {
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    const view = within(
      render(SettingsSection, { props: { title: 'General', anchor: 'general' } })
        .container as HTMLElement
    )
    await fireEvent.click(view.getByRole('button', { name: 'Copy link to the General section' }))
    expect(write).toHaveBeenCalledWith(expect.stringMatching(/#general$/))
    await vi.waitFor(() => expect(view.getByRole('button', { name: 'Link copied' })).toBeTruthy())
    write.mockRestore()
  })

  it('keeps a non-collapsible body open and has no disclosure', () => {
    const { getByTestId, queryByTestId } = within(
      render(SettingsSection, { props: { title: 'General' } }).container as HTMLElement
    )

    expect(queryByTestId('settings-section__trigger')).toBeNull()
    expect(getByTestId('settings-section__body').getAttribute('data-state')).toBe('open')
    expect(getByTestId('settings-section__body').hasAttribute('inert')).toBe(false)
    expect(getByTestId('settings-section__body').hasAttribute('data-collapsible')).toBe(false)
  })

  it('toggles a collapsible band and emits update:open', async () => {
    const { container, emitted } = render(SettingsSection, {
      props: { title: 'Advanced', collapsible: true, icon: 'ai ai-settings' }
    })
    const scope = within(container as HTMLElement)
    const trigger = scope.getByTestId('settings-section__trigger')
    const body = scope.getByTestId('settings-section__body')

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-controls')).toBe(body.id)
    expect(body.hasAttribute('inert')).toBe(true)
    expect(body.getAttribute('aria-hidden')).toBe('true')
    expect(body.hasAttribute('data-collapsible')).toBe(true)

    await fireEvent.click(trigger)

    expect(emitted()['update:open']).toEqual([[true]])
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(body.hasAttribute('inert')).toBe(false)
    expect(scope.getByTestId('settings-section').getAttribute('data-state')).toBe('open')
  })

  it('renders the examples', async () => {
    expect(
      within(render(Default).container as HTMLElement).getAllByTestId('settings-row')
    ).toHaveLength(2)
    expect(
      within(render(Stacked).container as HTMLElement).getAllByTestId('settings-section')
    ).toHaveLength(2)

    const collapsible = within(render(Collapsible).container as HTMLElement)
    const trigger = collapsible.getByRole('button', { name: 'Advanced' })
    await fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  it('has no accessibility violations, open or folded', async () => {
    await expectNoA11yViolations(render(Default).container)
    await expectNoA11yViolations(render(Collapsible).container)
  })

  describe('on devices', () => {
    it('makes its body a named container for the rows inside', () => {
      const view = render(SettingsSection, {
        props: { title: 'Cache' },
        slots: { default: 'Rows' }
      })

      expect(view.getByText('Rows').className).toContain('@container/settings-section')
    })

    it('shows the copy-link inline where there is no hover', () => {
      const view = render(SettingsSection, { props: { title: 'Cache', anchor: 'cache' } })

      expect(view.getByTestId('settings-section__copy-link').className).toContain(
        '[@media(hover:none)]:opacity-100'
      )
    })
  })
})
