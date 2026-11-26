import './reflow.css'

import { fireEvent, render, screen } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { h, nextTick } from 'vue'

import JobPostingStates from '../../examples/job-posting-section/states.vue'
import Button from '../components/action/button/button.vue'
import FeedbackReasonDialog from '../components/ai/feedback-reason-dialog/feedback-reason-dialog.vue'
import PanelFooter from '../components/overlay/panel/panel-footer.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

async function phone() {
  await page.viewport(390, 844)
  await vi.waitFor(() => expect(window.matchMedia('(width: 390px)').matches).toBe(true))
  await frame()
}

function footerButtons(footer: HTMLElement) {
  return Array.from(footer.querySelectorAll<HTMLElement>('[data-testid="button"]'))
}

function expectDrawnHeight(buttons: HTMLElement[], height: number) {
  expect(buttons.length).toBeGreaterThan(0)
  for (const button of buttons) {
    expect(Math.round(button.getBoundingClientRect().height), button.textContent ?? '').toBe(height)
  }
}

afterEach(async () => {
  await page.viewport(414, 896)
})

describe('PanelFooter on a phone (styled)', () => {
  const twoButtons = (footerClass: string) =>
    render({
      render: () =>
        h(PanelFooter, { class: footerClass }, () => [
          h(Button, { label: 'See open positions', variant: 'outline', size: 'medium' }),
          h(Button, { label: 'Done', size: 'medium' })
        ])
    })

  it('keeps stacked buttons at their drawn height in a column footer', async () => {
    await phone()
    const view = twoButtons('flex-col items-stretch md:flex-row md:justify-end')
    await frame()
    expectDrawnHeight(footerButtons(view.container as HTMLElement), 32)
  })

  it('still stretches a row footer across one line at the drawn height', async () => {
    await phone()
    const view = twoButtons('')
    await frame()
    const buttons = footerButtons(view.container as HTMLElement)
    expectDrawnHeight(buttons, 32)
    const [first, second] = buttons.map((b) => b.getBoundingClientRect())
    expect(Math.round(first!.top)).toBe(Math.round(second!.top))
    expect(first!.width + second!.width).toBeGreaterThan(300)
  })

  it('keeps the job posting confirmation actions at their drawn height', async () => {
    await phone()
    render(JobPostingStates)
    await fireEvent.click(screen.getByRole('button', { name: 'Show the confirmation' }))
    await nextTick()
    const dialog = await vi.waitFor(() => {
      const found = document.body.querySelector<HTMLElement>('[role="dialog"]')
      expect(found).not.toBeNull()
      return found!
    })
    await frame()
    const footer = dialog.querySelector<HTMLElement>('footer')!
    expectDrawnHeight(footerButtons(footer), 32)
  })

  it('keeps the feedback dialog actions at their drawn height', async () => {
    await phone()
    render(FeedbackReasonDialog, { props: { open: true } })
    const dialog = await vi.waitFor(() => {
      const found = document.body.querySelector<HTMLElement>('[role="dialog"]')
      expect(found).not.toBeNull()
      return found!
    })
    await frame()
    const footer = dialog.querySelector<HTMLElement>('footer')!
    expectDrawnHeight(footerButtons(footer), 40)
  })
})
