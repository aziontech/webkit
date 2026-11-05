<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import CodeBlock from '../../code/code-block/code-block.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'

  defineOptions({
    name: 'CliTerminal',
    inheritAttrs: false
  })

  /** The outlined button in the section title. */
  export type CliTerminalAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action. */
    target?: '_blank' | '_self'
  }

  interface Props {
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence beside the headline. */
    description?: string
    /** The terminal session shown under the header, commands and their output verbatim, highlighted as bash; the band renders nothing when empty. */
    session?: string
    /** Accessible name of the session's copy button; empty keeps the code block's own. */
    copyAriaLabel?: string
    /** Outlined button in the section title; `{ label, href, trailing?, target? }`. Omitted when absent. */
    primaryAction?: CliTerminalAction
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    session: '',
    copyAriaLabel: '',
    primaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-cli-terminal'
  )

  const hasHeader = computed(() => props.title.length > 0)

  const tabs = computed(() =>
    props.session.length > 0
      ? [{ label: 'session', value: 'session', code: props.session, language: 'bash' }]
      : []
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="title || undefined"
  >
    <SectionModule
      v-if="tabs.length > 0"
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
            kind="horizontal"
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
                kind="outlined"
                size="large"
                :target="primaryAction.target"
                :icon="primaryAction.trailing ? 'pi pi-chevron-right' : ''"
                icon-position="trailing"
                :animated="Boolean(primaryAction.trailing)"
              />
            </template>
          </SectionTitle>
        </div>
      </template>

      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <div
          class="relative w-full overflow-hidden px-(--spacing-xl) pt-(--spacing-16) md:pt-(--spacing-32) [--texture-wave-gain:1.8] [--texture-wave-pace:5] [--texture-pool-a:50%_100%] [--texture-pool-b:50%_0%]"
        >
          <TextureMaterial
            kind="pixelate"
            size="small"
            fade="none"
          />
          <div
            class="relative z-10 mx-auto -mb-(--spacing-xs) w-full max-w-(--container-4xl) rounded-(--shape-elements) shadow-(--shadow-2xl)"
          >
            <CodeBlock
              :tabs="tabs"
              :show-line-numbers="false"
              v-bind="{ animateLines: true }"
              :copy-aria-label="copyAriaLabel || undefined"
            />
          </div>
        </div>
      </FrameBox>
    </SectionModule>
  </section>
</template>
