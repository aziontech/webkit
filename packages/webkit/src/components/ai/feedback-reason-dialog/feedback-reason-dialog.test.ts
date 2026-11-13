import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/feedback-reason-dialog/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import FeedbackReasonDialog, { type FeedbackReasonPayload } from './feedback-reason-dialog.vue'

afterEach(() => cleanup())

const dialog = () => document.body.querySelector<HTMLElement>('[role="dialog"]')

const Harness = defineComponent({
  props: { reasons: { type: Array, default: () => [] }, loading: Boolean },
  emits: ['sent'],
  setup(props, { emit }) {
    const open = ref(true)
    return () =>
      h(FeedbackReasonDialog, {
        open: open.value,
        'onUpdate:open': (value: boolean) => (open.value = value),
        reasons: props.reasons,
        loading: props.loading,
        onSubmit: (event: Event, payload: FeedbackReasonPayload) => emit('sent', event, payload)
      })
  }
})

describe('FeedbackReasonDialog', () => {
  it('offers the catalog reasons in a named group inside a named dialog', async () => {
    render(Harness)
    await waitFor(() => expect(dialog()).toHaveAccessibleName('What went wrong?'))
    expect(dialog()).toHaveAccessibleDescription('Your answer helps improve future responses.')
    const group = dialog()!.querySelector('fieldset')!
    expect(group).toHaveAccessibleName('Reason')
    const radios = [...group.querySelectorAll('input[type="radio"]')]
    expect(
      radios.map(
        (radio) =>
          radio.getAttribute('aria-label') ??
          (radio as HTMLInputElement).labels?.[0]?.textContent?.trim()
      )
    ).toEqual([
      'Inaccurate or made up',
      'Not helpful',
      'Did not follow my request',
      'Unsafe or harmful',
      'Other'
    ])
    await expectNoA11yViolations(dialog()!)
  })

  it('requires a reason: shows the error, focuses the first radio, sends nothing', async () => {
    const view = render(Harness)
    await waitFor(() => expect(dialog()).toBeTruthy())
    await fireEvent.click(view.getByRole('button', { name: 'Send feedback' }))
    await nextTick()
    expect(view.getByText('Choose a reason.')).toBeTruthy()
    const group = dialog()!.querySelector('fieldset')!
    expect(group).toHaveAccessibleDescription('Choose a reason.')
    await waitFor(() =>
      expect(document.activeElement).toBe(group.querySelector('input[type="radio"]'))
    )
    expect(view.emitted('sent')).toBeUndefined()
  })

  it('emits the chosen reason with trimmed details', async () => {
    const view = render(Harness, {
      props: {
        reasons: [
          { value: 'slow', label: 'Too slow' },
          { value: 'other', label: 'Other' }
        ]
      }
    })
    await waitFor(() => expect(dialog()).toBeTruthy())
    await fireEvent.click(view.getByLabelText('Too slow'))
    const details = view.getByLabelText('Details (optional)')
    await userEvent.fill(details, '  It took a minute.  ')
    await fireEvent.click(view.getByRole('button', { name: 'Send feedback' }))
    const [event, payload] = view.emitted('sent')![0] as [Event, FeedbackReasonPayload]
    expect(event).toBeInstanceOf(SubmitEvent)
    expect(payload).toEqual({ reason: 'slow', details: 'It took a minute.' })
  })

  it('locks the form while loading', async () => {
    const view = render(Harness, { props: { loading: true } })
    await waitFor(() => expect(dialog()).toBeTruthy())
    expect(view.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    for (const radio of dialog()!.querySelectorAll('input[type="radio"]'))
      expect(radio).toBeDisabled()
    expect(dialog()!.querySelector('textarea')).toBeDisabled()
  })

  it('reads its strings from the locale catalog', async () => {
    render(WebkitProvider, {
      props: { locale: 'pt-BR', catalogs: LOCALES },
      slots: { default: () => h(Harness) }
    })
    await waitFor(() => expect(dialog()).toHaveAccessibleName('O que deu errado?'))
  })

  it('opens from a thumbs-down in the example and closes after sending', async () => {
    const view = render(Default)
    await fireEvent.click(view.getByRole('button', { name: 'Not helpful' }))
    await waitFor(() => expect(dialog()).toBeTruthy())
    await fireEvent.click(view.getByLabelText('Not helpful', { selector: 'input' }))
    await fireEvent.click(view.getByRole('button', { name: 'Send feedback' }))
    await waitFor(() => expect(dialog()).toBeNull(), { timeout: 2000 })
  })
})
