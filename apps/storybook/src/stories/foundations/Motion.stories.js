import { animate, curve, duration, useWhen } from '@aziontech/theme/animations'

import { CodeBlock, PageContainer, PageHeader } from '../../foundations/components/layout/index.js'

// Rows straight from the theme token source — the page can never drift from the catalog.
const durationRows = Object.entries(duration).map(([name, value]) => ({
  name: `duration-${name}`,
  value,
  ms: Number.parseInt(value, 10)
}))

const curveRows = Object.entries(curve).map(([name, value]) => ({ name: `ease-${name}`, value }))

const animationRows = Object.entries(animate).map(([name, value]) => ({
  id: name,
  className: `animate-${name}`,
  value,
  useWhen: useWhen[name] ?? '',
  loops: /\binfinite\b/.test(value)
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
    layout: 'fullscreen',
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
      return { replayKeys: {}, durationRows, curveRows, animationRows, PANEL_RECIPE }
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

        <section class="mb-[var(--spacing-xxl)]">
          <h2 class="m-0 mb-[var(--spacing-md)] text-heading-lg text-[var(--text-default)]">Animations</h2>
          <div class="flex flex-col gap-[var(--spacing-sm)]">
            <div
              v-for="row in animationRows"
              :key="row.id"
              class="flex items-center gap-[var(--spacing-md)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-sm)]"
            >
              <div class="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--shape-elements)] bg-[var(--bg-canvas)]">
                <div
                  :key="replayKeys[row.id] || 0"
                  class="h-8 w-8 rounded-[var(--shape-elements)] bg-[var(--primary)] motion-reduce:animate-none"
                  :class="row.className"
                ></div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline gap-x-[var(--spacing-sm)]">
                  <code class="text-body-md font-medium text-[var(--text-default)]">{{ row.className }}</code>
                  <code class="text-body-sm text-[var(--text-secondary)]">{{ row.value }}</code>
                </div>
                <p class="m-0 mt-[var(--spacing-xxs)] text-body-sm text-[var(--text-secondary)]">{{ row.useWhen }}</p>
              </div>
              <button
                v-if="!row.loops"
                type="button"
                class="shrink-0 cursor-pointer rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-transparent px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-body-sm text-[var(--text-default)] hover:bg-[var(--bg-hover)]"
                @click="replay(row.id)"
              >
                Replay
              </button>
            </div>
          </div>
        </section>

        <section class="mb-[var(--spacing-xxl)]">
          <h2 class="m-0 mb-[var(--spacing-md)] text-heading-lg text-[var(--text-default)]">The panel recipe</h2>
          <p class="m-0 mb-[var(--spacing-sm)] max-w-prose text-body-md text-[var(--text-secondary)]">
            A <code>v-if</code> region never animates by itself. Wrap it in a Vue Transition and hand the
            enter/leave phases to a catalogued pair — <code>animate-slide-in-left</code> /
            <code>animate-slide-out-left</code> for a sidebar, the <code>-right</code> pair for drawers,
            <code>animate-fade-in/out</code> for in-place content.
          </p>
          <CodeBlock :code="PANEL_RECIPE" language="html" />
        </section>

        <section class="mb-[var(--spacing-xxl)]">
          <h2 class="m-0 mb-[var(--spacing-md)] text-heading-lg text-[var(--text-default)]">Duration tokens</h2>
          <div class="flex flex-col gap-[var(--spacing-xs)]">
            <div
              v-for="row in durationRows"
              :key="row.name"
              class="flex items-center gap-[var(--spacing-md)]"
            >
              <code class="w-56 shrink-0 text-body-sm text-[var(--text-default)]">{{ row.name }}</code>
              <code class="w-20 shrink-0 text-body-sm text-[var(--text-secondary)]">{{ row.value }}</code>
              <div class="h-2 rounded-full bg-[var(--primary)]" :style="{ width: Math.min(row.ms / 8, 420) + 'px' }"></div>
            </div>
          </div>
        </section>

        <section class="mb-[var(--spacing-xxl)]">
          <h2 class="m-0 mb-[var(--spacing-md)] text-heading-lg text-[var(--text-default)]">Easing curves</h2>
          <div class="flex flex-col gap-[var(--spacing-xs)]">
            <div v-for="row in curveRows" :key="row.name" class="flex items-center gap-[var(--spacing-md)]">
              <code class="w-56 shrink-0 text-body-sm text-[var(--text-default)]">{{ row.name }}</code>
              <code class="text-body-sm text-[var(--text-secondary)]">{{ row.value }}</code>
            </div>
          </div>
          <p class="m-0 mt-[var(--spacing-sm)] max-w-prose text-body-sm text-[var(--text-secondary)]">
            Entrances decelerate (productive/expressive entrance), exits accelerate (productive/expressive exit).
            Interaction feedback stays at or under duration-moderate-01 (150ms).
          </p>
        </section>
      </PageContainer>
    `
  })
}
