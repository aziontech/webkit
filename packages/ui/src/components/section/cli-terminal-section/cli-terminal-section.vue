<script setup lang="ts">
  import { computed, defineAsyncComponent, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import CodeBlock from '../../code/code-block/code-block.vue'
  import Texture from '../../content/texture/texture.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import { sectionActions } from '../lib/section-actions'
  import SectionActions from '../parts/section-actions.vue'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'CliTerminalSection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** A recorded Azion CLI session the terminal types. */
  export type CliTerminalSectionScript = 'start' | 'deploy'

  export interface CliTerminalSectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence beside the headline. */
    description?: string
    /** Recorded Azion CLI session the terminal types live: `start` or `deploy`; wins over `session`. */
    script?: CliTerminalSectionScript
    /** The terminal session shown under the header when no `script` is set, commands and their output verbatim, highlighted as bash; the band renders nothing when neither is set. */
    session?: string
    /** Accessible name of the session's copy button; empty keeps the code block's own. */
    copyAriaLabel?: string
    /** Outlined button in the section title; `{ label, href, trailing?, target? }`. Omitted when absent. */
    primaryAction?: ModuleHeaderAction
  }

  const props = withDefaults(defineProps<CliTerminalSectionProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    script: undefined,
    session: '',
    copyAriaLabel: '',
    primaryAction: undefined
  })

  const ConsoleMockup = defineAsyncComponent(
    () => import('../../content/console-mockup/console-mockup.vue')
  )

  const attrs = useAttrs()

  const stageEl = ref<globalThis.HTMLElement | null>(null)

  const entered = ref(false)

  let arrival: globalThis.IntersectionObserver | null = null

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'cli-terminal-section'
  )
  const headerActions = computed(() => sectionActions(props.primaryAction, undefined, 'outline'))

  const tabs = computed(() =>
    props.session.length > 0
      ? [{ label: '', value: 'session', code: props.session, language: 'bash' }]
      : []
  )

  const widget = computed(() =>
    props.script === 'start' ? 'cli-terminal-start' : 'cli-terminal-deploy'
  )

  const hasTerminal = computed(() => Boolean(props.script) || tabs.value.length > 0)

  watch(stageEl, (element) => {
    arrival?.disconnect()
    if (!element || entered.value) return
    if (typeof globalThis.IntersectionObserver === 'undefined') {
      entered.value = true
      return
    }
    arrival = new globalThis.IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        entered.value = true
        arrival?.disconnect()
      },
      { threshold: 0.2 }
    )
    arrival.observe(element)
  })

  onScopeDispose(() => arrival?.disconnect())

  const BACKDROP_CLASS =
    'relative w-full overflow-hidden px-(--spacing-xl) pt-(--spacing-16) md:pt-(--spacing-32) ' +
    '[--texture-wave-gain:1.8] [--texture-wave-pace:5] [--texture-pool-a:50%_100%] [--texture-pool-b:50%_0%]'

  const STAGE_CLASS =
    'relative z-10 mx-auto -mb-(--spacing-xs) h-(--size-72) w-full max-w-(--container-4xl) translate-y-(--spacing-xl) scale-95 rounded-(--shape-control) opacity-0 shadow-(--shadow-2xl) ' +
    'transition-[translate,scale,opacity] duration-slow-02 ease-expressive-entrance ' +
    'data-entered:translate-y-0 data-entered:scale-100 data-entered:opacity-100 ' +
    'md:h-(--size-96) motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none'
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :anchor="anchor"
    :label="title"
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
    :filled="hasTerminal"
    :framed="false"
    align="split"
    header-padding="small"
    class="[--module-header-headline-span:2] [--module-header-headline-max:var(--container-xl)]"
  >
    <template
      v-if="headerActions.length"
      #header-actions
    >
      <SectionActions :actions="headerActions" />
    </template>

    <RegistrationFrame
      flush
      borders="y"
      marks="all"
    >
      <div :class="BACKDROP_CLASS">
        <Texture
          variant="pixelate"
          size="small"
          fade="none"
        />
        <div
          v-if="script"
          ref="stageEl"
          :data-entered="entered || null"
          :class="STAGE_CLASS"
        >
          <ConsoleMockup :name="widget" />
        </div>
        <div
          v-else
          class="relative z-10 mx-auto -mb-(--spacing-xs) w-full max-w-(--container-4xl) rounded-(--shape-control) shadow-(--shadow-2xl)"
        >
          <CodeBlock
            :tabs="tabs"
            show-label
            :show-line-numbers="false"
            v-bind="{ animateLines: true }"
            :copy-aria-label="copyAriaLabel || undefined"
          />
        </div>
      </div>
    </RegistrationFrame>
  </SectionBand>
</template>
