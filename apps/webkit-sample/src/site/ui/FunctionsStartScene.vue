<script setup lang="ts">
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import ShellMockup from '@aziontech/webkit/shell-mockup-root'
  import { ref } from 'vue'

  import { AGENT_CLIENTS } from '../data/functions-start.js'
  import FunctionsAgentScene from './FunctionsAgentScene.vue'
  import FunctionsTerminalScene from './FunctionsTerminalScene.vue'
  import { productWidget } from './product-widget'

  const FunctionCodeFragment = productWidget('function-code')

  interface Props {
    /** Which start path is drawn — a `value` of `START_TABS`. */
    tab?: string
    /** Whether this tab is the one showing. */
    active?: boolean
    /** Whether the pointer is over the tile that holds the scene. */
    hover?: boolean
  }

  withDefaults(defineProps<Props>(), { tab: 'agents', active: true, hover: false })

  const AGENTS = AGENT_CLIENTS.map(({ mark, label }) => ({ label, value: mark }))

  const client = ref(AGENTS[0].value)
</script>

<template>
  <FunctionCodeFragment
    v-if="tab === 'console'"
    :active="active"
  />
  <ShellMockup
    v-else-if="tab === 'cli'"
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:82%]"
    :chrome="false"
    :active="active"
    :width="520"
    :mobile-width="460"
  >
    <div class="h-full py-(--spacing-xs)">
      <FunctionsTerminalScene
        :active="active"
        :texture="false"
        flush
      />
    </div>
  </ShellMockup>
  <div
    v-else
    class="flex h-full min-w-0 flex-col gap-(--spacing-sm)"
  >
    <span class="flex shrink-0 justify-center">
      <SegmentedButton
        v-model="client"
        :options="AGENTS"
        size="large"
        aria-label="Coding agent"
      />
    </span>
    <div class="min-h-0 flex-1">
      <ShellMockup
        kind="bare"
        :chrome="false"
        :active="active"
        :width="480"
        :mobile-width="440"
      >
        <FunctionsAgentScene
          :key="client"
          :active="active"
          :client="client"
        />
      </ShellMockup>
    </div>
  </div>
</template>
