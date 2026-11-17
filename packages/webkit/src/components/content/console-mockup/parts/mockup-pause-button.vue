<script setup lang="ts">
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import { useConsoleMockupContext } from '../composables/use-console-mockup-context'

  defineOptions({ name: 'MockupPauseButton' })

  interface Props {
    /** Whether the moving scene is held still. */
    paused: boolean
    /** Accessible name, the action the press takes. */
    label: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const { testId } = useConsoleMockupContext()
</script>

<template>
  <IconButton
    :data-testid="`${testId}__pause`"
    :icon="paused ? 'az az-play' : 'az az-pause'"
    :aria-label="label"
    variant="outline"
    size="small"
    @click="(event: MouseEvent) => emit('click', event)"
  />
</template>
