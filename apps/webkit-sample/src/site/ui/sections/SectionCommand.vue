<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroup from '@aziontech/webkit/input-group-root'
  import { computed } from 'vue'

  defineOptions({ name: 'SectionCommand', inheritAttrs: false })

  interface Props {
    /** Text on the line, copied as written. */
    value: string
    /** Draws the shell prompt before the text; leave off for a prompt meant for an agent. */
    shell?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { shell: true })

  const label = computed(() => (props.shell ? 'Command' : 'Prompt'))
</script>

<template>
  <div
    v-bind="$attrs"
    class="w-full min-w-0 max-w-(--container-xs) lg:w-(--container-xs)"
  >
    <InputGroup size="large">
      <InputGroupAddon
        v-if="shell"
        aria-hidden="true"
        >$</InputGroupAddon
      >
      <input
        readonly
        :value="value"
        :aria-label="label"
        class="h-full min-w-0 flex-1 border-0 bg-(--bg-surface) px-(--spacing-md) text-label-code-sm text-(--text-default) outline-none"
      />
      <CopyButton
        size="large"
        :value="value"
        :aria-label="shell ? 'Copy command' : 'Copy prompt'"
      />
    </InputGroup>
  </div>
</template>
