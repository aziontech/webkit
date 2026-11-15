<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import AzionLogoMin from '../../../../svg/azion/min/min.vue'
  import Button from '../../../action/button/button.vue'
  import Chip from '../../../input/chip/chip.vue'
  import Badge from '../../badge/badge.vue'
  import Card from '../../card/card.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import ConsoleMockupShell from '../console-mockup-shell/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../console-mockup-shell/console-mockup-shell-item/console-mockup-shell-item.vue'
  import MockupCursor from '../parts/mockup-cursor.vue'

  defineOptions({ name: 'AiInferenceTemplateFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the results scroll to the Azion templates and the pointer rests on the AI Inference starter while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = useMediaQuery('(hover: hover)', true)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const DARK_INK = '[[data-theme=dark]_&]:invert'

  const RECOMMENDED = [
    {
      title: 'Next.js Boilerplate',
      description: 'Deploy a full-stack Next.js application in a few steps.',
      icon: 'ai-color ai-nextjs',
      markClass: DARK_INK
    },
    {
      title: 'React Boilerplate',
      description: 'Automate your React.js deployments.',
      icon: 'ai-color ai-react',
      markClass: ''
    },
    {
      title: 'Preact Starter',
      description: 'Deploy a Preact app — the React API in a fraction of the bundle.',
      icon: 'ai ai-preact',
      markClass: ''
    }
  ]

  const AZION_TEMPLATES = [
    {
      key: 'ai-inference-starter',
      title: 'AI Inference Starter Kit',
      description: 'Create an application that runs AI models close to users.'
    },
    {
      key: 'nextjs-ai-chatbot',
      title: 'Next.js AI Chatbot',
      description: 'A high-performance, server-rendered Next.js App Router AI Chatbot.'
    }
  ]

  const ALL_FRAMEWORKS = [
    {
      title: 'OpenNext Starter',
      description: 'Deploy Next.js through the OpenNext adapter, server routes included.',
      icon: 'ai-color ai-nextjs',
      markClass: DARK_INK
    },
    {
      title: 'JavaScript Starter',
      description: 'Run plain JavaScript close to users — no framework, just a handler.',
      icon: 'ai-color ai-javascript',
      markClass: ''
    },
    {
      title: 'TypeScript Starter',
      description: 'Run a TypeScript handler close to users, compiled on build.',
      icon: 'ai-color ai-typescript',
      markClass: ''
    }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    anchor: number
    hovered: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'results', x: 0.88, y: 0.92 }
  const STARTER: MockupCursorTarget = { key: 'ai-inference-starter', x: 0.84, y: 0.3 }

  const FRAMES: Frame[] = [
    { cursor: IDLE, anchor: 0, hovered: false, forward: 0, back: 0 },
    { cursor: IDLE, anchor: 1, hovered: false, forward: 160, back: 700 },
    { cursor: STARTER, anchor: 1, hovered: false, forward: 760, back: 260 },
    { cursor: STARTER, anchor: 1, hovered: true, forward: 420, back: 160 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hovered || !canHover.value)

  const step = ref(0)
  const stageEl = ref<globalThis.HTMLElement | null>(null)
  const columnEl = ref<globalThis.HTMLElement | null>(null)
  const offset = ref(0)

  const frame = computed(() => FRAMES[step.value])
  const { position } = useMockupCursor(stageEl, () => frame.value.cursor)

  const measure = () => {
    const anchors = columnEl.value?.querySelectorAll<globalThis.HTMLElement>('[data-anchor]')
    const anchor = anchors?.[frame.value.anchor]
    offset.value = anchor ? anchor.offsetTop : 0
  }

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null

  const halt = () => {
    if (timer) globalThis.clearTimeout(timer)
    timer = null
  }

  const advance = () => {
    halt()
    measure()
    const target = wanted() ? LAST : 0
    if (step.value === target) return
    if (reduced.value || !canHover.value) {
      step.value = target
      measure()
      return
    }
    const forward = target > step.value
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })
  watch(columnEl, measure)

  onScopeDispose(halt)
</script>

<template>
  <ConsoleMockupShell
    variant="bare"
    fade="bottom"
    class="[--console-mockup-fade-start:76%]"
    :chrome="false"
    :active="active"
    :width="520"
    :mobile-width="460"
  >
    <div
      ref="stageEl"
      class="relative flex h-full flex-col gap-(--layout-group-gap) py-(--spacing-xs)"
    >
      <ConsoleMockupShellItem :order="0">
        <div class="flex flex-col gap-(--spacing-sm)">
          <div class="flex min-h-(--size-8) items-center justify-between gap-(--spacing-md)">
            <p class="px-(--spacing-xs) text-heading-2xs text-(--text-default)">
              Start from Template
            </p>
            <span class="relative flex shrink-0">
              <Button
                label="Filter"
                variant="outline"
                size="medium"
                icon="ai ai-filter"
              />
              <Badge
                label="1"
                variant="primary"
                size="small"
                aria-hidden="true"
                class="pointer-events-none absolute -top-2 -end-2 min-w-5"
              />
            </span>
          </div>
          <span class="inline-flex w-fit max-w-full">
            <Chip
              label="Use Case"
              variant="filled"
              size="medium"
              removable
            >
              <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                <span class="truncate text-(--text-muted)">Use Case</span>
                <span class="truncate">AI/Agent</span>
              </span>
            </Chip>
          </span>
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem
        :order="1"
        class="min-h-0 flex-1"
      >
        <div
          data-cursor="results"
          class="h-full overflow-hidden"
        >
          <div
            ref="columnEl"
            :style="{ translate: `0 ${-offset}px` }"
            class="relative flex flex-col gap-(--layout-section-gap) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
          >
            <section
              data-anchor
              class="flex flex-col gap-(--layout-group-gap)"
            >
              <p class="px-(--spacing-xs) text-label-sm text-(--text-muted)">Recommended</p>
              <div class="grid grid-cols-3 gap-(--spacing-md)">
                <Card
                  v-for="card in RECOMMENDED"
                  :key="card.title"
                  class="min-h-(--size-44)"
                >
                  <template #default>
                    <div class="flex flex-col items-start gap-(--spacing-md) text-start">
                      <span
                        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                      >
                        <i
                          :class="[card.icon, card.markClass]"
                          class="text-body-lg leading-none text-(--text-default) grayscale"
                          aria-hidden="true"
                        />
                      </span>
                      <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                        <h3 class="text-label-md text-(--text-default)">{{ card.title }}</h3>
                        <p class="text-pretty text-body-sm text-(--text-muted)">
                          {{ card.description }}
                        </p>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
            </section>

            <section
              data-anchor
              class="flex flex-col gap-(--layout-group-gap)"
            >
              <p class="px-(--spacing-xs) text-label-sm text-(--text-muted)">Azion Templates</p>
              <div class="grid grid-cols-1 gap-(--spacing-md)">
                <Card
                  v-for="template in AZION_TEMPLATES"
                  :key="template.key"
                  :data-cursor="template.key"
                  :data-hovered="(frame.hovered && template.key === 'ai-inference-starter') || null"
                  class="transition-colors duration-moderate-01 ease-productive-entrance data-hovered:bg-(--bg-hover) motion-reduce:transition-none"
                >
                  <template #default>
                    <div class="flex items-start gap-(--spacing-md)">
                      <span
                        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                      >
                        <AzionLogoMin
                          class="h-5 w-auto"
                          aria-label="Azion Marketplace"
                        />
                      </span>
                      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
                        <div class="flex flex-wrap items-baseline gap-x-(--spacing-xs)">
                          <h3 class="text-label-md text-(--text-default)">{{ template.title }}</h3>
                          <span class="text-body-xs text-(--text-muted)">by Azion</span>
                        </div>
                        <p class="text-pretty text-body-sm text-(--text-muted)">
                          {{ template.description }}
                        </p>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
            </section>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-label-sm text-(--text-muted)">All Frameworks</p>
              <div class="grid grid-cols-1 gap-(--spacing-md)">
                <Card
                  v-for="framework in ALL_FRAMEWORKS"
                  :key="framework.title"
                >
                  <template #default>
                    <div class="flex items-start gap-(--spacing-md)">
                      <span
                        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                      >
                        <i
                          :class="[framework.icon, framework.markClass]"
                          class="text-body-lg leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </span>
                      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
                        <h3 class="text-label-md text-(--text-default)">{{ framework.title }}</h3>
                        <p class="text-pretty text-body-sm text-(--text-muted)">
                          {{ framework.description }}
                        </p>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </ConsoleMockupShellItem>

      <MockupCursor
        name="Jordan"
        :x="position.x"
        :y="position.y"
        :pressed="false"
      />
    </div>
  </ConsoleMockupShell>
</template>
