<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import LogView from '../../../components/code/log-view/log-view.vue'
  import LogViewContent from '../../../components/code/log-view/log-view-content.vue'
  import LogViewHeader from '../../../components/code/log-view/log-view-header.vue'
  import Trace from '../../../components/code/trace/trace.vue'
  import ShellMockup from '../../../components/content/shell-mockup/shell-mockup.vue'
  import Tag from '../../../components/content/tag/tag.vue'
  import Flow from '../../../components/data/flow/flow.vue'
  import FlowAnchor from '../../../components/data/flow/flow-anchor/flow-anchor.vue'
  import FlowNode from '../../../components/data/flow/flow-node/flow-node.vue'
  import StatusIndicator from '../../../components/feedback/status-indicator/status-indicator.vue'
  import TabsItem from '../../../components/navigation/tabs/tabs-item.vue'
  import TabsList from '../../../components/navigation/tabs/tabs-list.vue'
  import TabsRoot from '../../../components/navigation/tabs/tabs-root.vue'
  import {
    CONSOLE_TRACE_FUNCTION,
    CONSOLE_TRACE_LOGS,
    CONSOLE_TRACE_PATH,
    CONSOLE_TRACE_SPANS,
    CONSOLE_TRACE_STEPS,
    type ConsoleTraceSceneTab
  } from './console-trace-data'

  defineOptions({ name: 'ConsoleTraceScene', inheritAttrs: false })

  export type { ConsoleTraceSceneTab } from './console-trace-data'

  interface Props {
    /** Document of the invocation the scene shows; empty or unknown shows the first, `trace`. */
    tab?: ConsoleTraceSceneTab | string
    /** Whether this scene is the one showing; the page entrance replays each time it turns back on. */
    active?: boolean
    /** Plays the page entrance; off draws the document in place. */
    animated?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    tab: '',
    active: true,
    animated: true
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'assets-console-trace-scene'
  )

  const step = computed(
    () => CONSOLE_TRACE_STEPS.find((entry) => entry.value === props.tab) ?? CONSOLE_TRACE_STEPS[0]
  )

  const pageKey = computed(() => `${step.value.value}-${props.active}`)

  const lines = CONSOLE_TRACE_LOGS.map((line, index) => ({
    id: String(index),
    time: formatDuration(line.at),
    type:
      line.level === 'warn' || line.level === 'error'
        ? ('warning' as const)
        : index === CONSOLE_TRACE_LOGS.length - 1
          ? ('success' as const)
          : ('text' as const),
    message: `${line.level.toUpperCase().padEnd(5, ' ')}  ${line.message}`
  }))

  function formatDuration(ms: number): string {
    return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`
  }
</script>

<template>
  <ShellMockup
    v-bind="$attrs"
    :data-testid="testId"
    :data-tab="step.value"
    :width="760"
    :chrome="false"
    :active="active"
    :animated="animated"
  >
    <div class="flex h-full min-w-0 flex-col">
      <div
        class="flex shrink-0 items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs)"
      >
        <span class="flex min-w-0 items-center gap-(--spacing-xxs) text-label-sm">
          <i
            :class="CONSOLE_TRACE_FUNCTION.icon"
            class="shrink-0 leading-none text-(--primary)"
            aria-hidden="true"
          />
          <span class="text-(--text-muted)">Functions</span>
          <span class="text-(--text-disabled)">/</span>
          <span class="truncate text-(--text-default)">{{ CONSOLE_TRACE_FUNCTION.name }}</span>
        </span>
        <StatusIndicator
          severity="success"
          :label="`Completed in ${formatDuration(CONSOLE_TRACE_FUNCTION.duration)}`"
          class="shrink-0"
        />
      </div>

      <div class="shrink-0 border-b border-(--border-default) px-(--spacing-md)">
        <TabsRoot :model-value="step.value">
          <TabsList>
            <TabsItem
              v-for="entry in CONSOLE_TRACE_STEPS"
              :key="entry.value"
              :value="entry.value"
              :label="entry.label"
            />
          </TabsList>
        </TabsRoot>
      </div>

      <div
        :key="pageKey"
        :data-animated="animated || null"
        :data-testid="`${testId}__page`"
        class="flex min-h-0 flex-1 flex-col gap-(--spacing-sm) overflow-hidden p-(--spacing-md) [--page-enter-distance:var(--spacing-lg)] data-animated:animate-page-enter motion-reduce:animate-none"
      >
        <span class="shrink-0 truncate text-heading-xs text-(--text-default)">{{
          step.title
        }}</span>

        <Trace
          v-if="step.value === 'trace'"
          :spans="CONSOLE_TRACE_SPANS"
          :aria-label="step.title"
          class="min-h-0"
        />

        <LogView
          v-else-if="step.value === 'logs'"
          :lines="lines"
          :copyable="false"
          class="min-h-0"
        >
          <LogViewHeader />
          <LogViewContent />
        </LogView>

        <Flow
          v-else
          align="start"
          class="[&>div]:w-full"
        >
          <FlowNode
            v-for="node in CONSOLE_TRACE_PATH"
            :key="node.key"
            unstyled
            :terminal="Boolean(node.terminal)"
            class="flex min-w-44 flex-1 flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs)"
          >
            <FlowAnchor>
              <div
                class="flex w-full items-center gap-(--spacing-xxs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs)"
              >
                <i
                  :class="node.icon"
                  class="shrink-0 text-label-sm leading-none text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate text-label-sm text-(--text-muted)">{{ node.eyebrow }}</span>
                <Tag
                  class="ms-auto shrink-0"
                  :severity="node.severity"
                  :label="node.label"
                  size="small"
                />
              </div>
            </FlowAnchor>
            <span
              class="min-w-0 truncate px-(--spacing-md) pb-(--spacing-sm) text-label-sm text-(--text-default)"
              >{{ node.title }}</span
            >
            <div
              class="flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md)"
            >
              <div
                v-for="field in node.fields"
                :key="field.label"
                class="flex min-w-0 flex-col gap-(--spacing-xxs)"
              >
                <span class="text-label-sm text-(--text-muted)">{{ field.label }}</span>
                <span class="truncate text-body-xs text-(--text-default)">{{ field.value }}</span>
              </div>
            </div>
          </FlowNode>
        </Flow>
      </div>
    </div>
  </ShellMockup>
</template>
