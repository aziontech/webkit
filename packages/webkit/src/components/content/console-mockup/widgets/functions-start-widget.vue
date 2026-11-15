<script setup lang="ts">
  import { ref } from 'vue'

  import ToggleGroup from '../../../action/toggle-group/toggle-group.vue'
  import { AGENT_CLIENTS } from '../lib/functions-start'
  import CliTerminal from '../parts/cli-terminal.vue'
  import ConsoleMockupShell from '../parts/console-mockup-shell.vue'
  import FunctionsAgent from '../parts/functions-agent.vue'
  import FunctionCodeFragment from './function-code-fragment.vue'

  defineOptions({ name: 'FunctionsStartWidget' })

  /** Start path the widget draws. */
  export type ConsoleMockupFunctionsStartTab = 'agents' | 'console' | 'cli'

  interface Props {
    /** Start path the widget draws: a coding agent, the Console editor, or the terminal. */
    tab?: ConsoleMockupFunctionsStartTab
    /** Whether this widget is the one showing. */
    active?: boolean
    /** Whether the pointer is over the host. */
    hovered?: boolean
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
  <ConsoleMockupShell
    v-else-if="tab === 'cli'"
    variant="bare"
    fade="bottom"
    class="[--console-mockup-fade-start:82%]"
    :chrome="false"
    :active="active"
    :width="520"
    :mobile-width="460"
  >
    <div class="h-full py-(--spacing-xs)">
      <CliTerminal
        :active="active"
        :texture="false"
        flush
      />
    </div>
  </ConsoleMockupShell>
  <div
    v-else
    class="flex h-full min-w-0 flex-col gap-(--spacing-sm)"
  >
    <span class="flex shrink-0 justify-center">
      <ToggleGroup
        v-model="client"
        :options="AGENTS"
        size="large"
        aria-label="Coding agent"
      />
    </span>
    <div class="min-h-0 flex-1">
      <ConsoleMockupShell
        variant="bare"
        :chrome="false"
        :active="active"
        :width="480"
        :mobile-width="440"
      >
        <FunctionsAgent
          :key="client"
          :active="active"
          :client="client"
        />
      </ConsoleMockupShell>
    </div>
  </div>
</template>
