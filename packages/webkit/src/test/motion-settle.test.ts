import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import { nextTick } from 'vue'

import EyebrowCursor from '../../examples/eyebrow/cursor.vue'
import FlowDiagramDefault from '../../examples/flow-diagram/default.vue'
import HighlightButtonDefault from '../../examples/highlight-button/default.vue'
import NetworkMapAnimated from '../../examples/network-map/animated.vue'
import NetworkMapTraffic from '../../examples/network-map/traffic.vue'
import TextureVariants from '../../examples/texture/variants.vue'
import TopologyDiagramDefault from '../../examples/topology-diagram/default.vue'

const LIMIT = 5000

const EXAMPLES: [string, Component][] = [
  ['eyebrow/cursor', EyebrowCursor],
  ['flow-diagram/default', FlowDiagramDefault],
  ['highlight-button/default', HighlightButtonDefault],
  ['network-map/animated', NetworkMapAnimated],
  ['network-map/traffic', NetworkMapTraffic],
  ['texture/variants', TextureVariants],
  ['topology-diagram/default', TopologyDiagramDefault]
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
    const animations = animationsIn(container)
    expect(animations.length).toBeGreaterThan(0)
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
