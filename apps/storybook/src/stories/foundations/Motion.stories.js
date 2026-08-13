import { animate, curve, duration, useWhen } from '@aziontech/theme/animations'

import { CodeBlock, PageContainer, PageHeader } from '../../foundations/components/layout/index.js'

// Rows straight from the theme token source — the page can never drift from the catalog.
const durationRows = Object.entries(duration).map(([name, value]) => ({
  name: `duration-${name}`,
  value,
  ms: Number.parseInt(value, 10)
}))

const curveRows = Object.entries(curve).map(([name, value]) => ({ name: `ease-${name}`, value }))

// Tailwind's content scanner is a static text matcher — it cannot resolve the
// `animate-${name}` template literal below into the class names it produces at
// runtime, so any `animate-*` utility that never appears as a COMPLETE literal
// token elsewhere in the scanned source never gets its CSS rule emitted, and
// applying the class is a silent no-op. This inert literal list exists only so
// Tailwind's scanner can see every current `animate.js` key spelled out in full;
// it is never read at runtime. Keep it in sync with `animate.js` — the dev-only
// check right below throws if a key is ever added there and forgotten here.
// prettier-ignore
const TAILWIND_ANIMATE_SAFELIST = [
  'animate-spin', 'animate-ping', 'animate-pulse', 'animate-bounce',
  'animate-shimmer', 'animate-blink', 'animate-fade-in', 'animate-fade-out',
  'animate-slide-down', 'animate-highlight-fade', 'animate-popup-scale-in',
  'animate-popup-scale-out', 'animate-slide-in-left', 'animate-slide-out-left',
  'animate-slide-in-right', 'animate-slide-out-right',
  'animate-progress-indeterminate', 'animate-progress-indeterminate-short',
  'animate-flow-dash'
]

const missingFromSafelist = Object.keys(animate)
  .map((name) => `animate-${name}`)
  .filter((className) => !TAILWIND_ANIMATE_SAFELIST.includes(className))
if (missingFromSafelist.length > 0) {
  throw new Error(
    `Motion.stories.js: add ${missingFromSafelist.join(', ')} to TAILWIND_ANIMATE_SAFELIST or Tailwind never generates their CSS.`
  )
}

// Some utilities are invisible on the default primary square: shimmer animates
// background-position (needs a gradient + background-size), the progress pair animates
// inset-inline-* (needs a positioned bar inside the track), slide-down reveals height
// (needs inner content to measure), highlight-fade paints a background tint meant
// for text rows, and flow-dash drives stroke-dashoffset — an SVG presentation attribute a
// <div> does not have, so it previews on a real stroke (`stroke:` = its dasharray).
// Each gets a preview shape that actually shows the motion.
const DEFAULT_PREVIEW_CLASS = 'h-8 w-8 rounded-(--shape-elements) bg-(--primary)'

// Exit animations (fade-out, slide-out-*, popup-scale-out) end on a frame that
// differs from the element's resting style. In real usage that's invisible —
// a Vue <Transition> unmounts the element the instant the leave animation ends
// — but this catalog keeps the box mounted to allow Replay, so without an
// explicit fill-mode the box would snap back to its resting (visible) state
// right when the animation completes. Hold the end frame until Replay instead.
const HOLD_END_FRAME = { animationFillMode: 'forwards' }

const PREVIEW_OVERRIDES = {
  'fade-out': { style: HOLD_END_FRAME },
  'slide-out-left': { style: HOLD_END_FRAME },
  'slide-out-right': { style: HOLD_END_FRAME },
  'popup-scale-out': { style: HOLD_END_FRAME },
  shimmer: {
    class: 'h-8 w-20 rounded-(--shape-elements)',
    style: {
      background:
        'linear-gradient(90deg, var(--bg-surface) 25%, var(--surface-hover) 50%, var(--bg-surface) 75%)',
      backgroundSize: '200% 100%'
    }
  },
  'slide-down': {
    class: 'w-8 overflow-hidden rounded-(--shape-elements) bg-(--primary)',
    style: { interpolateSize: 'allow-keywords' },
    inner: true
  },
  'highlight-fade': {
    class:
      'rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)',
    text: 'Updated row'
  },
  'progress-indeterminate': {
    class: 'absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-(--primary)'
  },
  'progress-indeterminate-short': {
    class: 'absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-(--primary)'
  },
  // A dash cycle of 8 divides the keyframe's 24 travel, so the loop is seamless.
  'flow-dash': { stroke: '4 4' }
}

const animationRows = Object.entries(animate).map(([name, value]) => ({
  id: name,
  className: `animate-${name}`,
  value,
  useWhen: useWhen[name] ?? '',
  loops: /\binfinite\b/.test(value),
  preview: PREVIEW_OVERRIDES[name]
}))

const PANEL_RECIPE = `<Transition
  enter-active-class="animate-slide-in-left motion-reduce:animate-none"
  leave-active-class="animate-slide-out-left motion-reduce:animate-none"
>
  <aside v-if="sidebarOpen">...</aside>
</Transition>`

export default {
  title: 'Foundations/Motion',
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'The motion foundations catalog: every `animate-*` utility with its timing, its purpose, and a replayable preview — plus the `duration-*` and `ease-*` tokens they are built from. Motion confirms an action or guides attention, never decorates; every motion-bearing class pairs with a `motion-reduce:*` escape.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

export const Overview = {
  name: 'Overview',
  parameters: {
    docs: {
      description: {
        story:
          'Complete motion reference. Click Replay on a one-shot animation to run it again; looping utilities run continuously. Timing always comes from the `duration-*` / `ease-*` tokens — never a hardcoded millisecond or an inline cubic-bezier.'
      }
    }
  },
  render: () => ({
    components: { PageContainer, PageHeader, CodeBlock },
    data() {
      return {
        replayKeys: {},
        durationRows,
        curveRows,
        animationRows,
        PANEL_RECIPE,
        DEFAULT_PREVIEW_CLASS
      }
    },
    methods: {
      replay(id) {
        this.replayKeys = { ...this.replayKeys, [id]: (this.replayKeys[id] || 0) + 1 }
      }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Motion">
          Every animation in the system comes from this catalog: an <code>animate-*</code> utility built from
          the duration and easing tokens below. Pair every motion-bearing class with a
          <code>motion-reduce:*</code> escape on the same class string.
        </PageHeader>

        <section class="mb-(--spacing-xxl)">
          <h2 class="m-0 mb-(--spacing-md) text-heading-lg text-(--text-default)">Animations</h2>
          <div class="flex flex-col gap-(--spacing-sm)">
            <div
              v-for="row in animationRows"
              :key="row.id"
              class="flex items-center gap-(--spacing-md) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm)"
            >
              <div class="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) bg-(--bg-canvas)">
                <!-- An animation that drives an SVG presentation attribute (stroke-dashoffset)
                     shows nothing on a div, so it previews on a real stroke instead. -->
                <svg
                  v-if="row.preview?.stroke"
                  :key="'svg-' + (replayKeys[row.id] || 0)"
                  width="72"
                  height="2"
                  viewBox="0 0 72 2"
                  aria-hidden="true"
                >
                  <line
                    x1="0"
                    y1="1"
                    x2="72"
                    y2="1"
                    stroke-width="1"
                    :stroke-dasharray="row.preview.stroke"
                    class="stroke-(--accent)"
                    :class="row.className"
                  />
                </svg>
                <!-- This catalog's whole purpose is to preview each motion, for anyone
                     auditing it — including a visitor with reduced motion preferred.
                     So, unlike a real component, the demo intentionally omits the
                     motion-reduce:animate-none escape here; every real usage of these
                     utilities still must pair one (see the header note above). -->
                <div
                  v-else
                  :key="'div-' + (replayKeys[row.id] || 0)"
                  :class="[row.preview?.class || DEFAULT_PREVIEW_CLASS, row.className]"
                  :style="row.preview?.style"
                >
                  <template v-if="row.preview?.text">{{ row.preview.text }}</template>
                  <div v-else-if="row.preview?.inner" class="h-8 w-8"></div>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline gap-x-(--spacing-sm)">
                  <code class="text-body-md font-medium text-(--text-default)">{{ row.className }}</code>
                  <code class="text-body-sm text-(--text-secondary)">{{ row.value }}</code>
                </div>
                <p class="m-0 mt-(--spacing-xxs) text-body-sm text-(--text-secondary)">{{ row.useWhen }}</p>
              </div>
              <button
                v-if="!row.loops"
                type="button"
                class="shrink-0 cursor-pointer rounded-(--shape-elements) border border-(--border-default) bg-transparent px-(--spacing-sm) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover)"
                @click="replay(row.id)"
              >
                Replay
              </button>
            </div>
          </div>
        </section>

        <section class="mb-(--spacing-xxl)">
          <h2 class="m-0 mb-(--spacing-md) text-heading-lg text-(--text-default)">The panel recipe</h2>
          <p class="m-0 mb-(--spacing-sm) max-w-prose text-body-md text-(--text-secondary)">
            A <code>v-if</code> region never animates by itself. Wrap it in a Vue Transition and hand the
            enter/leave phases to a catalogued pair — <code>animate-slide-in-left</code> /
            <code>animate-slide-out-left</code> for a sidebar, the <code>-right</code> pair for drawers,
            <code>animate-fade-in/out</code> for in-place content.
          </p>
          <CodeBlock :code="PANEL_RECIPE" language="html" />
        </section>

        <section class="mb-(--spacing-xxl)">
          <h2 class="m-0 mb-(--spacing-md) text-heading-lg text-(--text-default)">Duration tokens</h2>
          <div class="flex flex-col gap-(--spacing-xs)">
            <div
              v-for="row in durationRows"
              :key="row.name"
              class="flex items-center gap-(--spacing-md)"
            >
              <code class="w-56 shrink-0 text-body-sm text-(--text-default)">{{ row.name }}</code>
              <code class="w-20 shrink-0 text-body-sm text-(--text-secondary)">{{ row.value }}</code>
              <div class="h-2 rounded-full bg-(--primary)" :style="{ width: Math.min(row.ms / 8, 420) + 'px' }"></div>
            </div>
          </div>
        </section>

        <section class="mb-(--spacing-xxl)">
          <h2 class="m-0 mb-(--spacing-md) text-heading-lg text-(--text-default)">Easing curves</h2>
          <div class="flex flex-col gap-(--spacing-xs)">
            <div v-for="row in curveRows" :key="row.name" class="flex items-center gap-(--spacing-md)">
              <code class="w-56 shrink-0 text-body-sm text-(--text-default)">{{ row.name }}</code>
              <code class="text-body-sm text-(--text-secondary)">{{ row.value }}</code>
            </div>
          </div>
          <p class="m-0 mt-(--spacing-sm) max-w-prose text-body-sm text-(--text-secondary)">
            Entrances decelerate (productive/expressive entrance), exits accelerate (productive/expressive exit).
            Interaction feedback stays at or under duration-moderate-01 (150ms).
          </p>
        </section>
      </PageContainer>
    `
  })
}
