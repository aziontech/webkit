<script setup lang="ts">
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import CliTerminal from '../parts/cli-terminal.vue'

  defineOptions({ name: 'CliTerminalDeployWidget' })

  interface Props {
    /** Whether this widget is the one showing; the session plays only while it is. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true })
</script>

<template>
  <ShellMockup
    kind="bare"
    :chrome="false"
    :active="active"
    :width="896"
    :mobile-width="390"
    still
  >
    <CliTerminal
      script="deploy"
      :active="active"
      :texture="false"
      :speed="2.5"
      flush
      :copyable="false"
    />
  </ShellMockup>
</template>
