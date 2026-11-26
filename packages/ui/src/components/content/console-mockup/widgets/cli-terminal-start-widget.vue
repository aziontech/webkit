<script setup lang="ts">
  import CliTerminalStage from '../parts/cli-terminal-stage.vue'

  defineOptions({ name: 'CliTerminalStartWidget' })

  interface Props {
    /** Whether this widget is the one showing; the session plays only while it is. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true })
</script>

<template>
  <CliTerminalStage
    script="start"
    :active="active"
  />
</template>
