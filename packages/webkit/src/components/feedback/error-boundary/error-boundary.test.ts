import { userEvent } from '@storybook/test'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, onErrorCaptured, ref } from 'vue'

import CustomFallback from '../../../../examples/error-boundary/custom-fallback.vue'
import Default from '../../../../examples/error-boundary/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import ErrorBoundary from './error-boundary.vue'

const broken = ref(false)
let mounts = 0

const Region = defineComponent({
  name: 'Region',
  setup() {
    mounts += 1
    return () => {
      if (broken.value) throw new Error('region exploded')
      return h('button', { type: 'button', 'data-testid': 'region' }, 'Region content')
    }
  }
})

const reset = () => {
  broken.value = false
  mounts = 0
}

describe('ErrorBoundary', () => {
  it('renders the region untouched while nothing fails', () => {
    reset()
    const { getByTestId, queryByRole } = render(ErrorBoundary, { slots: { default: Region } })
    expect(getByTestId('region')).toHaveTextContent('Region content')
    expect(getByTestId('feedback-error-boundary').hasAttribute('data-error')).toBe(false)
    expect(queryByRole('alert')).toBeNull()
  })

  it('replaces a failing region with the danger Alert and emits error once', async () => {
    reset()
    const { getByTestId, getByRole, queryByTestId, emitted } = render(ErrorBoundary, {
      slots: { default: Region }
    })
    broken.value = true
    await waitFor(() => expect(getByRole('alert')).toBeTruthy())
    expect(queryByTestId('region')).toBeNull()
    expect(getByTestId('feedback-error-boundary').hasAttribute('data-error')).toBe(true)
    expect(getByRole('alert')).toHaveTextContent('This section failed to load')
    const events = emitted<[{ error: Error; info: string }]>().error
    expect(events).toHaveLength(1)
    expect(events[0][0].error.message).toBe('region exploded')
    expect(typeof events[0][0].info).toBe('string')
  })

  it('mounts the region again on Retry and emits retry', async () => {
    reset()
    const { getByRole, getByTestId, emitted } = render(ErrorBoundary, {
      slots: { default: Region }
    })
    broken.value = true
    await waitFor(() => expect(getByRole('alert')).toBeTruthy())
    broken.value = false
    await fireEvent.click(getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(getByTestId('region')).toBeTruthy())
    expect(mounts).toBe(2)
    expect(emitted().retry).toHaveLength(1)
  })

  it('stops the error from reaching the parent unless propagate is set', async () => {
    for (const propagate of [false, true]) {
      reset()
      const seen = vi.fn()
      const Parent = defineComponent({
        setup() {
          onErrorCaptured(() => {
            seen()
            return false
          })
          return () => h(ErrorBoundary, { propagate }, { default: () => h(Region) })
        }
      })
      const { getByRole, unmount } = render(Parent)
      broken.value = true
      await waitFor(() => expect(getByRole('alert')).toBeTruthy())
      expect(seen).toHaveBeenCalledTimes(propagate ? 1 : 0)
      unmount()
    }
  })

  it('resets when resetKey changes while the fallback shows', async () => {
    reset()
    const { getByRole, getByTestId, rerender, emitted } = render(ErrorBoundary, {
      props: { resetKey: '/services/1' },
      slots: { default: Region }
    })
    broken.value = true
    await waitFor(() => expect(getByRole('alert')).toBeTruthy())
    broken.value = false
    await rerender({ resetKey: '/services/2' })
    await waitFor(() => expect(getByTestId('region')).toBeTruthy())
    expect(emitted().retry).toHaveLength(1)
  })

  it('renders the fallback slot with the error and a working retry', async () => {
    reset()
    const { getByTestId, getByText } = render(ErrorBoundary, {
      slots: {
        default: Region,
        fallback: `<template #fallback="{ error, retry }"><p>{{ error.message }}</p><button type="button" @click="retry">Reload card</button></template>`
      }
    })
    broken.value = true
    await waitFor(() => expect(getByText('region exploded')).toBeTruthy())
    broken.value = false
    await fireEvent.click(getByText('Reload card'))
    await waitFor(() => expect(getByTestId('region')).toBeTruthy())
  })

  it('uses the title, description and retryLabel props over the catalog', async () => {
    reset()
    const { getByRole } = render(ErrorBoundary, {
      props: { title: 'Chart failed', description: 'Try it again.', retryLabel: 'Reload' },
      slots: { default: Region }
    })
    broken.value = true
    await waitFor(() => expect(getByRole('alert')).toHaveTextContent('Chart failed'))
    expect(getByRole('alert')).toHaveTextContent('Try it again.')
    expect(getByRole('button', { name: 'Reload' })).toBeTruthy()
  })

  describe('keyboard and focus', () => {
    it('moves focus to the fallback when focus was inside the region, then back to the root after Retry', async () => {
      reset()
      const { getByRole, getByTestId } = render(ErrorBoundary, { slots: { default: Region } })
      getByTestId('region').focus()
      expect(document.activeElement).toBe(getByTestId('region'))
      broken.value = true
      await waitFor(() => expect(document.activeElement).toBe(getByRole('alert')))
      broken.value = false
      await userEvent.tab()
      expect(document.activeElement).toBe(getByRole('button', { name: 'Try again' }))
      await userEvent.keyboard('{Enter}')
      await waitFor(() =>
        expect(document.activeElement).toBe(getByTestId('feedback-error-boundary'))
      )
    })

    it('leaves focus alone when it was outside the region', async () => {
      reset()
      const outside = document.createElement('button')
      outside.textContent = 'Outside'
      document.body.append(outside)
      outside.focus()
      const { getByRole } = render(ErrorBoundary, { slots: { default: Region } })
      broken.value = true
      await waitFor(() => expect(getByRole('alert')).toBeTruthy())
      await nextTick()
      expect(document.activeElement).toBe(outside)
      outside.remove()
    })
  })

  describe('locale and direction', () => {
    it('reads the fallback copy from the active catalog', async () => {
      reset()
      const { getByRole } = render(
        defineComponent({
          setup: () => () =>
            h(
              WebkitProvider,
              { locale: 'pt-BR' },
              { default: () => h(ErrorBoundary, null, { default: () => h(Region) }) }
            )
        })
      )
      broken.value = true
      await waitFor(() =>
        expect(getByRole('alert')).toHaveTextContent('Não foi possível carregar esta seção')
      )
      expect(getByRole('button', { name: 'Tentar novamente' })).toBeTruthy()
    })

    it('renders under dir="rtl" with no axe violations', async () => {
      reset()
      const { container, getByRole } = render(
        defineComponent({
          setup: () => () =>
            h(
              WebkitProvider,
              { locale: 'en', dir: 'rtl' },
              { default: () => h(ErrorBoundary, null, { default: () => h(Region) }) }
            )
        })
      )
      broken.value = true
      await waitFor(() => expect(getByRole('alert')).toBeTruthy())
      expect(container.querySelector('[dir="rtl"]')).not.toBeNull()
      await expectNoA11yViolations(container)
    })
  })

  describe('axe', () => {
    it('has no violations in the Default example, before and after a failure', async () => {
      const { container, getByRole } = render(Default)
      await expectNoA11yViolations(container)
      await fireEvent.click(getByRole('button', { name: 'Simulate a failure' }))
      await waitFor(() => expect(getByRole('alert')).toBeTruthy())
      expect(container).toHaveTextContent(
        'Reported: The response held a value the list could not read.'
      )
      await expectNoA11yViolations(container)
      await fireEvent.click(getByRole('button', { name: 'Try again' }))
      await waitFor(() => expect(container.querySelector('[role="alert"]')).toBeNull())
    })

    it('has no violations in the Custom fallback example', async () => {
      const { container, getByRole, getByText } = render(CustomFallback)
      await fireEvent.click(getByRole('button', { name: 'Simulate a failure' }))
      await waitFor(() => expect(getByText('This chart failed to load')).toBeTruthy())
      await expectNoA11yViolations(container)
      await fireEvent.click(getByRole('button', { name: 'Try again' }))
      await waitFor(() => expect(container.textContent).toContain('South America'))
    })
  })
})
