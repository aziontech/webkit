<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { formatDuration } from '@shared/ui/trace/run-trace.js'
  import { computed } from 'vue'

  import { relativeTime } from '../../lib/format/relative-time'
  import ResourceLink from '../resource/ResourceLink.vue'
  import SummaryBand from '../resource/SummaryBand.vue'

  interface Props {
    run: Record<string, unknown>
    runs?: unknown[]
    fn: Record<string, unknown>
    email?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    runs: () => [],
    email: ''
  })

  const runId = defineModel('runId', { type: String, default: '' })

  const emit = defineEmits<{
    replay: []
    logs: []
    settings: []
  }>()

  const SEVERITY = { Completed: 'success', Failed: 'danger', Running: 'warning' }
  const severity = computed(() => SEVERITY[props.run.status] ?? 'neutral')

  const completedAt = computed(() =>
    props.run.status === 'Running'
      ? null
      : new Date(new Date(props.run.startedAt).getTime() + props.run.duration)
  )

  const facts = computed(() => [
    { label: 'Started', value: relativeTime(props.run.startedAt) },
    { label: 'Completed', value: completedAt.value ? relativeTime(completedAt.value) : '—' },
    { label: 'Duration', value: formatDuration(props.run.duration) },
    { label: 'Edge location', value: props.run.region }
  ])

  const functionRoute = computed(() => ({
    path: `/functions/${props.fn.id}`,
    query: { email: props.email || undefined }
  }))

  const onAction = (value) => {
    if (value === 'logs') return emit('logs')
    if (value === 'settings') return emit('settings')
  }
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <SummaryBand kind="subject">
        <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
          <i
            :class="fn.icon"
            class="shrink-0 text-body-lg text-(--text-muted)"
            aria-hidden="true"
          />
          <ResourceLink
            :label="fn.name"
            :to="functionRoute"
            module="Function"
          />
          <span
            class="shrink-0 text-(--text-disabled)"
            aria-hidden="true"
            >/</span
          >
          <span class="truncate font-mono text-body-sm text-(--text-muted)">{{ run.id }}</span>
          <CopyButton
            kind="outlined"
            :value="run.id"
            aria-label="Copy invocation ID"
            class="shrink-0"
          />
          <StatusIndicator
            :severity="severity"
            :label="run.status"
            class="shrink-0"
          />
        </div>

        <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            label="Replay"
            kind="secondary"
            size="medium"
            icon="pi pi-replay"
            @click="emit('replay')"
          />

          <Tooltip text="Pick another invocation of this function">
            <Dropdown
              placement="bottom-end"
              @select="(event, value) => (runId = value)"
            >
              <Dropdown.Trigger>
                <span
                  class="flex h-8 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out hover:border-(--border-strong) motion-reduce:transition-none"
                >
                  <i
                    class="pi pi-history shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate">Recent</span>
                  <i
                    class="pi pi-chevron-down shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                </span>
              </Dropdown.Trigger>

              <Dropdown.Group label="Recent invocations">
                <Dropdown.Option
                  v-for="option in runs"
                  :key="option.id"
                  :value="option.id"
                  :selected="option.id === run.id"
                >
                  <span class="font-mono">{{ option.id }}</span>
                  <template #right>
                    <span class="text-label-sm text-(--text-muted)">
                      {{ option.status }} · {{ relativeTime(option.startedAt) }}
                    </span>
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
            </Dropdown>
          </Tooltip>

          <Dropdown
            placement="bottom-end"
            @select="(event, value) => onAction(value)"
          >
            <Dropdown.Trigger>
              <Tooltip text="Invocation actions">
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="outlined"
                  size="medium"
                  aria-label="Invocation actions"
                />
              </Tooltip>
            </Dropdown.Trigger>

            <Dropdown.Group>
              <Dropdown.Option
                value="logs"
                label="Open in Real-Time Events"
              >
                <template #left>
                  <i
                    class="ai ai-real-time-events"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
              <Dropdown.Option
                value="settings"
                label="Function settings"
              >
                <template #left>
                  <i
                    class="pi pi-cog"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
            </Dropdown.Group>
          </Dropdown>
        </div>
      </SummaryBand>

      <SummaryBand
        kind="facts"
        class="grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-4"
      >
        <div
          v-for="fact in facts"
          :key="fact.label"
          class="flex min-w-0 flex-col gap-(--spacing-xxs)"
        >
          <span class="text-label-sm text-(--text-muted)">{{ fact.label }}</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <span class="truncate text-body-sm tabular-nums text-(--text-default)">
              {{ fact.value }}
            </span>
          </div>
        </div>
      </SummaryBand>

      <SummaryBand kind="state">
        <div class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
          <i
            :data-severity="severity"
            class="pi pi-arrow-right shrink-0 text-(--text-muted) data-[severity=danger]:text-(--danger-contrast)"
            aria-hidden="true"
          />
          <span class="truncate font-mono text-body-xs text-(--text-muted)">{{ run.trigger }}</span>
          <CopyButton
            kind="outlined"
            :value="run.trigger"
            aria-label="Copy the request that triggered this invocation"
            class="shrink-0"
          />
        </div>
        <span
          :data-severity="severity"
          class="min-w-0 text-body-xs text-(--text-muted) data-[severity=danger]:text-(--danger-contrast)"
        >
          {{ run.outcome }}
        </span>
      </SummaryBand>
    </template>
  </CardBox>
</template>
