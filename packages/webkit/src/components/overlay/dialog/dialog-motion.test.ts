import '../../../test/reflow.css'

import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { commands } from 'vitest/browser'
import { nextTick } from 'vue'

import DialogDefault from '../../../../examples/dialog/default.vue'
import DrawerDefault from '../../../../examples/drawer/default.vue'
import PopoverDefault from '../../../../examples/popover/default.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const settle = async () => {
  await nextTick()
  await frame()
  await frame()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

function longMotion(root: HTMLElement): string[] {
  const animations = root
    .getAnimations({ subtree: true })
    .filter((animation) => Number(animation.effect?.getComputedTiming().duration ?? 0) > 1)
    .map((animation) => (animation as CSSAnimation).animationName ?? 'animation')
  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))]
  const transitions = elements
    .filter((element) =>
      getComputedStyle(element)
        .transitionDuration.split(',')
        .some((value) => parseFloat(value) > 0.001)
    )
    .map((element) => element.dataset['testid'] ?? element.tagName)
  return [...animations, ...transitions]
}

describe('Dialog', () => {
  describe('overlay entrance motion under prefers-reduced-motion', () => {
    afterEach(async () => {
      await commands.emulateMedia({ reducedMotion: null })
    })

    it('Dialog opens with no animation or transition longer than 1ms', async () => {
      await commands.emulateMedia({ reducedMotion: 'reduce' })
      render(DialogDefault)
      await settle()
      await fireEvent.click(byTestId('dialog__trigger')!)
      await settle()
      const panel = byTestId('dialog__panel')
      expect(panel).not.toBeNull()
      expect(longMotion(panel!.closest('[role="dialog"]') ?? panel!)).toEqual([])
    })

    it('Drawer opens with no animation or transition longer than 1ms', async () => {
      await commands.emulateMedia({ reducedMotion: 'reduce' })
      render(DrawerDefault)
      await settle()
      await fireEvent.click(byTestId('drawer__trigger')!)
      await settle()
      const panel = byTestId('drawer__panel')
      expect(panel).not.toBeNull()
      expect(longMotion(panel!)).toEqual([])
    })

    it('Popover opens with no animation or transition longer than 1ms', async () => {
      await commands.emulateMedia({ reducedMotion: 'reduce' })
      render(PopoverDefault)
      await settle()
      await fireEvent.click(byTestId('popover-trigger')!.querySelector('button')!)
      await settle()
      const panel = byTestId('popover__panel')
      expect(panel).not.toBeNull()
      expect(longMotion(panel!)).toEqual([])
    })
  })
})
