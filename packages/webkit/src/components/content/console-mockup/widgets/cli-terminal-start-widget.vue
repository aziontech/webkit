<script setup lang="ts">
  import CliTerminal from '../parts/cli-terminal.vue'
  import ConsoleMockupShell from '../parts/console-mockup-shell.vue'

  defineOptions({ name: 'CliTerminalStartWidget' })

  interface Props {
    /** Whether this widget is the one showing; the session plays only while it is. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true })
</script>

<template>
  <ConsoleMockupShell
    variant="bare"
    :chrome="false"
    :active="active"
    :width="896"
    :mobile-width="390"
    :animated="false"
  >
    <CliTerminal
      script="start"
      :active="active"
      :texture="false"
      :speed="2.5"
      flush
      :copyable="false"
    />
  </ConsoleMockupShell>
</template>
