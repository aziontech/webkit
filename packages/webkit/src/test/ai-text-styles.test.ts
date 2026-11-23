import './reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { h, nextTick } from 'vue'

import ChatMessageError from '../../examples/chat-message/error.vue'
import PromptInputCharacterLimit from '../../examples/prompt-input/character-limit.vue'
import StreamingResponseDefault from '../../examples/streaming-response/default.vue'
import ToolApprovalIrreversible from '../../examples/tool-approval/irreversible.vue'
import ToolCallDefault from '../../examples/tool-call/default.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

async function mount(component: object) {
  const view = render({ render: () => h('div', [h(component)]) })
  await nextTick()
  await frame()
  return view
}

function tokenColor(token: string): string {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  document.body.append(probe)
  const color = getComputedStyle(probe).color
  probe.remove()
  return color
}

const px = (el: Element, property: 'fontSize' | 'fontWeight') =>
  parseFloat(getComputedStyle(el)[property])

afterEach(async () => {
  await page.viewport(414, 896)
})

describe('AI text styles (styled)', () => {
  it('paints error text on a surface with --text-danger, never --danger-foreground', async () => {
    const chat = await mount(ChatMessageError)
    const error = chat.getByTestId('chat-message__error')
    expect(getComputedStyle(error).color).toBe(tokenColor('--text-danger'))
    expect(getComputedStyle(error).color).not.toBe(tokenColor('--danger-foreground'))
    chat.unmount()

    const prompt = await mount(PromptInputCharacterLimit)
    const counter = prompt.container.querySelector<HTMLElement>('.tabular-nums[data-invalid]')!
    expect(getComputedStyle(counter).color).toBe(tokenColor('--text-danger'))
    prompt.unmount()

    const approval = await mount(ToolApprovalIrreversible)
    const shield = approval.container.querySelector<HTMLElement>('.az-shield')!
    expect(getComputedStyle(shield).color).toBe(tokenColor('--danger-mark'))
  })

  it.each([320, 1280])(
    'sets a response heading at least as large as the body and in medium weight at %ipx',
    async (width) => {
      await page.viewport(width, 900)
      const view = await mount(StreamingResponseDefault)
      const heading = view.container.querySelector<HTMLElement>('[data-level]')!
      const paragraph = view.container.querySelector<HTMLElement>('p')!
      expect(px(heading, 'fontSize')).toBeGreaterThanOrEqual(px(paragraph, 'fontSize'))
      expect(px(heading, 'fontWeight')).toBeGreaterThan(px(paragraph, 'fontWeight'))
    }
  )

  it('keeps the tool name chip tall enough for its descenders and the title readable', async () => {
    const view = await mount(ToolCallDefault)
    const chip = view.container.querySelector<HTMLElement>('code')!
    expect(chip.getBoundingClientRect().height).toBeGreaterThan(px(chip, 'fontSize') * 1.2)
    const title = chip.previousElementSibling as HTMLElement
    expect(title.textContent?.trim()).toBe('Purging one URL')
    expect(px(title, 'fontSize')).toBeGreaterThanOrEqual(14)
  })
})
