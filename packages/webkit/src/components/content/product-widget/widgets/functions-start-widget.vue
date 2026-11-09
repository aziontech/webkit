<script setup lang="ts">
  import { ref } from 'vue'

  import SegmentedButton from '../../../actions/segmented-button/segmented-button.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import { AGENT_CLIENTS } from '../data/functions-start'
  import CliTerminal from '../parts/cli-terminal.vue'
  import FunctionsAgent from '../parts/functions-agent.vue'
  import FunctionCodeFragment from './function-code-fragment.vue'

  defineOptions({ name: 'FunctionsStartWidget' })

  interface Props {
    /** Start path the widget draws: a coding agent, the Console editor, or the terminal. */
    tab?: 'agents' | 'console' | 'cli'
    /** Whether this widget is the one showing. */
    active?: boolean
    /** Whether the pointer is over the host. */
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
      <CliTerminal
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
        <FunctionsAgent
          :key="client"
          :active="active"
          :client="client"
        />
      </ShellMockup>
    </div>
  </div>
</template>
