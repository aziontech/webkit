import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import WafTuning from '../../../../blocks/view/waf-tuning/waf-tuning.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

describe('view/waf-tuning block', () => {
  it('says No matching rules with Clear search for a search miss', async () => {
    const view = render(WafTuning)
    await fireEvent.update(
      view.getByRole('textbox', { name: 'Search matched requests' }),
      'kubernetes'
    )
    await waitFor(() => expect(view.getByText('No matching rules')).toBeTruthy())
    expect(view.queryByText('No rule reaches the minimum')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Clear search' }))
    await waitFor(() => expect(view.queryByText('No matching rules')).toBeNull())
  })

  it('reads Allow selected while nothing is checked', () => {
    const view = render(WafTuning)
    const allow = view.getByRole('button', { name: 'Allow selected' })
    expect(allow.hasAttribute('disabled')).toBe(true)
  })

  it('shows a danger alert when the matches fail to load and Retry emits retry', async () => {
    const view = render(WafTuning, {
      props: { error: "Couldn't load the matched requests. Check your connection and retry." }
    })
    expect(view.container.textContent).toContain("Couldn't load the matched requests.")
    expect(view.queryByText('SQL injection')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    const [event] = view.emitted('retry')![0] as [MouseEvent]
    expect(event).toBeInstanceOf(MouseEvent)
  })

  it('renders the matches it is given instead of the sample, and No matches yet for none', async () => {
    const view = render(WafTuning, {
      props: {
        matches: [
          {
            ruleId: '2001',
            threat: 'Path traversal',
            hits: 512,
            ips: ['192.0.2.9'],
            countries: ['United States'],
            paths: ['/files']
          }
        ]
      }
    })
    expect(view.getByText('Path traversal')).toBeTruthy()
    expect(view.queryByText('SQL injection')).toBeNull()
    await view.rerender({ matches: [] })
    expect(view.getByText('No matches yet')).toBeTruthy()
  })

  it('emits refresh from the Refresh button', async () => {
    const view = render(WafTuning)
    await fireEvent.click(view.getByRole('button', { name: 'Refresh matched requests' }))
    const [event] = view.emitted('refresh')![0] as [MouseEvent]
    expect(event).toBeInstanceOf(MouseEvent)
  })

  it('emits allow with the checked rules and the reason, then closes when allowing ends', async () => {
    const view = render(WafTuning, {
      props: { defaultSelection: ['1005', '1201'], defaultOpen: true }
    })
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement
    await fireEvent.update(dialog.querySelector('textarea')!, 'Search accepts quotes.')
    const submit = Array.from(dialog.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Allow rules'
    ) as HTMLButtonElement
    await fireEvent.click(submit)
    const [event, payload] = view.emitted('allow')![0] as [
      Event,
      { matches: { ruleId: string }[]; reason: string }
    ]
    expect(event).toBeInstanceOf(Event)
    expect(payload.matches.map((match) => match.ruleId).sort()).toEqual(['1005', '1201'])
    expect(payload.reason).toBe('Search accepts quotes.')
    await view.rerender({ allowing: true })
    await view.rerender({ allowing: false })
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull(), {
      timeout: 3000
    })
    await waitFor(() => expect(document.body.textContent).toContain('6 allowed rules created.'))
  })
})
