<script setup lang="ts">
  import ConsoleMockupShell from '../console-mockup-shell/console-mockup-shell.vue'
  import CliTerminal from '../parts/cli-terminal.vue'

  defineOptions({ name: 'CliTerminalDeployWidget' })

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
      script="deploy"
      :active="active"
      :texture="false"
      :speed="2.5"
      flush
      :copyable="false"
    />
  </ConsoleMockupShell>
</template>
