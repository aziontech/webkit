<script setup lang="ts">
  import { computed, defineAsyncComponent, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import Button from '../../action/button/button.vue'
  import CodeBlock from '../../code/code-block/code-block.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import type { SectionTitleAction } from '../../marketing/section-title/section-title.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import Texture from '../../marketing/texture/texture.vue'

  defineOptions({
    name: 'CliTerminalSection',
    inheritAttrs: false
  })

  export type { SectionTitleAction }

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
    primaryAction?: SectionTitleAction
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

  const hasHeader = computed(() => props.title.length > 0)

  const tabs = computed(() =>
    props.session.length > 0
      ? [{ label: 'session', value: 'session', code: props.session, language: 'bash' }]
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
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <SectionModule
      v-if="hasTerminal"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasHeader"
        #header
      >
        <div
          class="contents [--section-title-headline-span:2] [--section-title-headline-max:var(--container-xl)]"
        >
          <SectionTitle
            align="split"
            padding="small"
            :eyebrow="eyebrow"
            :title="title"
            :description="description"
          >
            <template
              v-if="primaryAction"
              #actions
            >
              <Button
                :label="primaryAction.label"
                :href="primaryAction.href"
                variant="outline"
                size="large"
                :target="primaryAction.target"
                :icon="primaryAction.trailing ? 'ai ai-chevron-right' : ''"
                icon-position="trailing"
                :animated="Boolean(primaryAction.trailing)"
              />
            </template>
          </SectionTitle>
        </div>
      </template>

      <RegistrationFrame
        flush
        borders="y"
        marks="all"
      >
        <div
          class="relative w-full overflow-hidden px-(--spacing-xl) pt-(--spacing-16) md:pt-(--spacing-32) [--texture-wave-gain:1.8] [--texture-wave-pace:5] [--texture-pool-a:50%_100%] [--texture-pool-b:50%_0%]"
        >
          <Texture
            variant="pixelate"
            size="small"
            fade="none"
          />
          <div
            v-if="script"
            ref="stageEl"
            :data-entered="entered || null"
            class="relative z-10 mx-auto -mb-(--spacing-xs) h-(--size-72) w-full max-w-(--container-4xl) translate-y-(--spacing-xl) scale-95 rounded-(--shape-control) opacity-0 shadow-(--shadow-2xl) transition-[translate,scale,opacity] duration-slow-02 ease-expressive-entrance data-entered:translate-y-0 data-entered:scale-100 data-entered:opacity-100 md:h-(--size-96) motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none"
          >
            <ConsoleMockup :name="widget" />
          </div>
          <div
            v-else
            class="relative z-10 mx-auto -mb-(--spacing-xs) w-full max-w-(--container-4xl) rounded-(--shape-control) shadow-(--shadow-2xl)"
          >
            <CodeBlock
              :tabs="tabs"
              :show-line-numbers="false"
              v-bind="{ animateLines: true }"
              :copy-aria-label="copyAriaLabel || undefined"
            />
          </div>
        </div>
      </RegistrationFrame>
    </SectionModule>
  </section>
</template>
