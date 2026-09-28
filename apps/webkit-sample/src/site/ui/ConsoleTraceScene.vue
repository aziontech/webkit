<script setup>
  import Flow from '@aziontech/webkit/flow'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TabView from '@aziontech/webkit/tab-view'
  import { formatDuration, RUN_FUNCTION, runById, runPath } from '@shared/ui/trace/run-trace.js'
  import RunLogs from '@shared/ui/trace/RunLogs.vue'
  import RunTrace from '@shared/ui/trace/RunTrace.vue'
  import { computed } from 'vue'

  import { TRACE_TABS } from '../data/console-trace.js'

  const props = defineProps({
    /** Which document is drawn — a `value` of `TRACE_TABS`. */
    tab: { type: String, default: 'trace' },
    /** Which seeded invocation is drawn, by id. */
    run: { type: String, default: '' }
  })

  const step = computed(
    () => TRACE_TABS.find((entry) => entry.value === props.tab) ?? TRACE_TABS[0]
  )
  const record = computed(() => runById(props.run))
  const path = computed(() => runPath(record.value))
</script>

<template>
  <figure
    inert
    aria-hidden="true"
    class="pointer-events-none m-0 flex h-full min-w-0 flex-col overflow-hidden bg-(--bg-canvas) select-none"
  >
    <div
      class="flex shrink-0 items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs)"
    >
      <span class="flex min-w-0 items-center gap-(--spacing-xxs) text-label-sm">
        <i
          :class="RUN_FUNCTION.icon"
          class="text-[length:inherit] leading-none text-(--primary)"
        />
        <span class="text-(--text-muted)">Functions</span>
        <span class="text-(--text-disabled)">/</span>
        <span class="truncate text-(--text-default)">{{ RUN_FUNCTION.name }}</span>
      </span>
      <StatusIndicator
        severity="success"
        :label="`Completed in ${formatDuration(record.duration)}`"
        class="shrink-0"
      />
    </div>

    <div class="shrink-0 border-b border-(--border-default) px-(--spacing-md)">
      <TabView :value="step.value">
        <TabView.List>
          <TabView.Item
            v-for="entry in TRACE_TABS"
            :key="entry.value"
            :value="entry.value"
            :label="entry.label"
          />
        </TabView.List>
      </TabView>
    </div>

    <div class="relative min-h-0 flex-1 overflow-hidden">
      <div
        :key="step.value"
        class="animate-page-enter flex h-full flex-col gap-(--spacing-sm) p-(--spacing-md) [--page-enter-distance:var(--spacing-lg)] motion-reduce:animate-none"
      >
        <span class="shrink-0 truncate text-heading-xs text-(--text-default)">{{ step.title }}</span>

        <RunTrace
          v-if="step.value === 'trace'"
          :spans="record.spans"
          :total="record.duration"
          class="min-h-0"
        />

        <RunLogs
          v-else-if="step.value === 'logs'"
          :logs="record.logs"
          class="min-h-0"
        />

        <Flow
          v-else
          align="start"
          class="[&>div]:w-full"
        >
          <Flow.NodeCard
            v-for="node in path"
            :key="node.key"
            :eyebrow="node.eyebrow"
            :icon="node.icon"
            :title="node.title"
            :label="node.label"
            :severity="node.severity"
            :terminal="Boolean(node.terminal)"
            class="min-w-[11rem] flex-1"
          >
            <div
              v-for="field in node.fields"
              :key="field.label"
              class="flex min-w-0 flex-col gap-(--spacing-xxs)"
            >
              <span class="text-label-sm text-(--text-muted)">{{ field.label }}</span>
              <span class="truncate text-body-xs text-(--text-default)">{{ field.value }}</span>
            </div>
          </Flow.NodeCard>
        </Flow>
      </div>
    </div>
  </figure>
</template>
