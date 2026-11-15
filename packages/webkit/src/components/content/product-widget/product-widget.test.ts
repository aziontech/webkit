import { render, within } from '@testing-library/vue'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { computed, createSSRApp, defineComponent, h, nextTick, onMounted, provide, ref } from 'vue'
import { renderToString, type SSRContext } from 'vue/server-renderer'

import Default from '../../../../examples/product-widget/default.vue'
import Types from '../../../../examples/product-widget/variants.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { useHydrationHost } from '../../../test/hydration-shared'
import { ProductWidgetInjectionKey } from './injection-key'
import DeploymentLogs from './parts/deployment-logs.vue'
import ProductWidget, { type ProductWidgetName } from './product-widget.vue'
import { productWidgets } from './registry'
import ObjectStorageBrowser from './widgets/object-storage-browser-fragment.vue'

const TESTID = 'content-product-widget'
const FRAME_TESTID = 'content-shell-mockup'
const WINDOW_TESTID = `${TESTID}__frame`
const BODY_TESTID = `${TESTID}__frame-body`
const NAMES = Object.keys(productWidgets) as ProductWidgetName[]

const reducedMotion = () => globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

const FIXTURE_CSS = `
  [data-testid='${FRAME_TESTID}'] { position: relative; }
  [data-testid='${FRAME_TESTID}'] > :first-child { position: absolute; }
`

const host = (props: Record<string, unknown>) =>
  defineComponent({
    components: { ProductWidget },
    setup: () => ({ props }),
    template: `
      <div style="width: 860px; height: 480px">
        <ProductWidget v-bind="props" />
      </div>
    `
  })

const frameOf = (view: ReturnType<typeof render>) =>
  within(view.container).findByTestId(FRAME_TESTID, {}, { timeout: 5000 })

const windowOf = (view: ReturnType<typeof render>) =>
  within(view.container).findByTestId(WINDOW_TESTID, {}, { timeout: 5000 })

const barText = (plated: HTMLElement) =>
  (plated.textContent ?? '').replace(within(plated).getByTestId(BODY_TESTID).textContent ?? '', '')

describe('ProductWidget', () => {
  describe('basics', () => {
    let fixtureSheet: globalThis.HTMLStyleElement

    beforeAll(() => {
      fixtureSheet = document.createElement('style')
      fixtureSheet.textContent = FIXTURE_CSS
      document.head.appendChild(fixtureSheet)
    })

    afterAll(() => {
      fixtureSheet.remove()
    })

    it('renders the default story under the fallback testid and draws its widget', async () => {
      const view = render(Default)
      const root = view.getByTestId(TESTID)

      expect(root.getAttribute('data-name')).toBe('workloads-list')
      expect(root.contains(await frameOf(view))).toBe(true)
    })

    it('lets a consumer data-testid win over the fallback', () => {
      const view = render(host({ name: 'workloads-list', 'data-testid': 'workloads-band' }))

      expect(view.getByTestId('workloads-band')).toBeInTheDocument()
      expect(view.queryByTestId(TESTID)).toBeNull()
    })

    it('keeps the widget plating when variant is unset', async () => {
      const framed = render(host({ name: 'workloads-list' }))
      expect((await frameOf(framed)).getAttribute('data-variant')).toBe('window')
      framed.unmount()

      const bare = render(host({ name: 'workload-rollout-rows' }))
      expect((await frameOf(bare)).getAttribute('data-variant')).toBe('bare')
    })

    it('forwards variant and fade to a widget that declares them', async () => {
      const view = render(host({ name: 'workloads-list', variant: 'bare', fade: 'bottom' }))
      const frame = await frameOf(view)

      expect(frame.getAttribute('data-variant')).toBe('bare')
      expect(frame.getAttribute('data-fade')).toBe('bottom')
    })

    it('renders both plates in the Types story', async () => {
      const view = render(Types)

      await expect
        .poll(
          () =>
            Array.from(view.container.querySelectorAll(`[data-testid="${TESTID}"]`)).map((root) => [
              root.getAttribute('data-name'),
              root.getAttribute('data-variant'),
              root
                .querySelector(`[data-testid="${WINDOW_TESTID}"]`)
                ?.getAttribute('data-variant') ??
                root.querySelector(`[data-testid="${FRAME_TESTID}"]`)?.getAttribute('data-variant')
            ]),
          { timeout: 3000 }
        )
        .toEqual([
          ['workload-topology', null, 'window'],
          ['workload-topology', null, 'bare'],
          ['edge-dns-record', 'window', 'window'],
          ['edge-dns-record', 'bare', 'bare']
        ])
    })

    it('frames a fragment the registry plates as a window, titled with its module', async () => {
      const view = render(host({ name: 'data-stream-source' }))
      const plated = await windowOf(view)
      const root = view.getByTestId(TESTID)

      expect(root.getAttribute('data-variant')).toBe('window')
      expect(plated.getAttribute('data-variant')).toBe('window')
      expect(plated.getAttribute('data-fade')).toBe('bottom')
      expect(plated.hasAttribute('inert')).toBe(true)
      expect(plated.getAttribute('aria-hidden')).toBe('true')
      expect(barText(plated)).toContain('Data Stream')
      expect(
        within(plated)
          .getByTestId(BODY_TESTID)
          .contains(await frameOf(view))
      ).toBe(true)
    })

    it('resets the fade color and start to the window body for the fragment inside', async () => {
      const view = render(host({ name: 'waf-allowed-rule' }))
      const plated = await windowOf(view)
      const body = within(plated).getByTestId(BODY_TESTID)

      expect(body.style.getPropertyValue('--mockup-fade-color')).toBe('var(--bg-canvas)')
      expect(body.style.getPropertyValue('--mockup-fade-start')).toBe('initial')
      expect(plated.style.getPropertyValue('--mockup-fade-start')).toBe('80%')
    })

    it('draws a fragment the registry plates bare without a window', async () => {
      const view = render(host({ name: 'waf-threat' }))
      await frameOf(view)

      expect(view.getByTestId(TESTID).getAttribute('data-variant')).toBe('bare')
      expect(view.queryByTestId(WINDOW_TESTID)).toBeNull()
    })

    it('lets variant override the plating of a fragment either way', async () => {
      const bare = render(host({ name: 'data-stream-source', variant: 'bare' }))
      await frameOf(bare)
      expect(bare.getByTestId(TESTID).getAttribute('data-variant')).toBe('bare')
      expect(bare.queryByTestId(WINDOW_TESTID)).toBeNull()
      bare.unmount()

      const framed = render(host({ name: 'waf-threat', variant: 'window' }))
      const plated = await windowOf(framed)
      expect(framed.getByTestId(TESTID).getAttribute('data-variant')).toBe('window')
      expect(barText(plated)).toContain('WAF')
    })

    it('drops the console bar of a framed fragment when chrome is off', async () => {
      const view = render(host({ name: 'edge-dns-record', chrome: false }))
      const plated = await windowOf(view)

      expect(barText(plated)).not.toContain('Edge DNS')
    })

    it('leaves data-variant off the root of a workload screen and never frames one', async () => {
      const view = render(host({ name: 'workloads-list' }))
      await frameOf(view)

      expect(view.getByTestId(TESTID).hasAttribute('data-variant')).toBe(false)
      expect(view.queryByTestId(WINDOW_TESTID)).toBeNull()
    })

    it('does not warn when variant and chrome plate a fragment', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const view = render(host({ name: 'waf-threat', variant: 'window', chrome: false }))
      await windowOf(view)

      expect(warn.mock.calls.flat().join(' ')).not.toContain('no effect')
      warn.mockRestore()
    })

    it('has no axe violations around a framed fragment', async () => {
      const view = render(host({ name: 'edge-dns-record' }))
      await windowOf(view)

      await expectNoA11yViolations(view.container)
    })

    it('never leaks a prop the widget does not declare onto its root', async () => {
      const view = render(
        host({ name: 'workloads-list', hovered: true, autoplayInterval: 80, tab: 'deploy' })
      )
      const frame = await frameOf(view)

      expect(frame.hasAttribute('hovered')).toBe(false)
      expect(frame.hasAttribute('autoplay-interval')).toBe(false)
      expect(frame.hasAttribute('tab')).toBe(false)
    })

    it('swaps the widget when name changes', async () => {
      const name = ref<ProductWidgetName>('workloads-list')
      const Host = defineComponent({
        components: { ProductWidget },
        setup: () => ({ name }),
        template: '<div style="width: 860px; height: 480px"><ProductWidget :name="name" /></div>'
      })
      const view = render(Host)
      expect((await frameOf(view)).getAttribute('data-variant')).toBe('window')

      name.value = 'workload-rollout-rows'
      await nextTick()

      expect(view.getByTestId(TESTID).getAttribute('data-name')).toBe('workload-rollout-rows')
      await expect
        .poll(() =>
          view.container
            .querySelector(`[data-testid="${FRAME_TESTID}"]`)
            ?.getAttribute('data-variant')
        )
        .toBe('bare')
    })

    it('clears the earlier widget when the next one fails to load', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const failed = new Error('chunk failed')
      const load = vi
        .spyOn(productWidgets, 'workload-topology-chain')
        .mockImplementation(() => Promise.reject(failed))
      const name = ref<ProductWidgetName>('workloads-list')
      const Host = defineComponent({
        components: { ProductWidget },
        setup: () => ({ name }),
        template: '<div style="width: 860px; height: 480px"><ProductWidget :name="name" /></div>'
      })
      const view = render(Host)
      await frameOf(view)

      name.value = 'workload-topology-chain'
      await nextTick()
      const root = view.getByTestId(TESTID)

      expect(root.getAttribute('data-name')).toBe('workload-topology-chain')
      expect(root.children).toHaveLength(0)
      await expect
        .poll(() => warn.mock.calls.some(([message]) => String(message).includes('could not load')))
        .toBe(true)
      expect(root.children).toHaveLength(0)

      load.mockRestore()
      warn.mockRestore()
    })

    it('draws a fragment collaborator cursor by default', async () => {
      const view = render(host({ name: 'data-stream-source' }))
      const frame = await frameOf(view)

      expect(frame.textContent).toContain('Priya')
    })

    it('hides the collaborator cursor when cursor is off, and still draws the fragment', async () => {
      const view = render(host({ name: 'data-stream-source', cursor: false }))
      const frame = await frameOf(view)

      expect(frame.textContent).toContain('Data Source')
      expect(frame.textContent).not.toContain('Priya')
    })

    it('warns in development when chrome is set on a bare fragment', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const view = render(host({ name: 'waf-threat', chrome: false }))
      await frameOf(view)

      expect(warn).toHaveBeenCalledWith(expect.stringContaining('chrome has no effect'))
      warn.mockRestore()
    })

    it('warns in development when a plating prop is set on a fragment that ignores it', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const view = render(host({ name: 'data-stream-source', width: 720, fade: 'top' }))
      await frameOf(view)

      expect(warn).toHaveBeenCalledWith(expect.stringContaining('width, fade have no effect'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('name="data-stream-source"'))
      warn.mockRestore()
    })

    it('does not warn when the widget reads every plating prop it is given', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const view = render(
        host({ name: 'workloads-list', variant: 'bare', fade: 'bottom', width: 720 })
      )
      await frameOf(view)

      expect(warn.mock.calls.flat().join(' ')).not.toContain('has no effect')
      expect(warn.mock.calls.flat().join(' ')).not.toContain('have no effect')
      warn.mockRestore()
    })

    it('warns and draws nothing for a name outside the registry', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const view = render(host({ name: 'not-a-widget' }))
      await nextTick()

      expect(view.getByTestId(TESTID).children).toHaveLength(0)
      expect(warn).toHaveBeenCalledWith(
        '[webkit] <ProductWidget>: no widget registered under name "not-a-widget".'
      )
      warn.mockRestore()
    })

    it('holds the deploy logs still while they are off screen', async () => {
      const Host = defineComponent({
        components: { ProductWidget },
        template: `
        <div>
          <div style="height: 300vh"></div>
          <div style="width: 600px; height: 480px">
            <ProductWidget name="workload-deploy-logs" :autoplay-interval="40" />
          </div>
        </div>
      `
      })
      const view = render(Host)
      const frame = await frameOf(view)
      const drawn = frame.textContent

      await new Promise((resolve) => globalThis.setTimeout(resolve, 600))
      expect(frame.textContent).toBe(drawn)

      if (reducedMotion()) return
      frame.scrollIntoView()
      await expect.poll(() => frame.textContent).not.toBe(drawn)
    })

    it.each(NAMES)('draws %s inside a shell mockup', async (name) => {
      const view = render(host({ name }))
      const frame = await frameOf(view)

      expect(view.getByTestId(TESTID).contains(frame)).toBe(true)
      expect(frame.hasAttribute('inert')).toBe(name !== 'function-code')
    })

    it('has no axe violations', async () => {
      const view = render(Default)
      await frameOf(view)

      await expectNoA11yViolations(view.container)
    })

    it('has no axe violations in function-code, the one widget exposed to assistive technology', async () => {
      const view = render(host({ name: 'function-code' }))
      const frame = await frameOf(view)

      expect(frame.hasAttribute('aria-hidden')).toBe(false)
      expect(within(frame).getAllByRole('button').length).toBeGreaterThan(0)
      await expectNoA11yViolations(view.container)
    })
  })

  describe('scenes on a touch screen', () => {
    const touchScreen = (query: string) => ({
      matches: query === '(hover: none)',
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined
    })

    const Scene = defineComponent({
      setup() {
        provide(ProductWidgetInjectionKey, { cursor: computed(() => false) })
        return () => h(ObjectStorageBrowser)
      }
    })

    const { hydrate } = useHydrationHost()

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('hydrates the server render without a mismatch, then shows the last frame', async () => {
      vi.stubGlobal('matchMedia', undefined)
      const ctx: SSRContext = {}
      const html = await renderToString(createSSRApp(Scene), ctx)
      expect(html).not.toContain('data-cursor="row-.."')
      vi.stubGlobal('matchMedia', touchScreen)
      const shown: boolean[] = []
      const Probe = defineComponent({
        setup() {
          onMounted(() =>
            nextTick(() => shown.push(Boolean(document.querySelector('[data-cursor="row-.."]'))))
          )
          return () => h(Scene)
        }
      })

      const mismatches = await hydrate(Probe, html, ctx.teleports ?? {})

      expect(mismatches, mismatches.join('\n')).toEqual([])
      expect(shown).toEqual([true])
    })
  })

  describe('deploy logs', () => {
    it('marks each step with a job status and lets a fragment take hovered', async () => {
      const view = render(DeploymentLogs, { props: { failAt: 'build' } })
      const status = (title: string) =>
        view.getByText(title, { selector: 'span[data-status]' }).getAttribute('data-status')

      expect(status('Clone Template')).toBe('success')
      expect(status('Build')).toBe('error')
      expect(status('Upload')).toBe('skipped')

      const { default: fragment } = await import('./widgets/edge-dns-record-fragment.vue')
      const declared = Object.keys((fragment as { props?: object }).props ?? {})
      expect(declared).toContain('hovered')
      expect(declared).not.toContain('hover')
    })
  })
})
