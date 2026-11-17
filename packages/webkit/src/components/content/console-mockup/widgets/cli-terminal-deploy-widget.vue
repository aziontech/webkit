<script setup lang="ts">
  import { useMockupPause } from '../composables/use-mockup-pause'
  import CliTerminal from '../parts/cli-terminal.vue'
  import ConsoleMockupShell from '../parts/console-mockup-shell.vue'
  import MockupPauseButton from '../parts/mockup-pause-button.vue'

  defineOptions({ name: 'CliTerminalDeployWidget' })

  interface Props {
    /** Whether this widget is the one showing; the session plays only while it is. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true })

  const { paused, label, toggle } = useMockupPause()
</script>

<template>
  <div class="flex h-full w-full min-w-0 flex-col gap-(--spacing-xs)">
    <MockupPauseButton
      class="self-end"
      :paused="paused"
      :label="label"
      @click="toggle"
    />
    <ConsoleMockupShell
      class="min-h-0 flex-1"
      variant="bare"
      :chrome="false"
      :active="active"
      :width="896"
      :mobile-width="390"
      :animated="false"
    >
      <CliTerminal
        script="deploy"
        :active="active"
        :texture="false"
        :speed="2.5"
        flush
        :copyable="false"
        :paused="paused"
      />
    </ConsoleMockupShell>
  </div>
</template>
