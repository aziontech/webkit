import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/accordion/Accordion.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Accordion, { AccordionContent, AccordionItem, AccordionTrigger } from './index'

const { Default, Multiple } = composeStories(stories)

/**
 * Realistic FAQ tree mirroring the Storybook Default: three items with real
 * headings and body copy. The optional disabled middle item exercises the
 * roving-focus skip and the suppression paths.
 */
const host = (props: Record<string, unknown> = {}, { disablePricing = false } = {}) =>
  defineComponent({
    components: { Accordion, AccordionItem, AccordionTrigger, AccordionContent },
    setup() {
      return { props, disablePricing }
    },
    template: `
      <Accordion v-bind="props">
        <AccordionItem value="overview">
          <AccordionTrigger>What is Azion?</AccordionTrigger>
          <AccordionContent>Azion runs your code at the edge, close to users.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="pricing" :disabled="disablePricing">
          <AccordionTrigger>How does pricing work?</AccordionTrigger>
          <AccordionContent>Pay only for what you use, with no upfront cost.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="support">
          <AccordionTrigger>Enterprise support</AccordionTrigger>
          <AccordionContent>Available on Business and Enterprise plans.</AccordionContent>
        </AccordionItem>
      </Accordion>
    `
  })

const trigger = (view: ReturnType<typeof render>, name: string) =>
  view.getByRole('button', { name: new RegExp(name) })

const regions = () => Array.from(document.querySelectorAll('[role="region"]')) as HTMLElement[]

describe('Accordion (compound / provide-inject)', () => {
  // ---- Compound API ----------------------------------------------------------
  it('attaches Item, Trigger and Content to the compound root for dot-notation', () => {
    expect(Accordion.Item).toBe(AccordionItem)
    expect(Accordion.Trigger).toBe(AccordionTrigger)
    expect(Accordion.Content).toBe(AccordionContent)
  })

  // ---- Root anatomy + variant props → data-* ---------------------------------
  it('renders the root with default testid, orientation and variant defaults', () => {
    const view = render(host())

    const root = view.getByTestId('content-accordion')
    expect(root.getAttribute('data-orientation')).toBe('vertical')
    expect(root.getAttribute('data-type')).toBe('single')
    expect(root.getAttribute('data-size')).toBe('medium')
    expect(root.getAttribute('data-arrow')).toBe('right')
  })

  it('mirrors type / size / arrowPosition onto root and context-driven sub-components', () => {
    const view = render(
      host({ type: 'multiple', size: 'large', arrowPosition: 'left', defaultValue: ['overview'] })
    )

    const root = view.getByTestId('content-accordion')
    expect(root.getAttribute('data-type')).toBe('multiple')
    expect(root.getAttribute('data-size')).toBe('large')
    expect(root.getAttribute('data-arrow')).toBe('left')

    // Trigger and open content read size/arrow from the injected context.
    const overviewTrigger = trigger(view, 'What is Azion')
    expect(overviewTrigger.getAttribute('data-size')).toBe('large')
    expect(overviewTrigger.getAttribute('data-arrow')).toBe('left')
    expect(regions()[0].getAttribute('data-size')).toBe('large')
  })

  it('a consumer data-testid overrides root, item, trigger and content fallbacks', () => {
    const Custom = defineComponent({
      components: { Accordion, AccordionItem, AccordionTrigger, AccordionContent },
      template: `
        <Accordion data-testid="faq" default-value="one">
          <AccordionItem value="one" data-testid="faq-item">
            <AccordionTrigger data-testid="faq-trigger">Question</AccordionTrigger>
            <AccordionContent data-testid="faq-content">Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      `
    })
    const { getByTestId } = render(Custom)

    expect(getByTestId('faq')).toBeTruthy()
    expect(getByTestId('faq-item')).toBeTruthy()
    expect(getByTestId('faq-trigger')).toBeTruthy()
    expect(getByTestId('faq-content')).toBeTruthy()
  })

  // ---- Closed / initial state --------------------------------------------------
  it('starts fully closed with no region and aria-expanded=false everywhere', () => {
    const view = render(host())

    expect(regions()).toHaveLength(0)
    for (const name of ['What is Azion', 'How does pricing work', 'Enterprise support']) {
      expect(trigger(view, name).getAttribute('aria-expanded')).toBe('false')
    }
    view.getAllByTestId('content-accordion-item').forEach((item) => {
      expect(item.getAttribute('data-state')).toBe('closed')
    })
  })

  it('defaultValue opens that item uncontrolled, wiring trigger↔region ids', () => {
    const view = render(host({ defaultValue: 'pricing' }))

    const pricingTrigger = trigger(view, 'How does pricing work')
    expect(pricingTrigger.getAttribute('aria-expanded')).toBe('true')
    expect(pricingTrigger.getAttribute('data-state')).toBe('open')

    const region = regions()[0]
    expect(region).toBeTruthy()
    expect(region.textContent).toContain('Pay only for what you use')
    // aria contract: trigger controls the region; the region is labelled by the trigger.
    expect(pricingTrigger.getAttribute('aria-controls')).toBe(region.id)
    expect(region.getAttribute('aria-labelledby')).toBe(pricingTrigger.id)
  })

  // ---- Toggle behavior: single mode --------------------------------------------
  it('click opens an item and emits update:value + value-change with the item value', async () => {
    const updates: unknown[] = []
    const changes: unknown[] = []
    const view = render(
      host({
        'onUpdate:value': (v: unknown) => updates.push(v),
        onValueChange: (v: unknown) => changes.push(v)
      })
    )

    await fireEvent.click(trigger(view, 'What is Azion'))
    await waitFor(() => expect(regions()).toHaveLength(1))

    expect(updates).toEqual(['overview'])
    expect(changes).toEqual(['overview'])
    expect(regions()[0].textContent).toContain('Azion runs your code at the edge')
  })

  it('single mode: opening a second item closes the first (value replaces)', async () => {
    const updates: unknown[] = []
    const view = render(
      host({ defaultValue: 'overview', 'onUpdate:value': (v: unknown) => updates.push(v) })
    )

    await fireEvent.click(trigger(view, 'Enterprise support'))

    await waitFor(() => {
      expect(trigger(view, 'Enterprise support').getAttribute('aria-expanded')).toBe('true')
      expect(trigger(view, 'What is Azion').getAttribute('aria-expanded')).toBe('false')
    })
    expect(updates).toEqual(['support'])
  })

  it('collapsible (default): clicking the open item collapses to none, emitting null', async () => {
    const updates: unknown[] = []
    const view = render(
      host({ defaultValue: 'overview', 'onUpdate:value': (v: unknown) => updates.push(v) })
    )

    await fireEvent.click(trigger(view, 'What is Azion'))

    await waitFor(() => expect(regions()).toHaveLength(0))
    expect(updates).toEqual([null])
    expect(trigger(view, 'What is Azion').getAttribute('aria-expanded')).toBe('false')
  })

  it('collapsible=false: clicking the open item keeps it open and emits nothing', async () => {
    const updates: unknown[] = []
    const view = render(
      host({
        defaultValue: 'overview',
        collapsible: false,
        'onUpdate:value': (v: unknown) => updates.push(v)
      })
    )

    await fireEvent.click(trigger(view, 'What is Azion'))
    await Promise.resolve()

    expect(updates).toEqual([])
    expect(trigger(view, 'What is Azion').getAttribute('aria-expanded')).toBe('true')
    expect(regions()).toHaveLength(1)
  })

  // ---- Toggle behavior: multiple mode --------------------------------------------
  it('multiple mode: items open independently and payloads are exact arrays', async () => {
    const updates: unknown[] = []
    const view = render(
      host({ type: 'multiple', 'onUpdate:value': (v: unknown) => updates.push(v) })
    )

    await fireEvent.click(trigger(view, 'What is Azion'))
    await fireEvent.click(trigger(view, 'Enterprise support'))
    await waitFor(() => expect(regions()).toHaveLength(2))
    expect(updates).toEqual([['overview'], ['overview', 'support']])

    // Unchecking one leaves the other open.
    await fireEvent.click(trigger(view, 'What is Azion'))
    await waitFor(() => expect(regions()).toHaveLength(1))
    expect(updates[2]).toEqual(['support'])
    expect(trigger(view, 'Enterprise support').getAttribute('aria-expanded')).toBe('true')
  })

  // ---- Controlled / v-model -------------------------------------------------------
  it('controlled: the value prop drives which region renders; clicks emit but do not mutate', async () => {
    const updates: unknown[] = []
    const Controlled = host({ value: 'pricing', 'onUpdate:value': (v: unknown) => updates.push(v) })
    const view = render(Controlled)

    expect(regions()[0].textContent).toContain('Pay only for what you use')

    await fireEvent.click(trigger(view, 'Enterprise support'))
    await Promise.resolve()

    // Emitted the intent, but the parent did not update the prop: view unchanged.
    expect(updates).toEqual(['support'])
    expect(trigger(view, 'Enterprise support').getAttribute('aria-expanded')).toBe('false')
    expect(regions()[0].textContent).toContain('Pay only for what you use')
  })

  it('v-model:value round-trips: the view follows the model the accordion writes', async () => {
    const model = ref<string | null>(null)
    const Wrapper = defineComponent({
      components: { Accordion, AccordionItem, AccordionTrigger, AccordionContent },
      setup() {
        return { model }
      },
      template: `
        <Accordion v-model:value="model">
          <AccordionItem value="overview">
            <AccordionTrigger>What is Azion?</AccordionTrigger>
            <AccordionContent>Azion runs your code at the edge, close to users.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="support">
            <AccordionTrigger>Enterprise support</AccordionTrigger>
            <AccordionContent>Available on Business and Enterprise plans.</AccordionContent>
          </AccordionItem>
        </Accordion>
      `
    })
    const view = render(Wrapper)

    await fireEvent.click(trigger(view, 'Enterprise support'))
    await waitFor(() => expect(regions()).toHaveLength(1))
    expect(model.value).toBe('support')

    model.value = 'overview'
    await waitFor(() =>
      expect(trigger(view, 'What is Azion').getAttribute('aria-expanded')).toBe('true')
    )
    expect(trigger(view, 'Enterprise support').getAttribute('aria-expanded')).toBe('false')
  })

  // ---- Disabled suppression ----------------------------------------------------------
  it('a disabled item ignores clicks, emits nothing, and reflects disabled on aria + data', async () => {
    const onUpdate = vi.fn()
    const view = render(host({ 'onUpdate:value': onUpdate }, { disablePricing: true }))

    const pricingTrigger = trigger(view, 'How does pricing work')
    expect(pricingTrigger.hasAttribute('disabled')).toBe(true)
    expect(pricingTrigger.getAttribute('aria-disabled')).toBe('true')
    expect(pricingTrigger.getAttribute('data-disabled')).toBe('true')

    await fireEvent.click(pricingTrigger)
    await Promise.resolve()

    expect(onUpdate).not.toHaveBeenCalled()
    expect(pricingTrigger.getAttribute('aria-expanded')).toBe('false')
    expect(regions()).toHaveLength(0)
  })

  // ---- Keyboard: toggle + roving focus -------------------------------------------
  it('Enter and Space on a trigger toggle its item', async () => {
    const view = render(host())
    const overviewTrigger = trigger(view, 'What is Azion')

    await fireEvent.keyDown(overviewTrigger, { key: 'Enter' })
    await waitFor(() => expect(overviewTrigger.getAttribute('aria-expanded')).toBe('true'))

    await fireEvent.keyDown(overviewTrigger, { key: ' ' })
    await waitFor(() => expect(overviewTrigger.getAttribute('aria-expanded')).toBe('false'))
  })

  it('ArrowDown / ArrowUp move focus between enabled triggers, skipping disabled and wrapping', async () => {
    const view = render(host({}, { disablePricing: true }))
    const first = trigger(view, 'What is Azion')
    const last = trigger(view, 'Enterprise support')

    first.focus()
    await fireEvent.keyDown(first, { key: 'ArrowDown' })
    // Skips the disabled pricing item.
    expect(document.activeElement).toBe(last)

    await fireEvent.keyDown(last, { key: 'ArrowDown' })
    // Wraps back to the first enabled trigger.
    expect(document.activeElement).toBe(first)

    await fireEvent.keyDown(first, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(last)
  })

  it('Home and End jump focus to the first / last enabled trigger', async () => {
    const view = render(host())
    const first = trigger(view, 'What is Azion')
    const middle = trigger(view, 'How does pricing work')
    const last = trigger(view, 'Enterprise support')

    middle.focus()
    await fireEvent.keyDown(middle, { key: 'End' })
    expect(document.activeElement).toBe(last)

    await fireEvent.keyDown(last, { key: 'Home' })
    expect(document.activeElement).toBe(first)
  })

  // ---- Trigger anatomy ---------------------------------------------------------------
  it('wraps the trigger button in an h3 by default and honors the level prop', () => {
    const Leveled = defineComponent({
      components: { Accordion, AccordionItem, AccordionTrigger, AccordionContent },
      template: `
        <Accordion>
          <AccordionItem value="one">
            <AccordionTrigger :level="2">Level two heading</AccordionTrigger>
            <AccordionContent>Body</AccordionContent>
          </AccordionItem>
        </Accordion>
      `
    })

    const view = render(host())
    expect(trigger(view, 'What is Azion').closest('h3')).not.toBeNull()

    const leveled = render(Leveled)
    expect(leveled.getByRole('button', { name: /Level two heading/ }).closest('h2')).not.toBeNull()
  })

  it('renders a decorative chevron marked aria-hidden inside each trigger', () => {
    const view = render(host())
    const chevron = within(trigger(view, 'What is Azion')).getByTestId(
      'content-accordion-trigger__chevron'
    )
    expect(chevron.getAttribute('aria-hidden')).toBe('true')
  })

  // ---- Accessibility --------------------------------------------------------------------
  it('has no axe violations closed and with an item open', async () => {
    const view = render(host({ defaultValue: 'overview' }))
    await expectNoA11yViolations(view.container)
  })

  // ---- Story fixtures render through the real compound -----------------------------------
  it('renders the Default story with its default-value item open', async () => {
    const view = render(Default)

    await waitFor(() => {
      expect(
        view.getByRole('button', { name: /What is Azion/ }).getAttribute('aria-expanded')
      ).toBe('true')
    })
    expect(regions()[0].textContent).toContain('Azion runs your code at the edge')
  })

  it('renders the Multiple story with its two default-value items open at once', async () => {
    render(Multiple)

    // The story sets :default-value="['overview', 'pricing']" on type=multiple.
    await waitFor(() => expect(regions()).toHaveLength(2))
    const texts = regions().map((region) => region.textContent ?? '')
    expect(texts.join(' ')).toContain('Azion runs your code at the edge')
    expect(texts.join(' ')).toContain('Pay only for what you use')
  })
})
