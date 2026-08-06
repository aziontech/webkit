import { composeStories } from '@storybook/vue3'
import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/illustration/Illustration.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Illustration, {
  IllustrationBox,
  IllustrationBranch,
  IllustrationChart,
  IllustrationConnector,
  IllustrationElbow,
  IllustrationGauge,
  IllustrationList,
  IllustrationNode,
  IllustrationPill,
  IllustrationSurface,
  IllustrationWindow
} from './index'

const { Default, Active } = composeStories(stories)

/** A realistic composed scene, mirroring the Storybook `Composed` story. */
const scene = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: {
      Illustration,
      IllustrationBox,
      IllustrationNode,
      IllustrationConnector,
      IllustrationPill,
      IllustrationWindow
    },
    setup() {
      return { props }
    },
    template: `
      <Illustration v-bind="props">
        <IllustrationWindow kind="chat" />
        <IllustrationConnector kind="dashed" animated />
        <IllustrationNode kind="dashed" />
        <IllustrationBox icon="ai ai-edge-application" />
        <IllustrationPill icon="ai ai-real-time-metrics" label="Metrics" />
      </Illustration>
    `
  })

// Queries are scoped to each render's own container: testing-library's `view.getByTestId`
// searches the whole document, so two renders in one test would collide.
const at = (view: ReturnType<typeof render>) => within(view.container)

const part = (view: ReturnType<typeof render>, name: string) =>
  at(view).getByTestId(`content-illustration-${name}`)

const parts = (view: ReturnType<typeof render>, name: string) =>
  at(view).getAllByTestId(`content-illustration-${name}`)

describe('Illustration (compound / provide-inject)', () => {
  // ---- Compound API ----------------------------------------------------------
  it('attaches every part to the compound root for dot-notation', () => {
    expect(Illustration.Box).toBe(IllustrationBox)
    expect(Illustration.Node).toBe(IllustrationNode)
    expect(Illustration.Connector).toBe(IllustrationConnector)
    expect(Illustration.Elbow).toBe(IllustrationElbow)
    expect(Illustration.Branch).toBe(IllustrationBranch)
    expect(Illustration.Pill).toBe(IllustrationPill)
    expect(Illustration.Window).toBe(IllustrationWindow)
    expect(Illustration.Surface).toBe(IllustrationSurface)
    expect(Illustration.Gauge).toBe(IllustrationGauge)
    expect(Illustration.Chart).toBe(IllustrationChart)
    expect(Illustration.List).toBe(IllustrationList)
  })

  // ---- Root render + testid --------------------------------------------------
  it('renders the root with the derived testid and the default scale', () => {
    const view = render(scene())
    const root = at(view).getByTestId('content-illustration')
    expect(root).toBeTruthy()
    expect(root.getAttribute('data-size')).toBe('medium')
    expect(root.getAttribute('data-active')).toBeNull()
  })

  it('lets a consumer-supplied data-testid win over the derived fallback', () => {
    const view = render(scene({ 'data-testid': 'empty-state-art' }))
    expect(at(view).getByTestId('empty-state-art')).toBeTruthy()
    expect(at(view).queryByTestId('content-illustration')).toBeNull()
  })

  it('merges a consumer class onto the root instead of replacing its own', () => {
    const view = render(scene({ class: 'w-[400px]' }))
    const root = at(view).getByTestId('content-illustration')
    expect(root.className).toContain('w-[400px]')
    expect(root.className).toContain('items-center')
  })

  // ---- size / active flow to every part through context ----------------------
  it.each(['small', 'medium', 'large'])('propagates size=%s to every part', (size) => {
    const view = render(scene({ size }))
    expect(at(view).getByTestId('content-illustration').getAttribute('data-size')).toBe(size)
    expect(part(view, 'box').getAttribute('data-size')).toBe(size)
    expect(part(view, 'pill').getAttribute('data-size')).toBe(size)
  })

  it('clamps the window up to medium when the scene is small', () => {
    const view = render(scene({ size: 'small' }))
    expect(part(view, 'window').getAttribute('data-size')).toBe('medium')
  })

  it('propagates active to every part', () => {
    const view = render(scene({ active: true }))
    for (const name of ['box', 'node', 'connector', 'pill', 'window']) {
      expect(part(view, name).getAttribute('data-active')).toBe('true')
    }
  })

  it('leaves every part resting when the scene is not active', () => {
    const view = render(scene())
    for (const name of ['box', 'node', 'connector', 'pill', 'window']) {
      expect(part(view, name).getAttribute('data-active')).toBeNull()
    }
  })

  it("lets a part's own active win over the scene default, in both directions", () => {
    const view = render(
      defineComponent({
        components: { Illustration, IllustrationBox },
        template: `
          <Illustration active>
            <IllustrationBox data-testid="focal" />
            <IllustrationBox data-testid="muted" :active="false" />
          </Illustration>
        `
      })
    )
    expect(at(view).getByTestId('focal').getAttribute('data-active')).toBe('true')
    expect(at(view).getByTestId('muted').getAttribute('data-active')).toBeNull()
  })

  it("lets a part's own size win over the scene default", () => {
    const view = render(
      defineComponent({
        components: { Illustration, IllustrationBox },
        template: `
          <Illustration size="large">
            <IllustrationBox data-testid="inherited" />
            <IllustrationBox data-testid="overridden" size="small" />
          </Illustration>
        `
      })
    )
    expect(at(view).getByTestId('inherited').getAttribute('data-size')).toBe('large')
    expect(at(view).getByTestId('overridden').getAttribute('data-size')).toBe('small')
  })

  // ---- Parts render standalone (the tree-shakeable flat exports) -------------
  it('renders a part with no root above it, falling back to medium and resting', () => {
    const view = render(IllustrationBox, { props: { icon: 'ai ai-edge-application' } })
    const box = part(view, 'box')
    expect(box.getAttribute('data-size')).toBe('medium')
    expect(box.getAttribute('data-active')).toBeNull()
  })

  // ---- Part variants → data-* ------------------------------------------------
  it.each(['solid', 'dashed'])('maps node kind=%s to data-kind', (kind) => {
    const view = render(IllustrationNode, { props: { kind } })
    expect(part(view, 'node').getAttribute('data-kind')).toBe(kind)
  })

  it.each(['icon', 'chat', 'website'])('maps window kind=%s to data-kind', (kind) => {
    const view = render(IllustrationWindow, { props: { kind } })
    expect(part(view, 'window').getAttribute('data-kind')).toBe(kind)
  })

  it.each(['horizontal', 'vertical'])(
    'maps connector orientation=%s to data-orientation',
    (orientation) => {
      const view = render(IllustrationConnector, { props: { orientation } })
      expect(part(view, 'connector').getAttribute('data-orientation')).toBe(orientation)
    }
  )

  // ---- Connector geometry + flow ---------------------------------------------
  it('dashes only the dashed connector, on a cycle that divides the flow keyframe', () => {
    const dashed = render(IllustrationConnector, { props: { kind: 'dashed' } })
    expect(part(dashed, 'connector').querySelector('line')?.getAttribute('stroke-dasharray')).toBe(
      '2 2'
    )

    const solid = render(IllustrationConnector, { props: { kind: 'solid' } })
    expect(part(solid, 'connector').querySelector('line')).not.toHaveAttribute('stroke-dasharray')
  })

  it('marks the connector animated only when it is dashed', () => {
    const flowing = render(IllustrationConnector, { props: { kind: 'dashed', animated: true } })
    expect(part(flowing, 'connector').getAttribute('data-animated')).toBe('true')

    // `animated` on a solid line has nothing to march, so it stays off.
    const solid = render(IllustrationConnector, { props: { kind: 'solid', animated: true } })
    expect(part(solid, 'connector').getAttribute('data-animated')).toBeNull()
  })

  it('draws the connector along its orientation', () => {
    const horizontal = render(IllustrationConnector)
    const hLine = part(horizontal, 'connector').querySelector('line')
    expect(hLine?.getAttribute('x2')).toBe('100%')
    expect(hLine?.getAttribute('y1')).toBe('50%')

    const vertical = render(IllustrationConnector, { props: { orientation: 'vertical' } })
    const vLine = part(vertical, 'connector').querySelector('line')
    expect(vLine?.getAttribute('x1')).toBe('50%')
    expect(vLine?.getAttribute('y2')).toBe('100%')
  })

  // ---- Slots vs props on the parts -------------------------------------------
  it('renders the pill label, and lets the default slot replace it', () => {
    const fromProp = render(IllustrationPill, { props: { label: 'Metrics' } })
    expect(at(fromProp).getByTestId('content-illustration-pill__label').textContent?.trim()).toBe(
      'Metrics'
    )

    const fromSlot = render(IllustrationPill, {
      props: { label: 'Metrics' },
      slots: { default: 'Requests' }
    })
    expect(at(fromSlot).getByTestId('content-illustration-pill__label').textContent?.trim()).toBe(
      'Requests'
    )
  })

  it('renders the box glyph from icon, and lets the default slot replace it', () => {
    const fromProp = render(IllustrationBox, { props: { icon: 'ai ai-edge-application' } })
    expect(part(fromProp, 'box').querySelector('i.ai-edge-application')).toBeTruthy()

    const fromSlot = render(IllustrationBox, {
      props: { icon: 'ai ai-edge-application' },
      slots: { default: '<span data-testid="custom-glyph" />' }
    })
    expect(at(fromSlot).getByTestId('custom-glyph')).toBeTruthy()
    expect(part(fromSlot, 'box').querySelector('i.ai-edge-application')).toBeNull()
  })

  it('keeps the window chrome when the default slot replaces the scene', () => {
    const view = render(IllustrationWindow, {
      props: { kind: 'website' },
      slots: { default: '<span data-testid="custom-scene" />' }
    })
    expect(at(view).getByTestId('custom-scene')).toBeTruthy()
    // The three status dots are the chrome; they live outside the slot.
    expect(part(view, 'window').querySelectorAll('span[class*="rounded-full"]').length).toBe(3)
  })

  // ---- Asset registry --------------------------------------------------------
  it('resolves a registered name to its asset and ignores the default slot', async () => {
    const view = render(
      defineComponent({
        components: { Illustration },
        template: `
          <Illustration name="ship">
            <span data-testid="fallback" />
          </Illustration>
        `
      })
    )
    await waitFor(() => expect(part(view, 'window')).toBeTruthy())
    expect(at(view).queryByTestId('fallback')).toBeNull()
  })

  // Every registered asset, and the part each one must actually render. Keeps the registry
  // and the library honest: a new asset that forgets to compose from parts fails here.
  it.each([
    ['functions', 'window'],
    ['ai-inference', 'window'],
    ['image-processor', 'window'],
    ['edge-storage', 'elbow'],
    ['waf-rules', 'box'],
    ['path', 'branch'],
    ['sql-database', 'box'],
    ['azion-highlight', 'surface'],
    ['ship', 'window'],
    ['api-keys', 'list'],
    ['traffic-chart', 'chart'],
    ['optimize-application', 'gauge'],
    ['build', 'window'],
    ['deploy', 'window'],
    ['bot-manager', 'box']
  ])('renders the registered asset %s from parts only', async (name, expectedPart) => {
    const view = render(Illustration, { props: { name } })
    await waitFor(() => expect(parts(view, expectedPart).length).toBeGreaterThan(0))
  })

  it('renders every registered asset on the shared canvas', async () => {
    const view = render(Illustration, { props: { name: 'ship' } })
    await waitFor(() => expect(part(view, 'window')).toBeTruthy())
    const canvas = at(view).getByTestId('content-illustration').firstElementChild as HTMLElement
    // The canvas is the frame every asset is authored against, from the theme tokens.
    expect(canvas.className).toContain('--illustration-canvas-width')
    expect(canvas.className).toContain('--illustration-canvas-height')
  })

  it('places the three pipeline-stage assets on one anatomy', async () => {
    for (const name of ['ship', 'build', 'deploy']) {
      const view = render(Illustration, { props: { name } })
      await waitFor(() => expect(part(view, 'window')).toBeTruthy())
      expect(part(view, 'window').getAttribute('data-kind')).toBe('website')
      expect(part(view, 'window').getAttribute('data-active')).toBe('true')
      expect(part(view, 'pill').getAttribute('data-size')).toBe('large')
      expect(part(view, 'box').getAttribute('data-size')).toBe('small')
    }
  })

  it('renders nothing and warns for an unregistered name, without throwing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const view = render(Illustration, { props: { name: 'does-not-exist' } })
    expect(at(view).getByTestId('content-illustration').children.length).toBe(0)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('does-not-exist'))
    warn.mockRestore()
  })

  it('falls back to the composed slot when name is empty', () => {
    const view = render(scene())
    expect(part(view, 'window')).toBeTruthy()
  })

  // ---- ARIA ------------------------------------------------------------------
  it('is decorative and hidden from assistive tech by default', () => {
    const view = render(scene())
    const root = at(view).getByTestId('content-illustration')
    expect(root.getAttribute('role')).toBe('presentation')
    expect(root.getAttribute('aria-hidden')).toBe('true')
    expect(root.getAttribute('aria-label')).toBeNull()
  })

  it('becomes a named image when ariaLabel is supplied', () => {
    const view = render(scene({ ariaLabel: 'Nothing deployed yet' }))
    const root = at(view).getByTestId('content-illustration')
    expect(root.getAttribute('role')).toBe('img')
    expect(root.getAttribute('aria-label')).toBe('Nothing deployed yet')
    expect(root.getAttribute('aria-hidden')).toBeNull()
  })

  it('hides every decorative glyph and the animated connector from assistive tech', () => {
    const view = render(scene({ ariaLabel: 'Deploy path' }))
    for (const glyph of at(view).getByTestId('content-illustration').querySelectorAll('i')) {
      expect(glyph.getAttribute('aria-hidden')).toBe('true')
    }
    expect(part(view, 'connector').getAttribute('aria-hidden')).toBe('true')
  })

  // ---- a11y ------------------------------------------------------------------
  it('has no a11y violations when decorative', async () => {
    const { container } = render(scene())
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when named', async () => {
    const { container } = render(scene({ ariaLabel: 'Nothing deployed yet' }))
    await expectNoA11yViolations(container)
  })

  // ---- The parts that carry their own geometry -------------------------------
  it.each(['top-left', 'top-right', 'bottom-left', 'bottom-right'])(
    'turns the elbow through the %s corner',
    (corner) => {
      const view = render(IllustrationElbow, { props: { corner } })
      expect(part(view, 'elbow').getAttribute('data-corner')).toBe(corner)
    }
  )

  it.each(['up', 'down'])('curves the branch %s', (direction) => {
    const view = render(IllustrationBranch, { props: { direction } })
    const el = part(view, 'branch')
    expect(el.getAttribute('data-direction')).toBe(direction)
    // A cubic with horizontal tangents at both ends, so it meets trunk and label flat.
    expect(el.querySelector('path')?.getAttribute('d')).toContain('C')
  })

  it('marks the accent branch so it can take the accent stroke', () => {
    const view = render(IllustrationBranch, { props: { accent: true } })
    expect(part(view, 'branch').getAttribute('data-accent')).toBe('true')
  })

  it.each(['filled', 'outline'])('renders the %s surface', (kind) => {
    const view = render(IllustrationSurface, { props: { kind } })
    expect(part(view, 'surface').getAttribute('data-kind')).toBe(kind)
  })

  it.each(['rounded', 'square'])('gives the surface a %s corner treatment', (shape) => {
    const view = render(IllustrationSurface, { props: { shape } })
    expect(part(view, 'surface').getAttribute('data-shape')).toBe(shape)
  })

  it.each(['rounded', 'square'])('gives the box a %s corner treatment', (shape) => {
    const view = render(IllustrationBox, { props: { shape } })
    expect(part(view, 'box').getAttribute('data-shape')).toBe(shape)
  })

  it.each(['default', 'strong'])('marks the node emphasis %s', (emphasis) => {
    const view = render(IllustrationNode, { props: { emphasis } })
    expect(part(view, 'node').getAttribute('data-emphasis')).toBe(emphasis)
  })

  it('frames azion-highlight with square outlines pinned by strong nodes', async () => {
    const view = render(Illustration, { props: { name: 'azion-highlight' } })
    await waitFor(() => expect(parts(view, 'surface').length).toBe(2))
    for (const frame of parts(view, 'surface')) {
      expect(frame.getAttribute('data-kind')).toBe('outline')
      expect(frame.getAttribute('data-shape')).toBe('square')
    }
    for (const node of parts(view, 'node')) {
      expect(node.getAttribute('data-emphasis')).toBe('strong')
    }
  })

  it('fills the gauge arc in proportion to its value and clamps out of range', () => {
    const circumference = 2 * Math.PI * 40
    const arcFor = (value: number) => {
      const view = render(IllustrationGauge, { props: { value } })
      const arc = part(view, 'gauge').querySelectorAll('circle')[1]
      return Number(arc?.getAttribute('stroke-dasharray')?.split(' ')[0])
    }
    expect(arcFor(0)).toBeCloseTo(0)
    expect(arcFor(50)).toBeCloseTo(circumference / 2)
    expect(arcFor(100)).toBeCloseTo(circumference)
    // Out-of-range values clamp rather than drawing a second lap or a negative arc.
    expect(arcFor(140)).toBeCloseTo(circumference)
    expect(arcFor(-20)).toBeCloseTo(0)
  })

  it.each(['success', 'warning', 'danger', 'info'])(
    'colors the gauge arc by severity %s',
    (severity) => {
      const view = render(IllustrationGauge, { props: { severity } })
      expect(part(view, 'gauge').getAttribute('data-severity')).toBe(severity)
    }
  )

  it('renders the gauge label only when one is given', () => {
    const withLabel = render(IllustrationGauge, { props: { label: '100' } })
    expect(part(withLabel, 'gauge').textContent?.trim()).toBe('100')
    const bare = render(IllustrationGauge)
    expect(part(bare, 'gauge').textContent?.trim()).toBe('')
  })

  it('renders one chart column and marker per data point, emphasizing the highlight', () => {
    const view = render(IllustrationChart, {
      props: { data: [1, 5, 3, 9], labels: ['a', 'b', 'c', 'd'], highlight: 3 }
    })
    const chart = part(view, 'chart')
    expect(chart.querySelectorAll('[data-testid$="__column"]')).toHaveLength(4)
    expect(chart.querySelectorAll('[data-testid$="__marker"]')).toHaveLength(4)
    const columns = chart.querySelectorAll('[data-testid$="__column"]')
    expect(columns[3]?.getAttribute('data-highlight')).toBe('true')
    expect(columns[0]?.getAttribute('data-highlight')).toBeNull()
    // The polyline carries one point per datum.
    expect(chart.querySelector('polyline')?.getAttribute('points')?.split(' ')).toHaveLength(4)
  })

  it('renders an empty chart without throwing', () => {
    const view = render(IllustrationChart, { props: { data: [] } })
    expect(part(view, 'chart').querySelectorAll('[data-testid$="__marker"]')).toHaveLength(0)
  })

  it('renders one list row per record and emphasizes the highlight', () => {
    const rows = [
      { label: 'Prod', value: 'key_1', status: 'active' },
      { label: 'Test', value: 'key_2', status: 'revoked' }
    ]
    const view = render(IllustrationList, { props: { rows, highlight: 1 } })
    const list = part(view, 'list')
    const rendered = list.querySelectorAll('[data-testid$="__row"]')
    expect(rendered).toHaveLength(2)
    expect(rendered[1]?.getAttribute('data-highlight')).toBe('true')
    expect(rendered[0]?.getAttribute('data-highlight')).toBeNull()
    expect(list.textContent).toContain('key_1')
  })

  // ---- Stories as fixtures ---------------------------------------------------
  it('renders the Default story and its resolved asset', async () => {
    const view = render(Default())
    await waitFor(() => expect(part(view, 'window')).toBeTruthy())
    expect(at(view).getByTestId('content-illustration').getAttribute('data-size')).toBe('large')
  })

  it('renders the Active story with the scene emphasized', async () => {
    const view = render(Active())
    await waitFor(() => expect(part(view, 'box')).toBeTruthy())
    expect(at(view).getByTestId('content-illustration').getAttribute('data-active')).toBe('true')
    expect(part(view, 'box').getAttribute('data-active')).toBe('true')
  })
})
