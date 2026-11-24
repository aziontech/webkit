import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import { nextTick } from 'vue'

import CopyPromptButtonDefault from '../../examples/copy-prompt-button/default.vue'
import EyebrowCursor from '../../examples/eyebrow/cursor.vue'
import FlowDiagramDefault from '../../examples/flow-diagram/default.vue'
import FlowDiagramTopology from '../../examples/flow-diagram/topology.vue'
import HighlightButtonDefault from '../../examples/highlight-button/default.vue'
import NetworkMapAnimated from '../../examples/network-map/animated.vue'
import NetworkMapTraffic from '../../examples/network-map/traffic.vue'
import ReasoningStreaming from '../../examples/reasoning/streaming.vue'
import TextureVariants from '../../examples/texture/variants.vue'

const LIMIT = 5000

const EXAMPLES: [string, Component][] = [
  ['copy-prompt-button/default', CopyPromptButtonDefault],
  ['eyebrow/cursor', EyebrowCursor],
  ['flow-diagram/default', FlowDiagramDefault],
  ['highlight-button/default', HighlightButtonDefault],
  ['network-map/animated', NetworkMapAnimated],
  ['network-map/traffic', NetworkMapTraffic],
  ['texture/variants', TextureVariants],
  ['flow-diagram/topology', FlowDiagramTopology]
]

const frame = () => new Promise((resolve) => requestAnimationFrame(resolve))

async function mounted(component: Component) {
  const view = render(component)
  await nextTick()
  await frame()
  await frame()
  return view
}

function animationsIn(root: Element) {
  return document.getAnimations().filter((animation) => {
    const target = (animation.effect as KeyframeEffect | null)?.target
    return target instanceof Element && root.contains(target)
  })
}

describe('decorative motion stops by itself within five seconds (WCAG 2.2.2)', () => {
  it.each(EXAMPLES)('%s', async (_, component) => {
    const { container } = await mounted(component)
    await vi.waitFor(() => expect(animationsIn(container).length).toBeGreaterThan(0))
    const animations = animationsIn(container)
    for (const animation of animations) {
      expect((animation.effect as KeyframeEffect).getKeyframes().length).toBeGreaterThan(0)
      const end = Number(animation.effect!.getComputedTiming().endTime)
      expect(Number.isFinite(end)).toBe(true)
      expect(end).toBeLessThanOrEqual(LIMIT)
    }
  })

  it('leaves the eyebrow cursor solid once its blinks end', async () => {
    const { container } = await mounted(EyebrowCursor)
    const cursor = container.querySelector<HTMLElement>('.animate-blink-settle')!
    await new Promise((resolve) => setTimeout(resolve, 4300))
    expect(cursor.getAnimations()).toHaveLength(0)
    expect(getComputedStyle(cursor).opacity).toBe('1')
  }, 10000)
})

describe('a status pulse runs for as long as its status lasts', () => {
  it('reasoning/streaming: the sparkle pulses while the model streams', async () => {
    const { container } = await mounted(ReasoningStreaming)
    const sparkle = container.querySelector<HTMLElement>('i[data-streaming]')!
    await vi.waitFor(() => expect(sparkle.getAnimations().length).toBeGreaterThan(0))
    const [animation] = sparkle.getAnimations()
    expect((animation!.effect as KeyframeEffect).getKeyframes().length).toBeGreaterThan(0)
    expect(animation!.effect!.getComputedTiming().iterations).toBe(Infinity)
  })
})
