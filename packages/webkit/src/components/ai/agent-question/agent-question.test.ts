import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import AgentQuestion from './agent-question.vue'

const options = [
  { value: 'staging', label: 'Staging' },
  { value: 'production', label: 'Production', description: 'Serves live traffic.' }
]
const base = {
  title: 'Which environment should `waf-rules` go to?',
  description: 'The rule set exists in both workloads.',
  options
}
const titleName = 'Which environment should waf-rules go to?'
const isolate = (text: string) => `\u2068${text}\u2069`

describe('AgentQuestion', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(AgentQuestion, { props: base }).getByTestId('agent-question')).toBeTruthy()
    expect(
      render(AgentQuestion, { props: base, attrs: { 'data-testid': 'mine' } }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('is a group named by its question and described by its description', () => {
    const { getByRole, getByTestId, getByText } = render(AgentQuestion, {
      props: { ...base, title: 'Use `<b>x</b>`?' }
    })
    const group = getByRole('group', { name: 'Use <b>x</b>?' })
    expect(group).toHaveAccessibleDescription('The rule set exists in both workloads.')
    const title = getByTestId('agent-question__title')
    expect(title.querySelector('code')).toHaveTextContent('<b>x</b>')
    expect(title.querySelector('b')).toBeNull()
    expect(getByText('The rule set exists in both workloads.')).toBeTruthy()
  })

  it.each(['choice', 'text', 'confirm'] as const)('mirrors type %s on data-type', (type) => {
    const { getByTestId } = render(AgentQuestion, { props: { ...base, type } })
    expect(getByTestId('agent-question')).toHaveAttribute('data-type', type)
    expect(getByTestId('agent-question')).toHaveAttribute('data-status', 'pending')
  })

  it.each(['pending', 'running', 'success', 'error', 'canceled', 'skipped'] as const)(
    'mirrors status %s on data-status',
    (status) => {
      const { getByTestId } = render(AgentQuestion, { props: { ...base, status } })
      expect(getByTestId('agent-question')).toHaveAttribute('data-status', status)
    }
  )

  it('renders each option label in a bdi, keeping its description', () => {
    const { getByRole, getByText } = render(AgentQuestion, { props: base })
    const label = getByRole('radio', { name: 'Production' }).closest('label')!
    expect(label.querySelector('bdi')).toHaveTextContent('Production')
    expect(getByText('Serves live traffic.')).toBeTruthy()
    expect(getByRole('radio', { name: 'Production' })).toHaveAccessibleDescription(
      'Serves live traffic.'
    )
  })

  it('submits the picked option with the event, keeping Submit disabled until one is picked', async () => {
    const { getByRole, emitted } = render(AgentQuestion, { props: base })
    expect(document.activeElement).toBe(document.body)
    const submit = getByRole('button', { name: 'Submit' })
    expect(submit).toBeDisabled()
    expect(getByRole('radiogroup', { name: titleName })).toBeTruthy()
    await userEvent.click(getByRole('radio', { name: 'Production' }))
    expect(emitted<string[]>('update:modelValue')!.at(-1)).toEqual(['production'])
    expect(submit).not.toBeDisabled()
    await userEvent.click(submit)
    const [event, value] = emitted<unknown[]>('submit')![0]!
    expect(event).toBeInstanceOf(Event)
    expect(value).toBe('production')
  })

  it('submits with Enter on a radio, and Space on a radio only selects', async () => {
    const { getByRole, emitted } = render(AgentQuestion, { props: base })
    getByRole('radio', { name: 'Staging' }).focus()
    await userEvent.keyboard(' ')
    expect(getByRole('radio', { name: 'Staging' })).toBeChecked()
    expect(emitted('submit')).toBeUndefined()
    await userEvent.keyboard('{Enter}')
    expect(emitted<unknown[]>('submit')).toHaveLength(1)
    expect(emitted<unknown[]>('submit')![0]![1]).toBe('staging')
  })

  it('submits typed text with Enter in the field', async () => {
    const { getByRole, emitted } = render(AgentQuestion, {
      props: { title: 'Which domain should I use?', type: 'text', placeholder: 'example.com' }
    })
    const field = getByRole('textbox', { name: 'Which domain should I use?' })
    expect(field).toHaveAttribute('placeholder', 'example.com')
    expect(field).toHaveAttribute('dir', 'auto')
    expect(getByRole('button', { name: 'Submit' })).toBeDisabled()
    await userEvent.type(field, 'shop.example.com{Enter}')
    const [event, value] = emitted<unknown[]>('submit')![0]!
    expect(event).toBeInstanceOf(Event)
    expect(value).toBe('shop.example.com')
  })

  it('does not submit a blank answer', async () => {
    const { getByRole, emitted } = render(AgentQuestion, {
      props: { title: 'Which domain?', type: 'text' }
    })
    await userEvent.type(getByRole('textbox'), '   {Enter}')
    expect(getByRole('button', { name: 'Submit' })).toBeDisabled()
    expect(emitted('submit')).toBeUndefined()
  })

  it('uses the submit label', () => {
    const { getByRole } = render(AgentQuestion, {
      props: { title: 'Which domain?', type: 'text', submitLabel: 'Use this domain' }
    })
    expect(getByRole('button', { name: 'Use this domain' })).toHaveAttribute('type', 'submit')
  })

  it('answers a confirm question with No or Yes, as buttons that do not submit the form', async () => {
    const { getByRole, emitted, queryByRole } = render(AgentQuestion, {
      props: { title: 'Keep the old cache rules?', type: 'confirm', declineLabel: 'Remove them' }
    })
    expect(queryByRole('button', { name: 'Submit' })).toBeNull()
    expect(getByRole('button', { name: 'Remove them' })).toHaveAttribute('type', 'button')
    await userEvent.click(getByRole('button', { name: 'Remove them' }))
    await userEvent.click(getByRole('button', { name: 'Yes' }))
    const submits = emitted<unknown[]>('submit')!
    expect(submits[0]![0]).toBeInstanceOf(MouseEvent)
    expect(submits.map((args) => args[1])).toEqual(['no', 'yes'])
    expect(emitted<string[]>('update:modelValue')!.map((args) => args[0])).toEqual(['no', 'yes'])
  })

  it('offers Skip only when skippable and emits it with the event', async () => {
    expect(
      render(AgentQuestion, { props: base }).queryByRole('button', { name: 'Skip' })
    ).toBeNull()
    const { getByRole, emitted } = render(AgentQuestion, {
      props: { ...base, skippable: true, skipLabel: 'Not now' }
    })
    const skip = getByRole('button', { name: 'Not now' })
    expect(skip).toHaveAttribute('type', 'button')
    await userEvent.click(skip)
    expect(emitted<unknown[]>('skip')![0]![0]).toBeInstanceOf(MouseEvent)
    expect(emitted('submit')).toBeUndefined()
  })

  it('is busy and emits nothing while running', async () => {
    const { getByRole, getByTestId, emitted } = render(AgentQuestion, {
      props: { ...base, status: 'running', modelValue: 'staging', skippable: true }
    })
    expect(getByTestId('agent-question')).toHaveAttribute('aria-busy', 'true')
    const submit = getByTestId('agent-question__submit')
    expect(submit).toHaveAttribute('aria-busy', 'true')
    expect(submit).toHaveAttribute('aria-disabled', 'true')
    expect(submit.hasAttribute('disabled')).toBe(false)
    expect(getByRole('radio', { name: 'Staging' })).toBeDisabled()
    await userEvent.click(getByRole('button', { name: 'Skip' }))
    await userEvent.click(submit)
    expect(emitted('skip')).toBeUndefined()
    expect(emitted('submit')).toBeUndefined()
  })

  it('puts the pressed confirm button in its loading state while running', () => {
    const { getByTestId } = render(AgentQuestion, {
      props: { title: 'Keep it?', type: 'confirm', status: 'running', modelValue: 'no' }
    })
    expect(getByTestId('agent-question__decline')).toHaveAttribute('aria-busy', 'true')
    expect(getByTestId('agent-question__submit')).toBeDisabled()
  })

  it('is not busy outside running', () => {
    const { getByTestId } = render(AgentQuestion, { props: base })
    expect(getByTestId('agent-question')).not.toHaveAttribute('aria-busy')
  })

  it('shows the error line on a text question, marks the field invalid, and lets the reader retry', async () => {
    const { getByRole, getByTestId, emitted, rerender } = render(AgentQuestion, {
      props: { title: 'Which domain?', type: 'text', status: 'error', modelValue: 'shop' }
    })
    const field = getByRole('textbox')
    const line = getByTestId('agent-question__error')
    expect(line).toHaveTextContent('The answer could not be sent. Try again.')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field.getAttribute('aria-describedby')).toContain(line.id)
    await rerender({ error: 'Enter a domain such as example.com.' })
    expect(getByTestId('agent-question__error')).toHaveTextContent(
      'Enter a domain such as example.com.'
    )
    expect(getByTestId('agent-question__announcer')).toHaveTextContent(
      'Enter a domain such as example.com.'
    )
    await userEvent.click(getByRole('button', { name: 'Submit' }))
    expect(emitted<unknown[]>('submit')![0]![1]).toBe('shop')
  })

  it('marks the radio group invalid and described by the error line on a choice question', () => {
    const { getByRole, getByTestId } = render(AgentQuestion, {
      props: { ...base, status: 'error', error: 'Pick one environment.' }
    })
    const group = getByRole('radiogroup')
    expect(group).toHaveAttribute('aria-invalid', 'true')
    expect(group.getAttribute('aria-describedby')).toContain(
      getByTestId('agent-question__error').id
    )
  })

  it('describes the card by the error line on a confirm question, without marking the buttons invalid', () => {
    const { getByTestId, getByRole } = render(AgentQuestion, {
      props: { ...base, type: 'confirm', status: 'error' }
    })
    const ids = getByTestId('agent-question').getAttribute('aria-describedby')!.split(' ')
    expect(ids).toContain(getByTestId('agent-question__error').id)
    expect(ids).toHaveLength(2)
    expect(getByRole('button', { name: 'Yes' })).not.toHaveAttribute('aria-invalid')
    expect(getByRole('button', { name: 'No' })).not.toHaveAttribute('aria-invalid')
  })

  it('shows no error line outside the error status', () => {
    const { queryByTestId, getByTestId } = render(AgentQuestion, {
      props: { ...base, error: 'Pick one.' }
    })
    expect(queryByTestId('agent-question__error')).toBeNull()
    expect(getByTestId('agent-question').getAttribute('aria-describedby')!.split(' ')).toHaveLength(
      1
    )
  })

  it.each([
    ['success', `Answered: ${isolate('Production')}`],
    ['skipped', 'Skipped'],
    ['canceled', 'Question canceled']
  ] as const)('replaces the controls with the %s outcome in text', async (status, text) => {
    const { queryByRole, getByTestId, rerender } = render(AgentQuestion, {
      props: { ...base, modelValue: 'production' }
    })
    await rerender({ status })
    expect(queryByRole('button')).toBeNull()
    expect(queryByRole('radio')).toBeNull()
    expect(getByTestId('agent-question__outcome')).toHaveTextContent(text)
    expect(getByTestId('agent-question__announcer')).toHaveTextContent(text)
  })

  it('isolates the answer in the receipt and keeps the catalog string free of isolates', () => {
    const { getByTestId } = render(AgentQuestion, {
      props: { ...base, status: 'success', modelValue: 'staging' }
    })
    const text = getByTestId('agent-question__announcer').textContent!.trim()
    expect(text).toBe('Answered: \u2068Staging\u2069')
    expect(text.indexOf('\u2068')).toBe('Answered: '.length)
  })

  it('shows the raw value when the answer matches no option', () => {
    const { getByTestId } = render(AgentQuestion, {
      props: { ...base, status: 'success', modelValue: 'qa' }
    })
    expect(getByTestId('agent-question__outcome')).toHaveTextContent(`Answered: ${isolate('qa')}`)
  })

  it('shows the typed text, the confirm label, or no answer in the receipt', () => {
    const typed = render(AgentQuestion, {
      props: { title: 'Which domain?', type: 'text', status: 'success', modelValue: 'example.com' }
    })
    expect(typed.getByTestId('agent-question__outcome')).toHaveTextContent(
      `Answered: ${isolate('example.com')}`
    )
    typed.unmount()
    const confirm = render(AgentQuestion, {
      props: {
        title: 'Keep it?',
        type: 'confirm',
        status: 'success',
        modelValue: 'no',
        declineLabel: 'Remove them'
      }
    })
    expect(confirm.getByTestId('agent-question__outcome')).toHaveTextContent(
      `Answered: ${isolate('Remove them')}`
    )
    confirm.unmount()
    const empty = render(AgentQuestion, { props: { ...base, status: 'success' } })
    expect(empty.getByTestId('agent-question__announcer').textContent!.trim()).toBe('Answered')
  })

  it('round-trips v-model in a parent', async () => {
    const answer = ref('')
    const Host = defineComponent({
      setup: () => () =>
        h(AgentQuestion, {
          ...base,
          modelValue: answer.value,
          'onUpdate:modelValue': (value: string) => (answer.value = value)
        })
    })
    const { getByRole } = render(Host)
    await userEvent.click(getByRole('radio', { name: 'Staging' }))
    expect(answer.value).toBe('staging')
    answer.value = 'production'
    await nextTick()
    expect(getByRole('radio', { name: 'Production' })).toBeChecked()
  })

  it('keeps the answer when the status goes from error back to pending', async () => {
    const { getByRole, rerender } = render(AgentQuestion, {
      props: { title: 'Which domain?', type: 'text', status: 'error', modelValue: 'shop' }
    })
    await rerender({ status: 'pending' })
    expect(getByRole('textbox')).toHaveValue('shop')
  })

  it('moves focus to its heading through focus(), out of the Tab order', async () => {
    const view = render(AgentQuestion, { props: base })
    const heading = view.getByTestId('agent-question__title')
    expect(heading).toHaveAttribute('tabindex', '-1')
    view.unmount()
    const Host = defineComponent({
      setup() {
        const card = ref<{ focus: () => void } | null>(null)
        return () =>
          h('div', [
            h(AgentQuestion, { ...base, ref: card, 'data-testid': 'exposed' }),
            h('button', { type: 'button', onClick: () => card.value?.focus() }, 'Bring')
          ])
      }
    })
    const host = render(Host)
    await userEvent.click(host.getByRole('button', { name: 'Bring' }))
    expect(document.activeElement).toBe(host.getByTestId('exposed__title'))
  })

  it('keeps focus on Submit while running, then moves it to the heading on success', async () => {
    const { getByTestId, rerender } = render(AgentQuestion, {
      props: { ...base, modelValue: 'staging' }
    })
    const submit = getByTestId('agent-question__submit')
    submit.focus()
    await rerender({ status: 'running' })
    await nextTick()
    expect(document.activeElement).toBe(submit)
    await rerender({ status: 'success' })
    await expect.poll(() => document.activeElement).toBe(getByTestId('agent-question__title'))
  })

  it('moves focus to the heading when the focused field turns inert', async () => {
    const { getByRole, getByTestId, rerender } = render(AgentQuestion, {
      props: { title: 'Which domain?', type: 'text', modelValue: 'shop' }
    })
    getByRole('textbox').focus()
    await rerender({ status: 'running' })
    await expect.poll(() => document.activeElement).toBe(getByTestId('agent-question__title'))
  })

  it('does not take focus on a status change when focus is elsewhere', async () => {
    const { rerender } = render(AgentQuestion, { props: { ...base, modelValue: 'staging' } })
    await rerender({ status: 'success' })
    await nextTick()
    expect(document.activeElement).toBe(document.body)
  })

  it('renders the default slot as details, and nothing without it', () => {
    const withSlot = render(AgentQuestion, {
      props: base,
      slots: { default: () => 'waf-rules v3' }
    })
    expect(withSlot.getByTestId('agent-question__details')).toHaveTextContent('waf-rules v3')
    withSlot.unmount()
    const without = render(AgentQuestion, { props: base })
    expect(without.queryByTestId('agent-question__details')).toBeNull()
  })

  it('has no axe violations for each type, with an error, and resolved', async () => {
    for (const props of [
      { ...base, skippable: true },
      { title: 'Which domain?', type: 'text' as const, placeholder: 'example.com' },
      { title: 'Keep it?', type: 'confirm' as const, skippable: true },
      { ...base, status: 'error' as const },
      { title: 'Which domain?', type: 'text' as const, status: 'error' as const },
      { title: 'Keep it?', type: 'confirm' as const, status: 'error' as const },
      { ...base, status: 'running' as const, modelValue: 'staging' }
    ]) {
      const view = render(AgentQuestion, { props, slots: { default: () => 'Context' } })
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
    const resolved = render(AgentQuestion, {
      props: { ...base, status: 'success', modelValue: 'staging' }
    })
    await expectNoA11yViolations(resolved.container)
  })
})
