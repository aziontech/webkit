<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  type RunStatus = 'Completed' | 'Failed' | 'Running'
  type Run = {
    id: string
    status: RunStatus
    started: string
    completed: string
    duration: string
    location: string
    trigger: string
    outcome: string
  }

  const runs: Run[] = [
    {
      id: 'inv_8f2c1a9d',
      status: 'Completed',
      started: 'Nov 12, 14:02:11 UTC',
      completed: 'Nov 12, 14:02:11 UTC',
      duration: '184 ms',
      location: 'San Francisco, US',
      trigger: 'GET https://images.example.com/products/42.jpg?w=640',
      outcome: '200 OK · 48.2 KB returned'
    },
    {
      id: 'inv_7d41be02',
      status: 'Failed',
      started: 'Nov 12, 13:58:40 UTC',
      completed: 'Nov 12, 13:58:41 UTC',
      duration: '1.2 s',
      location: 'Chicago, US',
      trigger: 'GET https://images.example.com/products/17.png?w=1280',
      outcome: '500 · TypeError: Cannot read properties of undefined (reading "width")'
    },
    {
      id: 'inv_6a90c3f7',
      status: 'Completed',
      started: 'Nov 12, 13:51:05 UTC',
      completed: 'Nov 12, 13:51:05 UTC',
      duration: '97 ms',
      location: 'New York, US',
      trigger: 'GET https://images.example.com/banners/fall.webp?w=960',
      outcome: '200 OK · 112.6 KB returned'
    }
  ]

  const severities: Record<RunStatus, StatusIndicatorSeverity> = {
    Completed: 'success',
    Failed: 'danger',
    Running: 'warning'
  }

  const runId = ref(runs[0].id)
  const run = computed(() => runs.find((entry) => entry.id === runId.value) ?? runs[0])
  const severity = computed(() => severities[run.value.status])
  const facts = computed(() => [
    { label: 'Started', value: run.value.started },
    { label: 'Completed', value: run.value.completed },
    { label: 'Duration', value: run.value.duration },
    { label: 'Location', value: run.value.location }
  ])
</script>

<template>
  <Card :padded="false">
    <template #content>
      <div
        class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
      >
        <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
          <i
            class="ai ai-edge-functions shrink-0 text-body-lg text-(--text-muted)"
            aria-hidden="true"
          />
          <div class="flex min-w-0">
            <Tooltip
              text="Open image-resizer in Functions"
              class="w-full"
            >
              <a
                href="/functions/40122"
                class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
              >
                <span class="truncate underline-offset-2 group-hover/link:underline"
                  >image-resizer</span
                >
              </a>
            </Tooltip>
          </div>
          <span
            class="shrink-0 text-(--text-muted)"
            aria-hidden="true"
            >/</span
          >
          <span class="truncate text-label-code-sm text-(--text-muted)">{{ run.id }}</span>
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

        <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            label="Replay"
            kind="secondary"
            size="medium"
            icon="pi pi-replay"
          />

          <Tooltip text="Pick another invocation of this function">
            <DropdownMenu
              placement="bottom-end"
              @select="(_event, value) => (runId = String(value))"
            >
              <DropdownMenu.Trigger>
                <span
                  class="flex h-8 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong)"
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
              </DropdownMenu.Trigger>

              <DropdownMenu.Group label="Recent invocations">
                <DropdownMenu.Option
                  v-for="option in runs"
                  :key="option.id"
                  :value="option.id"
                  :label="option.id"
                  :selected="option.id === run.id"
                >
                  <template #right>
                    <span class="text-label-sm text-(--text-muted)">
                      {{ option.status }} · {{ option.started }}
                    </span>
                  </template>
                </DropdownMenu.Option>
              </DropdownMenu.Group>
            </DropdownMenu>
          </Tooltip>

          <DropdownMenu placement="bottom-end">
            <DropdownMenu.Trigger>
              <Tooltip text="Invocation actions">
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="outlined"
                  size="medium"
                  aria-label="Invocation actions"
                />
              </Tooltip>
            </DropdownMenu.Trigger>

            <DropdownMenu.Group>
              <DropdownMenu.Option
                value="events"
                label="Open in Real-Time Events"
              >
                <template #left>
                  <i
                    class="ai ai-real-time-events"
                    aria-hidden="true"
                  />
                </template>
              </DropdownMenu.Option>
              <DropdownMenu.Option
                value="settings"
                label="Function settings"
              >
                <template #left>
                  <i
                    class="pi pi-cog"
                    aria-hidden="true"
                  />
                </template>
              </DropdownMenu.Option>
            </DropdownMenu.Group>
          </DropdownMenu>
        </div>
      </div>

      <div
        class="@container/band grid grid-cols-2 gap-(--spacing-sm) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) sm:grid-cols-4"
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
      </div>

      <div
        class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xs)"
      >
        <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
          <i
            :data-severity="severity"
            class="pi pi-arrow-right shrink-0 text-(--text-muted) data-[severity=danger]:text-(--danger-contrast)"
            aria-hidden="true"
          />
          <span class="truncate text-label-code-sm text-(--text-muted)">{{ run.trigger }}</span>
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
      </div>
    </template>
  </Card>
</template>
