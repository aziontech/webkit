import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ToolCall from './tool-call.vue'

describe('ToolCall', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(ToolCall, { props: { name: 'list' } }).getByTestId('ai-tool-call')).toBeTruthy()
    expect(
      render(ToolCall, { props: { name: 'list' }, attrs: { 'data-testid': 'mine' } }).getByTestId(
        'mine'
      )
    ).toBeTruthy()
  })

  it.each([
    ['pending', 'Waiting'],
    ['running', 'Running'],
    ['success', 'Completed'],
    ['error', 'Failed'],
    ['denied', 'Denied']
  ] as const)('shows %s as text in a status region', (state, text) => {
    const { getByTestId, getByRole } = render(ToolCall, { props: { name: 'purge_urls', state } })
    expect(getByTestId('ai-tool-call')).toHaveAttribute('data-status', state)
    expect(getByRole('status')).toHaveTextContent(text)
  })

  it('shows the name as code and the title as text', () => {
    const { getByText } = render(ToolCall, {
      props: { name: 'list_workloads', title: 'Listing your workloads' }
    })
    expect(getByText('list_workloads').tagName).toBe('CODE')
    expect(getByText('Listing your workloads')).toBeTruthy()
  })

  it('is static without details', () => {
    const { queryByRole, getByTestId } = render(ToolCall, { props: { name: 'list' } })
    expect(queryByRole('button')).toBeNull()
    expect(getByTestId('ai-tool-call')).not.toHaveAttribute('data-state')
  })

  it('expands input and output by keyboard', async () => {
    const { getByRole, getByTestId, emitted } = render(ToolCall, {
      props: { name: 'get_settings', state: 'success' },
      slots: { input: () => '{ "id": 1 }', output: () => '{ "ttl": 60 }' }
    })
    const trigger = getByRole('button')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(getByTestId('ai-tool-call__details')).not.toBeVisible()
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(getByRole('region', { name: 'Input' })).toHaveTextContent('{ "id": 1 }')
    expect(getByRole('region', { name: 'Output' })).toHaveTextContent('{ "ttl": 60 }')
    expect(emitted('update:open')?.[0]).toEqual([true])
  })

  it('has no axe violations', async () => {
    const { container } = render(ToolCall, {
      props: { name: 'get_settings', state: 'error', defaultOpen: true },
      slots: { output: () => 'metrics_unavailable' }
    })
    await expectNoA11yViolations(container)
  })
})
