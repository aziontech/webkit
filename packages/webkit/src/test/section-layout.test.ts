import './reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { commands, page } from 'vitest/browser'
import type { Component } from 'vue'

import HeroFormDefault from '../../examples/hero-form-section/default.vue'
import HeroTopology from '../../examples/hero-section/topology.vue'
import JobPostingDefault from '../../examples/job-posting-section/default.vue'
import LogoWallRegistry from '../../examples/logo-wall-section/registry.vue'
import MediaSplitProductMedia from '../../examples/media-split-section/product-media.vue'
import MediaSplitVertical from '../../examples/media-split-section/vertical.vue'
import ProcessScrollPinned from '../../examples/process-scroll-section/pinned.vue'
import SubjectGridDefault from '../../examples/subject-grid-section/default.vue'
import TemplateGalleryDefault from '../../examples/template-gallery-section/default.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

async function mountAt(component: Component, width: number) {
  await page.viewport(width, 900)
  await vi.waitFor(() => expect(window.matchMedia(`(width: ${width}px)`).matches).toBe(true))
  const view = render(component)
  await frame()
  await frame()
  return view.container as HTMLElement
}

const box = (el: Element) => el.getBoundingClientRect()

const visible = (el: Element) => {
  const rect = box(el)
  return rect.width > 0 && rect.height > 0
}

afterEach(async () => {
  await commands.emulateMedia({ reducedMotion: null })
  await page.viewport(414, 896)
})

describe('page section layouts (styled)', () => {
  it('JobPostingSection shows the rail with the posting above the description on a phone', async () => {
    const root = await mountAt(JobPostingDefault, 390)
    const rail = root.querySelector('[data-testid="job-posting-section__rail"]')!
    const section = root.querySelector('[data-testid="job-posting-section__section"]')!
    expect(visible(rail)).toBe(true)
    expect(box(rail).bottom).toBeLessThanOrEqual(box(section).top + 1)
  })

  it('HeroFormSection puts the first field before the highlights on a phone', async () => {
    const root = await mountAt(HeroFormDefault, 320)
    const field = root.querySelector('form input')!
    const highlight = root.querySelector('[data-testid="feature-item"]')!
    expect(box(field).top).toBeLessThan(box(highlight).top)
  })

  it('Quote spaces its actions and starts its attribution on the quotation edge', async () => {
    const root = await mountAt(LogoWallRegistry, 1280)
    const quote = root.querySelector<HTMLElement>('[data-testid="quote"]')!
    const buttons = Array.from(quote.querySelectorAll('[data-testid="button"]'))
    expect(buttons.length).toBeGreaterThanOrEqual(2)
    const [first, second] = buttons.map(box)
    const gap = Math.min(
      Math.abs(second!.left - first!.right),
      Math.abs(second!.top - first!.bottom)
    )
    expect(gap).toBeGreaterThanOrEqual(8)
    const name = quote.querySelector('[data-testid="quote__name"]')!
    expect(
      Math.abs(box(name).left - box(quote.querySelector('blockquote')!).left)
    ).toBeLessThanOrEqual(1)
  })

  it('SubjectGridSection ends its grid flush: the closing cell fills its row', async () => {
    const root = await mountAt(SubjectGridDefault, 1280)
    const grid = root.querySelector<HTMLElement>('[data-testid="card-grid"]')!
    const cells = Array.from(grid.children)
    const last = box(cells.at(-1)!)
    expect(Math.abs(last.right - box(grid).right)).toBeLessThanOrEqual(1)
    expect(Math.abs(last.bottom - box(grid).bottom)).toBeLessThanOrEqual(1)
  })

  it('MediaSplitSection insets an illustration inside its media cell', async () => {
    const root = await mountAt(MediaSplitProductMedia, 390)
    const art = await vi.waitFor(() => {
      const found = root.querySelector('svg[data-testid="illustration"]')
      expect(found).not.toBeNull()
      return found!
    })
    const cell = art.closest<HTMLElement>('[class*="group/media"]')!
    expect(box(art).right).toBeLessThanOrEqual(390)
    expect(box(cell).right - box(art).right).toBeGreaterThanOrEqual(8)
    expect(box(art).top - box(cell).top).toBeGreaterThanOrEqual(8)
  })

  it('MediaSplitSection keeps the whole vertical console scene inside its frame on desktop', async () => {
    const root = await mountAt(MediaSplitVertical, 1280)
    const cards = await vi.waitFor(() => {
      const found = Array.from(root.querySelectorAll('[class*="rounded-(--shape-card)"]')).filter(
        visible
      )
      expect(found.length).toBeGreaterThan(3)
      return found
    })
    const cell = cards[0]!.closest<HTMLElement>('[class*="group/media"]')!
    for (const card of cards) {
      expect(box(card).bottom, card.textContent ?? '').toBeLessThanOrEqual(box(cell).bottom)
    }
  })

  it('ProcessScrollSection under reduced motion fits every stage in the row on desktop', async () => {
    await commands.emulateMedia({ reducedMotion: 'reduce' })
    const root = await mountAt(ProcessScrollPinned, 1280)
    const track = root.querySelector('ol')!
    const viewport = track.parentElement!
    const stages = Array.from(track.children)
    expect(stages.length).toBeGreaterThan(3)
    for (const stage of stages) {
      expect(box(stage).right).toBeLessThanOrEqual(box(viewport).right + 1)
    }
  })

  it('TemplateGallerySection lets every card flow in the page on a phone', async () => {
    const root = await mountAt(TemplateGalleryDefault, 390)
    const region = root.querySelector<HTMLElement>('[data-testid="scroll-area"]')!
    const viewport =
      region.querySelector<HTMLElement>('[data-testid="scroll-area__viewport"]') ?? region
    expect(viewport.scrollHeight - viewport.clientHeight).toBeLessThanOrEqual(1)
  })

  it('HeroSection draws its topology inside the screen on a phone', async () => {
    const root = await mountAt(HeroTopology, 390)
    const cards = await vi.waitFor(() => {
      const found = Array.from(root.querySelectorAll('[data-testid="flow-diagram-node"]')).filter(
        visible
      )
      expect(found.length).toBeGreaterThan(0)
      return found
    })
    for (const card of cards) {
      expect(box(card).left).toBeGreaterThanOrEqual(0)
      expect(box(card).right).toBeLessThanOrEqual(390)
    }
  })
})
