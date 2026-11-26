import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/subagent-card/default.vue'
import WithMessages from '../../../../examples/subagent-card/with-messages.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import SubagentCard from './subagent-card.vue'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('SubagentCard', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(
      render(SubagentCard, { props: { name: 'researcher' } }).getByTestId('subagent-card')
    ).toBeTruthy()
    expect(
      render(SubagentCard, {
        props: { name: 'researcher' },
        attrs: { 'data-testid': 'mine' }
      }).getByTestId('mine')
    ).toBeTruthy()
  })

  it.each([
    ['pending', 'Waiting'],
    ['running', 'Running'],
    ['success', 'Completed'],
    ['error', 'Failed'],
    ['canceled', 'Stopped']
  ] as const)('shows %s as text in a status region', (status, text) => {
    const { getByTestId, getByRole } = render(SubagentCard, {
      props: { name: 'researcher', status }
    })
    expect(getByTestId('subagent-card')).toHaveAttribute('data-status', status)
    expect(getByRole('status')).toHaveTextContent(text)
  })

  it('shows the name as code, the title and the summary line', async () => {
    const { getByText, getByTestId, queryByTestId, rerender } = render(SubagentCard, {
      props: {
        name: 'researcher',
        title: 'Comparing cache plans',
        description: 'Reading the pricing page.'
      }
    })
    expect(getByText('researcher').tagName).toBe('CODE')
    expect(getByText('Comparing cache plans')).toBeTruthy()
    expect(getByTestId('subagent-card__description')).toHaveTextContent('Reading the pricing page.')
    await rerender({ name: 'researcher', description: '' })
    expect(queryByTestId('subagent-card__description')).toBeNull()
  })

  it('shows a known duration in the active locale format', async () => {
    const { getByTestId, rerender } = render(SubagentCard, {
      props: { name: 'reviewer', status: 'success', duration: 95 }
    })
    expect(getByTestId('subagent-card__elapsed')).toHaveTextContent('1m 35s')
    await rerender({ name: 'reviewer', status: 'success', duration: 3720 })
    expect(getByTestId('subagent-card__elapsed')).toHaveTextContent('1h 2m')
  })

  it('hides the elapsed time when it is unknown', () => {
    const { queryByTestId } = render(SubagentCard, {
      props: { name: 'reviewer', status: 'success' }
    })
    expect(queryByTestId('subagent-card__elapsed')).toBeNull()
  })

  it('counts running time, holds it while pending and keeps adding after', async () => {
    const { getByTestId, rerender } = render(SubagentCard, {
      props: { name: 'researcher', status: 'running' }
    })
    await nextTick()
    expect(getByTestId('subagent-card__elapsed')).toHaveTextContent('0s')
    await wait(1100)
    expect(getByTestId('subagent-card__elapsed')).toHaveTextContent('1s')
    await rerender({ name: 'researcher', status: 'pending' })
    await wait(1100)
    expect(getByTestId('subagent-card__elapsed')).toHaveTextContent('1s')
    await rerender({ name: 'researcher', status: 'running' })
    await wait(1100)
    expect(getByTestId('subagent-card__elapsed')).toHaveTextContent('2s')
    await rerender({ name: 'researcher', status: 'success' })
    await wait(1100)
    expect(getByTestId('subagent-card__elapsed')).toHaveTextContent('2s')
  })

  it('keeps the ticking time out of the status region', () => {
    const { getByRole, getByTestId } = render(SubagentCard, {
      props: { name: 'researcher', status: 'running', duration: 4 }
    })
    expect(getByRole('status')).not.toContainElement(getByTestId('subagent-card__elapsed'))
  })

  it('is static without slots', () => {
    const { queryByRole, getByTestId } = render(SubagentCard, { props: { name: 'researcher' } })
    expect(queryByRole('button')).toBeNull()
    expect(getByTestId('subagent-card')).not.toHaveAttribute('data-state')
  })

  it('opens the task and the messages by keyboard', async () => {
    const { getByTestId, getByRole, emitted } = render(SubagentCard, {
      props: { name: 'researcher', title: 'Comparing cache plans', status: 'success' },
      slots: {
        input: () => 'Compare Starter and Business',
        default: () => 'Business keeps 30 days'
      }
    })
    const trigger = getByTestId('subagent-card__trigger')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(getByTestId('subagent-card__content')).not.toBeVisible()
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(getByTestId('subagent-card')).toHaveAttribute('data-state', 'open')
    expect(getByRole('region', { name: 'Task' })).toHaveTextContent('Compare Starter and Business')
    expect(getByRole('region', { name: 'Activity' })).toHaveTextContent('Business keeps 30 days')
    expect(emitted('update:open')?.[0]).toEqual([true])
  })

  it('renders only the sections whose slot is passed', () => {
    const { queryByRole } = render(SubagentCard, {
      props: { name: 'researcher', defaultOpen: true },
      slots: { default: () => 'Reading' }
    })
    expect(queryByRole('region', { name: 'Activity' })).toBeTruthy()
    expect(queryByRole('region', { name: 'Task' })).toBeNull()
  })

  it('follows a bound v-model:open', async () => {
    const { getByTestId, emitted, rerender } = render(SubagentCard, {
      props: { name: 'researcher', open: true, 'onUpdate:open': () => undefined },
      slots: { default: () => 'Reading' }
    })
    expect(getByTestId('subagent-card__content')).toBeVisible()
    await userEvent.click(getByTestId('subagent-card__trigger'))
    expect(emitted('update:open')?.[0]).toEqual([false])
    expect(getByTestId('subagent-card__content')).toBeVisible()
    await rerender({ name: 'researcher', open: false, 'onUpdate:open': () => undefined })
    expect(getByTestId('subagent-card__content')).not.toBeVisible()
  })

  it('offers Stop only while stoppable and running or pending, named after the helper', async () => {
    const { getByTestId, queryByTestId, getByRole, emitted, rerender } = render(SubagentCard, {
      props: { name: 'researcher', status: 'running', stoppable: true }
    })
    expect(getByRole('button', { name: 'Stop researcher' })).toBeTruthy()
    await userEvent.click(getByTestId('subagent-card__stop'))
    const stops = emitted('stop') as unknown[][]
    expect(stops).toHaveLength(1)
    expect(stops[0]?.[0]).toBeInstanceOf(MouseEvent)
    await rerender({ name: 'researcher', status: 'pending', stoppable: true })
    expect(queryByTestId('subagent-card__stop')).toBeTruthy()
    await rerender({ name: 'researcher', status: 'success', stoppable: true })
    expect(queryByTestId('subagent-card__stop')).toBeNull()
    await rerender({ name: 'researcher', status: 'running', stoppable: false })
    expect(queryByTestId('subagent-card__stop')).toBeNull()
  })

  it('moves focus to the toggle when Stop leaves while focused', async () => {
    const Host = defineComponent({
      setup() {
        const status = ref<'running' | 'canceled'>('running')
        return () =>
          h(
            SubagentCard,
            {
              name: 'researcher',
              status: status.value,
              stoppable: true,
              onStop: () => {
                status.value = 'canceled'
              }
            },
            { default: () => 'Reading' }
          )
      }
    })
    const { getByTestId, getByRole } = render(Host)
    getByTestId('subagent-card__stop').focus()
    await userEvent.keyboard('{Enter}')
    await nextTick()
    await nextTick()
    expect(getByRole('status')).toHaveTextContent('Stopped')
    expect(document.activeElement).toBe(getByTestId('subagent-card__trigger'))
  })

  it('moves focus to the card when Stop leaves a static card', async () => {
    const Host = defineComponent({
      setup() {
        const status = ref<'running' | 'canceled'>('running')
        return () =>
          h(SubagentCard, {
            name: 'researcher',
            status: status.value,
            stoppable: true,
            onStop: () => {
              status.value = 'canceled'
            }
          })
      }
    })
    const { getByTestId } = render(Host)
    getByTestId('subagent-card__stop').focus()
    await userEvent.keyboard('{Enter}')
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(getByTestId('subagent-card'))
  })

  it('renders nested helpers inside the messages', () => {
    const { getAllByTestId } = render(WithMessages)
    const cards = getAllByTestId('subagent-card')
    expect(cards).toHaveLength(3)
    expect(cards[0]).toContainElement(cards[1] as HTMLElement)
  })

  it('stops the helper in the example', async () => {
    const { getAllByTestId, getAllByRole } = render(WithMessages)
    await userEvent.click(getAllByTestId('subagent-card__stop')[0] as HTMLElement)
    expect(getAllByTestId('subagent-card')[0]).toHaveAttribute('data-status', 'canceled')
    expect(getAllByRole('status')[0]).toHaveTextContent('Stopped')
  })

  it('has no axe violations', async () => {
    const { container: list } = render(Default)
    await expectNoA11yViolations(list)
    const { container: open } = render(WithMessages)
    await expectNoA11yViolations(open)
  })
})
