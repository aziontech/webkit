<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import CopyButton from '../../action/copy-button/copy-button.vue'

  defineOptions({ name: 'CopyCommandSection', inheritAttrs: false })

  export interface CopyCommandSectionProps {
    /** Text on the line, copied as written. */
    value: string
    /** Draws the shell prompt before the text; turn off for a prompt meant for an agent. */
    shell?: boolean
  }

  const props = withDefaults(defineProps<CopyCommandSectionProps>(), { shell: true })

  const attrs = useAttrs()
  const { t } = useTranslate({ copyCommandSection: en.copyCommandSection })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'copy-command-section'
  )

  const label = computed(() =>
    t(props.shell ? 'copyCommandSection.command' : 'copyCommandSection.prompt')
  )
  const TEXT_CLASS =
    'm-0 flex min-h-10 min-w-0 flex-1 items-center px-(--spacing-md) py-(--spacing-xs) text-start text-label-code-sm whitespace-pre-wrap text-(--text-default) ' +
    'break-words group-data-[shell]:break-all'

  const copyLabel = computed(() =>
    t(props.shell ? 'copyCommandSection.copyCommand' : 'copyCommandSection.copyPrompt')
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-shell="shell || null"
    class="group w-full max-w-(--container-md) min-w-0 data-[shell]:lg:w-(--container-md)"
  >
    <div
      role="group"
      :aria-label="label"
      class="flex items-start rounded-(--shape-control) border border-(--border-input) bg-(--bg-surface)"
    >
      <span
        v-if="shell"
        aria-hidden="true"
        :data-testid="`${testId}__prompt`"
        class="flex min-h-10 shrink-0 items-center border-e border-(--border-input) px-(--spacing-md) text-label-code-sm text-(--text-muted)"
        >$</span
      >
      <p
        dir="ltr"
        :data-testid="`${testId}__text`"
        :class="TEXT_CLASS"
      >
        {{ value }}
      </p>
      <CopyButton
        size="large"
        :value="value"
        :aria-label="copyLabel"
        class="shrink-0"
      />
    </div>
  </div>
</template>
