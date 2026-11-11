<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import CopyButton from '../../actions/copy-button/copy-button.vue'
  import InputGroup from '../../inputs/input-group/input-group.vue'
  import InputGroupAddon from '../../inputs/input-group/input-group-addon/input-group-addon.vue'

  defineOptions({ name: 'SectionCommand', inheritAttrs: false })

  interface Props {
    /** Text on the line, copied as written. */
    value: string
    /** Draws the shell prompt before the text; turn off for a prompt meant for an agent. */
    shell?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { shell: true })

  const attrs = useAttrs()
  const { t } = useTranslate({ sectionCommand: en.sectionCommand })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-section-command'
  )

  const label = computed(() => t(props.shell ? 'sectionCommand.command' : 'sectionCommand.prompt'))
  const copyLabel = computed(() =>
    t(props.shell ? 'sectionCommand.copyCommand' : 'sectionCommand.copyPrompt')
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
      <input
        readonly
        dir="ltr"
        :value="value"
        :aria-label="label"
        class="h-full min-w-0 flex-1 border-0 bg-(--bg-surface) px-(--spacing-md) text-label-code-sm text-(--text-default) outline-none"
      />
      <CopyButton
        size="large"
        :value="value"
        :aria-label="copyLabel"
      />
    </InputGroup>
  </div>
</template>
