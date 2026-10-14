<script setup lang="ts">
  import { computed } from 'vue'

  import WorkloadDomainsWidget from './widgets/WorkloadDomainsWidget.vue'
  import WorkloadsListWidget from './widgets/WorkloadsListWidget.vue'
  import WorkloadTopologyWidget from './widgets/WorkloadTopologyWidget.vue'

  defineOptions({ name: 'WorkloadsConsoleScene' })

  interface Props {
    /** Tab key handed by the band: `list`, `topology` or `domains`. */
    tab?: string
    /** Whether this tab is the open one. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { tab: 'list', active: true })

  const WIDGETS = {
    list: WorkloadsListWidget,
    topology: WorkloadTopologyWidget,
    domains: WorkloadDomainsWidget
  }

  const widget = computed(
    () => WIDGETS[props.tab as keyof typeof WIDGETS] ?? WorkloadsListWidget
  )
</script>

<template>
  <div class="h-full w-full">
    <component
      :is="widget"
      kind="bare"
      :chrome="false"
      :width="680"
      :active="active"
    />
  </div>
</template>
