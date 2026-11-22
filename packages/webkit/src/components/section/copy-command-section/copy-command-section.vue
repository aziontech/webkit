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
  const copyLabel = computed(() =>
    t(props.shell ? 'copyCommandSection.copyCommandSection' : 'copyCommandSection.copyPrompt')
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="w-full max-w-(--container-xs) min-w-0 lg:w-(--container-xs)"
  >
    <InputGroup size="large">
      <InputGroupAddon
        v-if="shell"
        aria-hidden="true"
        >$</InputGroupAddon
      >
      <InputGroupInput
        readonly
        dir="ltr"
        :model-value="value"
        :aria-label="label"
        class="px-(--spacing-md)! text-label-code-sm! pointer-coarse:text-label-code-lg!"
      />
      <CopyButton
        size="large"
        :value="value"
        :aria-label="copyLabel"
      />
    </InputGroup>
  </div>
</template>
