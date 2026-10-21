<script setup lang="ts">
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Chip from '@aziontech/webkit/chip'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'AiInferenceTemplateFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the results scroll to the Azion templates and the pointer rests on the AI Inference starter while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const DARK_INK = '[[data-theme=dark]_&]:invert'

  const RECOMMENDED = [
    {
      title: 'Next.js Boilerplate',
      description: 'Deploy a full-stack Next.js application in a few steps.',
      icon: 'ai-cor ai-next',
      markClass: DARK_INK
    },
    {
      title: 'React Boilerplate',
      description: 'Automate your React.js deployments.',
      icon: 'ai-cor ai-react',
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
      icon: 'ai-cor ai-next',
      markClass: DARK_INK
    },
    {
      title: 'JavaScript Starter',
      description: 'Run plain JavaScript close to users — no framework, just a handler.',
      icon: 'ai-cor ai-js',
      markClass: ''
    },
    {
      title: 'TypeScript Starter',
      description: 'Run a TypeScript handler close to users, compiled on build.',
      icon: 'ai-cor ai-ts',
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

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const stage = ref<globalThis.HTMLElement | null>(null)
  const column = ref<globalThis.HTMLElement | null>(null)
  const offset = ref(0)

  const frame = computed(() => FRAMES[step.value])
  const { position } = useMockupCursor(stage, () => frame.value.cursor)

  const measure = () => {
    const anchors = column.value?.querySelectorAll<globalThis.HTMLElement>('[data-anchor]')
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
    if (reduced) {
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
  watch(column, measure)

  onScopeDispose(halt)
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:76%]"
    :chrome="false"
    :active="active"
    :width="520"
    :mobile-width="460"
  >
    <div
      ref="stage"
      class="relative flex h-full flex-col gap-(--layout-group-gap) py-(--spacing-xs)"
    >
      <MockupPart :order="0">
        <div class="flex flex-col gap-(--spacing-sm)">
          <div class="flex min-h-(--size-8) items-center justify-between gap-(--spacing-md)">
            <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
              Start from Template
            </p>
            <span class="relative flex shrink-0">
              <Button
                label="Filter"
                kind="outlined"
                size="medium"
                icon="pi pi-filter"
              />
              <Badge
                label="1"
                severity="primary"
                size="small"
                aria-hidden="true"
                class="pointer-events-none absolute -top-2 -right-2 min-w-5"
              />
            </span>
          </div>
          <span class="inline-flex w-fit max-w-full">
            <Chip
              label="Use Case"
              kind="filled"
              size="medium"
              removable
            >
              <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                <span class="truncate text-(--text-muted)">Use Case</span>
                <span class="truncate">AI/Agent</span>
              </span>
            </Chip>
          </span>
        </div>
      </MockupPart>

      <MockupPart
        :order="1"
        class="min-h-0 flex-1"
      >
        <div
          data-cursor="results"
          class="h-full overflow-hidden"
        >
          <div
            ref="column"
            :style="{ translate: `0 ${-offset}px` }"
            class="relative flex flex-col gap-(--layout-section-gap) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
          >
            <section
              data-anchor
              class="flex flex-col gap-(--layout-group-gap)"
            >
              <p class="px-(--spacing-xs) text-label-sm text-(--text-muted)">Recommended</p>
              <div class="grid grid-cols-3 gap-(--spacing-md)">
                <CardBox
                  v-for="card in RECOMMENDED"
                  :key="card.title"
                  class="min-h-(--size-44)"
                >
                  <template #content>
                    <div class="flex flex-col items-start gap-(--spacing-md) text-left">
                      <span
                        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                      >
                        <i
                          :class="[card.icon, card.markClass]"
                          class="text-body-lg leading-none text-(--text-default) grayscale"
                          aria-hidden="true"
                        />
                      </span>
                      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                        <h3 class="text-label-md text-(--text-default)">{{ card.title }}</h3>
                        <p class="text-pretty text-body-sm text-(--text-muted)">
                          {{ card.description }}
                        </p>
                      </div>
                    </div>
                  </template>
                </CardBox>
              </div>
            </section>

            <section
              data-anchor
              class="flex flex-col gap-(--layout-group-gap)"
            >
              <p class="px-(--spacing-xs) text-label-sm text-(--text-muted)">Azion Templates</p>
              <div class="grid grid-cols-1 gap-(--spacing-md)">
                <CardBox
                  v-for="template in AZION_TEMPLATES"
                  :key="template.key"
                  :data-cursor="template.key"
                  :data-hovered="(frame.hovered && template.key === 'ai-inference-starter') || null"
                  class="transition-colors duration-moderate-01 ease-productive-entrance data-hovered:bg-(--bg-hover) motion-reduce:transition-none"
                >
                  <template #content>
                    <div class="flex items-start gap-(--spacing-md)">
                      <span
                        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                      >
                        <AzionLogoMin
                          class="h-5 w-auto"
                          aria-label="Azion Marketplace"
                        />
                      </span>
                      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
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
                </CardBox>
              </div>
            </section>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-label-sm text-(--text-muted)">All Frameworks</p>
              <div class="grid grid-cols-1 gap-(--spacing-md)">
                <CardBox
                  v-for="framework in ALL_FRAMEWORKS"
                  :key="framework.title"
                >
                  <template #content>
                    <div class="flex items-start gap-(--spacing-md)">
                      <span
                        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                      >
                        <i
                          :class="[framework.icon, framework.markClass]"
                          class="text-body-lg leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </span>
                      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                        <h3 class="text-label-md text-(--text-default)">{{ framework.title }}</h3>
                        <p class="text-pretty text-body-sm text-(--text-muted)">
                          {{ framework.description }}
                        </p>
                      </div>
                    </div>
                  </template>
                </CardBox>
              </div>
            </section>
          </div>
        </div>
      </MockupPart>

      <MockupCursor
        name="Bruno"
        :x="position.x"
        :y="position.y"
        :pressed="false"
      />
    </div>
  </ShellMockup>
</template>
