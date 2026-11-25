<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import type { InvocationsFunction, InvocationsInvocation } from '../detail-invocations.vue'
  import { formatInvocationTime } from '../invocations-format'

  export interface InvocationSummaryCardProps {
    /** The invocation the card describes. */
    run: InvocationsInvocation
    /** The function that ran. */
    fn: InvocationsFunction
    /** Recent invocations the Recent menu lists. */
    runs: InvocationsInvocation[]
    /** Color of the invocation status. */
    severity: StatusIndicatorSeverity
    /** The invocation is still running. */
    running: boolean
    /** The started, completed, duration and location facts. */
    facts: { label: string; value: string }[]
  }

  defineProps<InvocationSummaryCardProps>()

  const emit = defineEmits<{
    replay: [event: MouseEvent]
    pick: [id: string]
    'invocation-action': [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: DropdownMenuItemValue
    ]
  }>()

  const { formatDate } = useLocale()
  const formatTime = (value: Date) => formatInvocationTime(formatDate, value)

  const FOOTER_BAND_CLASS =
    '@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) ' +
    'py-(--spacing-xs)'
</script>

<template>
  <Card :padded="false">
    <template #default>
      <div
        class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
      >
        <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
          <i
            class="az az-functions shrink-0 text-body-lg text-(--text-muted)"
            aria-hidden="true"
          />
          <div class="flex min-w-0 max-w-1/2 shrink-0">
            <Tooltip
              :content="`Open ${fn.name} in Functions`"
              class="w-full"
            >
              <Link
                :label="fn.name"
                :href="`/functions/${fn.id}`"
                size="small"
              />
            </Tooltip>
          </div>
          <span
            class="shrink-0 text-(--text-muted)"
            aria-hidden="true"
            >/</span
          >
          <span class="truncate text-label-code-sm text-(--text-muted)">{{ run.id }}</span>
          <CopyButton
            variant="outline"
            :value="run.id"
            aria-label="Copy invocation ID"
            class="shrink-0"
            size="small"
          />
          <StatusIndicator
            :severity="severity"
            :loading="running"
            :label="run.status"
            class="shrink-0"
          />
        </div>

        <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            label="Replay"
            variant="secondary"
            size="medium"
            icon="az az-replay"
            :disabled="running"
            @click="(event: MouseEvent) => emit('replay', event)"
          />

          <DropdownMenu
            side="bottom"
            align="end"
            @select="(_event, value) => emit('pick', String(value))"
          >
            <DropdownMenu.Trigger>
              <Tooltip content="Pick another invocation of this function">
                <Button
                  label="Recent"
                  variant="outline"
                  size="medium"
                  icon="az az-history"
                />
              </Tooltip>
            </DropdownMenu.Trigger>

            <DropdownMenu.Group label="Recent invocations">
              <DropdownMenu.Item
                v-for="option in runs"
                :key="option.id"
                :value="option.id"
                :label="option.id"
                :selected="option.id === run.id"
              >
                <template #trailing>
                  <span class="text-label-sm text-(--text-muted)">
                    {{ option.status }} · {{ formatTime(option.startedAt) }}
                  </span>
                </template>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu>

          <DropdownMenu
            side="bottom"
            align="end"
            @select="(event, value) => emit('invocation-action', event, value)"
          >
            <DropdownMenu.Trigger>
              <Tooltip content="Invocation actions">
                <IconButton
                  icon="az az-ellipsis"
                  variant="outline"
                  size="medium"
                  aria-label="Invocation actions"
                />
              </Tooltip>
            </DropdownMenu.Trigger>

            <DropdownMenu.Group>
              <DropdownMenu.Item
                value="events"
                label="Open in Real-Time Events"
              >
                <template #leading>
                  <i
                    class="az az-real-time-events"
                    aria-hidden="true"
                  />
                </template>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                value="settings"
                label="Function settings"
              >
                <template #leading>
                  <i
                    class="az az-settings"
                    aria-hidden="true"
                  />
                </template>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu>
        </div>
      </div>

      <div
        class="grid grid-cols-2 gap-(--spacing-sm) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) sm:grid-cols-4"
      >
        <div
          v-for="fact in facts"
          :key="fact.label"
          class="flex min-w-0 flex-col gap-(--spacing-2xs)"
        >
          <span class="text-label-sm text-(--text-muted)">{{ fact.label }}</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <span class="truncate text-body-sm tabular-nums text-(--text-default)">
              {{ fact.value }}
            </span>
          </div>
        </div>
      </div>

      <div :class="FOOTER_BAND_CLASS">
        <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
          <i
            :data-severity="severity"
            class="az az-arrow-right shrink-0 text-(--text-muted) data-[severity=danger]:text-(--danger-foreground)"
            aria-hidden="true"
          />
          <span class="truncate text-label-code-sm text-(--text-muted)">{{ run.trigger }}</span>
          <CopyButton
            variant="outline"
            :value="run.trigger"
            aria-label="Copy the request that triggered this invocation"
            class="shrink-0"
            size="small"
          />
        </div>
        <span
          :data-severity="severity"
          class="min-w-0 text-body-xs text-(--text-muted) data-[severity=danger]:text-(--danger-foreground)"
        >
          {{ run.outcome }}
        </span>
      </div>
    </template>
  </Card>
</template>
