<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import type { CopyPromptButtonAgent } from '../../action/copy-prompt-button/copy-prompt-button.vue'
  import CopyPromptButton from '../../action/copy-prompt-button/copy-prompt-button.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import Texture from '../../marketing/texture/texture.vue'

  defineOptions({ name: 'DocAgentCard', inheritAttrs: false })

  export interface DocAgentCardProps {
    /** The prompt `CopyPromptButton` copies. */
    prompt: string
    /** Card heading (an `h3`); empty uses the catalog's `Your AI agent, fluent in Azion`. */
    title?: string
    /** One or two sentences on what the prompt gives the agent; empty uses the catalog's. */
    description?: string
    /** The agents whose marks the copy button shows; unset keeps the button's default list. */
    agents?: CopyPromptButtonAgent[]
    /** Question over the guided action; empty uses the catalog's `Prefer the guided route?`. */
    asideTitle?: string
    /** Label of the guided action; empty uses the catalog's `Agent setup`. */
    actionLabel?: string
    /** Destination of the guided action; empty renders it as a button that only emits `action`. */
    actionHref?: string
  }

  const props = withDefaults(defineProps<DocAgentCardProps>(), {
    title: '',
    description: '',
    agents: undefined,
    asideTitle: '',
    actionLabel: '',
    actionHref: ''
  })

  const emit = defineEmits<{
    copy: [event: MouseEvent, value: string]
    action: [event: MouseEvent]
  }>()

  defineSlots<{
    /** Replaces the copy button in the left column. */
    actions?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ docAgentCard: en.docAgentCard })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'doc-agent-card')
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
    <RegistrationFrame class="w-full">
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
                @copy="(event, value) => emit('copy', event, value)"
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
            <Texture
              variant="dither"
              size="small"
              fade="top"
              :data-testid="`${testId}__art`"
              class="[--texture-direction:to_bottom_right] [--texture-fade-start:15%] [--texture-fade-end:80%] [--texture-ink:color-mix(in_srgb,var(--primary)_70%,transparent)] rtl:[--texture-direction:to_bottom_left]"
            />
          </div>
          <p class="m-0 max-w-(--container-3xs) text-heading-md text-(--text-default)">
            {{ asideTitle || t('docAgentCard.asideTitle') }}
          </p>
          <Button
            :label="actionLabel || t('docAgentCard.action')"
            variant="primary"
            size="large"
            :href="actionHref || undefined"
            :data-testid="`${testId}__action`"
            @click="emit('action', $event)"
          />
        </div>
      </div>
    </RegistrationFrame>
  </section>
</template>
