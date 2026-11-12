<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import type { CopyPromptAgent } from '../../actions/copy-prompt-button/copy-prompt-button.vue'
  import CopyPromptButton from '../../actions/copy-prompt-button/copy-prompt-button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'

  defineOptions({ name: 'DocAgentCard', inheritAttrs: false })

  interface Props {
    /** The prompt `CopyPromptButton` copies. */
    prompt: string
    /** Card heading (an `h3`); empty uses the catalog's `Your AI agent, fluent in Azion`. */
    title?: string
    /** One or two sentences on what the prompt gives the agent; empty uses the catalog's. */
    description?: string
    /** The agents whose marks the copy button shows; unset keeps the button's default list. */
    agents?: CopyPromptAgent[]
    /** Question over the guided action; empty uses the catalog's `Prefer the guided route?`. */
    asideTitle?: string
    /** Label of the guided action; empty uses the catalog's `Agent setup`. */
    actionLabel?: string
    /** Destination of the guided action; empty renders it as a button that only emits `action`. */
    actionHref?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    agents: undefined,
    asideTitle: '',
    actionLabel: '',
    actionHref: ''
  })

  const emit = defineEmits<{
    copy: [value: string]
    action: [event: MouseEvent]
  }>()

  defineSlots<{
    /** Replaces the copy button in the left column. */
    actions?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ docAgentCard: en.docAgentCard })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-agent-card'
  )
  const copyAgents = computed(() => (props.agents ? { agents: props.agents } : {}))
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    data-doc-block
    data-doc-chrome
    :aria-label="title || t('docAgentCard.title')"
    class="@container w-full"
  >
    <FrameBox class="w-full">
      <div
        class="grid w-full grid-cols-1 bg-(--bg-surface) @3xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]"
      >
        <div
          :data-testid="`${testId}__main`"
          class="flex min-w-0 flex-col items-start p-(--spacing-xl)"
        >
          <h3 class="m-0 text-heading-lg text-(--text-default)">
            {{ title || t('docAgentCard.title') }}
          </h3>
          <p class="m-0 mt-(--spacing-sm) max-w-(--container-2xl) text-body-md text-(--text-muted)">
            {{ description || t('docAgentCard.description') }}
          </p>
          <div class="mt-(--spacing-md) flex max-w-full flex-wrap gap-(--spacing-sm)">
            <slot name="actions">
              <CopyPromptButton
                :value="prompt"
                v-bind="copyAgents"
                :data-testid="`${testId}__copy`"
                @copy="emit('copy', $event)"
              />
            </slot>
          </div>
        </div>
        <div
          :data-testid="`${testId}__aside`"
          class="relative isolate flex min-w-0 flex-col items-start justify-between gap-(--spacing-lg) overflow-hidden border-t border-(--border-default) p-(--spacing-xl) @3xl:border-t-0 @3xl:border-s"
        >
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-0 end-0 -z-10 w-3/5"
          >
            <TextureMaterial
              kind="dither"
              size="small"
              :data-testid="`${testId}__art`"
              class="[--texture-direction:to_bottom_right] [--texture-ink:color-mix(in_srgb,var(--primary)_70%,transparent)] rtl:[--texture-direction:to_bottom_left]"
            />
          </div>
          <p class="m-0 max-w-(--container-3xs) text-heading-md text-(--text-default)">
            {{ asideTitle || t('docAgentCard.asideTitle') }}
          </p>
          <Button
            :label="actionLabel || t('docAgentCard.action')"
            kind="primary"
            size="large"
            :href="actionHref || undefined"
            :data-testid="`${testId}__action`"
            @click="emit('action', $event)"
          />
        </div>
      </div>
    </FrameBox>
  </section>
</template>
