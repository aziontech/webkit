<script setup lang="ts">
  import FunctionsAgentScene from './FunctionsAgentScene.vue'
  import FunctionsConsoleScene from './FunctionsConsoleScene.vue'
  import FunctionsTerminalScene from './FunctionsTerminalScene.vue'

  interface Props {
    /** Which start path is drawn — a `value` of `START_TABS`. */
    tab?: string
    /** Whether this tab is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), { tab: 'agents', active: true })
</script>

<template>
  <FunctionsConsoleScene
    v-if="tab === 'console'"
    :active="active"
  />
  <FunctionsTerminalScene
    v-else-if="tab === 'cli'"
    :active="active"
    fit
  />
  <FunctionsAgentScene
    v-else
    :active="active"
  />
</template>
