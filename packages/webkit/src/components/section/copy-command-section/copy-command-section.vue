<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import CopyButton from '../../action/copy-button/copy-button.vue'
  import InputGroup from '../../input/input-group/input-group.vue'
  import InputGroupAddon from '../../input/input-group/input-group-addon/input-group-addon.vue'
  import InputGroupInput from '../../input/input-group/input-group-input/input-group-input.vue'

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
  const COMMAND_CLASS =
    'px-(--spacing-md)! text-label-code-sm! pointer-coarse:text-label-code-lg! ' +
    '[mask-image:linear-gradient(to_right,black_calc(100%-var(--spacing-xl)),transparent)]'

  const PROMPT_TEXT_CLASS =
    'm-0 flex min-h-10 min-w-0 flex-1 items-center px-(--spacing-md) py-(--spacing-xs) text-start text-label-code-sm break-words whitespace-pre-wrap ' +
    'text-(--text-default) pointer-coarse:text-label-code-lg'

  const copyLabel = computed(() =>
    t(props.shell ? 'copyCommandSection.copyCommandSection' : 'copyCommandSection.copyPrompt')
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-shell="shell || null"
    class="w-full max-w-(--container-md) min-w-0 data-[shell]:lg:w-(--container-md)"
  >
    <InputGroup
      v-if="shell"
      size="large"
    >
      <InputGroupAddon aria-hidden="true">$</InputGroupAddon>
      <InputGroupInput
        readonly
        dir="ltr"
        :model-value="value"
        :aria-label="label"
        :class="COMMAND_CLASS"
      />
      <CopyButton
        size="large"
        :value="value"
        :aria-label="copyLabel"
      />
    </InputGroup>
    <div
      v-else
      role="group"
      :aria-label="label"
      class="flex items-start rounded-(--shape-control) border border-(--border-input) bg-(--bg-surface)"
    >
      <p
        dir="ltr"
        :data-testid="`${testId}__text`"
        :class="PROMPT_TEXT_CLASS"
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
