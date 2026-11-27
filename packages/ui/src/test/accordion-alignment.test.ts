import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import Accordion from '../components/content/accordion'

const host = (props: Record<string, unknown>, padded = true) =>
  defineComponent({
    components: {
      Accordion,
      AccordionItem: Accordion.Item,
      AccordionTrigger: Accordion.Trigger,
      AccordionContent: Accordion.Content
    },
    setup: () => ({ props, padded }),
    template: `
      <div style="width: 480px">
        <Accordion v-bind="props" default-value="pricing">
          <AccordionItem value="overview">
            <AccordionTrigger>What is Azion?</AccordionTrigger>
            <AccordionContent :padded="padded">Azion runs your code at the edge.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="pricing">
            <AccordionTrigger>How does pricing work?</AccordionTrigger>
            <AccordionContent :padded="padded">Pay only for what you use.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="support">
            <AccordionTrigger>Enterprise support</AccordionTrigger>
            <AccordionContent :padded="padded">Available on Business plans.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    `
  })

const mount = async (props: Record<string, unknown>, padded = true) => {
  const view = render(host(props, padded))
  await nextTick()
  await document.fonts.ready
  return view
}

const contentStart = (content: HTMLElement) => {
  const body = content.firstElementChild as HTMLElement
  return body.getBoundingClientRect().left + parseFloat(getComputedStyle(body).paddingLeft)
}

const labelStart = (trigger: HTMLElement) =>
  (trigger.querySelector(':scope > span') as HTMLElement).getBoundingClientRect().left

describe('Accordion alignment and dividers (styled)', () => {
  for (const size of ['medium', 'large']) {
    for (const iconPosition of ['trailing', 'leading']) {
      it(`starts the answer on the question's left edge (${size}, ${iconPosition})`, async () => {
        const view = await mount({ size, iconPosition })
        const content = view.getByTestId('accordion-content')
        const trigger = view.getAllByTestId('accordion-trigger')[1]!
        expect(Math.abs(contentStart(content) - labelStart(trigger))).toBeLessThanOrEqual(1)
        const body = content.firstElementChild as HTMLElement
        expect(parseFloat(getComputedStyle(body).paddingTop)).toBeGreaterThan(0)
        expect(parseFloat(getComputedStyle(body).paddingBottom)).toBeGreaterThan(0)
      })
    }
  }

  it('wraps a long leading-chevron label inside the trigger on a narrow screen', async () => {
    const view = render(
      defineComponent({
        components: {
          Accordion,
          AccordionItem: Accordion.Item,
          AccordionTrigger: Accordion.Trigger
        },
        template: `
          <div style="width: 240px">
            <Accordion icon-position="leading">
              <AccordionItem value="all">
                <AccordionTrigger>
                  <span style="display: flex; flex-wrap: wrap; gap: 8px">
                    <span>All services</span><span>4 services</span><span>4 on a shared setting</span>
                  </span>
                </AccordionTrigger>
              </AccordionItem>
            </Accordion>
          </div>
        `
      })
    )
    await nextTick()
    await document.fonts.ready
    const trigger = view.getByTestId('accordion-trigger')
    const label = trigger.querySelector(':scope > span') as HTMLElement
    expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(
      trigger.getBoundingClientRect().right + 0.5
    )
  })

  it('draws one divider under every item but the last, open or closed, and none under a trigger', async () => {
    const view = await mount({})
    const items = view.getAllByTestId('accordion-item')
    expect(items.map((item) => getComputedStyle(item).borderBottomWidth)).toEqual([
      '1px',
      '1px',
      '0px'
    ])
    for (const trigger of view.getAllByTestId('accordion-trigger'))
      expect(getComputedStyle(trigger).borderBottomWidth).toBe('0px')
  })

  it('leaves edge-to-edge content flush when padded is false', async () => {
    const view = await mount({}, false)
    const body = view.getByTestId('accordion-content').firstElementChild as HTMLElement
    expect(getComputedStyle(body).paddingLeft).toBe('0px')
    expect(getComputedStyle(body).paddingBottom).toBe('0px')
  })
})
