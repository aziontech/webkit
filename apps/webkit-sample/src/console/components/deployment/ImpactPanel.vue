<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Flow from '@aziontech/webkit/flow'
  import FlowAnchor from '@aziontech/webkit/flow-anchor'
  import Message from '@aziontech/webkit/message'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  interface Props {
    state?: string
    tree?: unknown[]
    reason?: string
    settingsCount?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    state: 'empty',
    tree: () => [],
    reason: '',
    settingsCount: 0
  })

  const emit = defineEmits<{
    retry: []
  }>()

  const view = defineModel('view', { type: String, default: 'tree' })

  const unavailableMessage = computed(() => {
    if (props.reason === 'partial') {
      return 'The workloads list was truncated, so these numbers may be incomplete. You can still deploy.'
    }
    return 'The workloads that deploy with these settings could not be read, so the impact is unknown. Retry, or deploy without the preview.'
  })

  const plural = (count, singular, pluralWord) => `${count} ${count === 1 ? singular : pluralWord}`
</script>

<template>
  <div
    class="flex min-w-0 flex-col gap-(--spacing-sm)"
    style="--tree-rail: var(--spacing-sm); --tree-indent: calc(var(--spacing-sm) * 2)"
  >
    <p
      v-if="state === 'empty'"
      class="text-body-sm text-(--text-muted)"
    >
      Select Deployment settings to see what this release reaches.
    </p>

    <div
      v-else-if="state === 'loading'"
      class="flex min-w-0 flex-col gap-(--spacing-sm)"
    >
      <span class="flex items-center gap-(--spacing-xs)">
        <Spinner class="size-4 shrink-0 text-(--text-muted)" />
        <span class="text-body-sm text-(--text-muted)">Computing impact…</span>
      </span>
      <Skeleton height="var(--size-4)" />
      <Skeleton
        height="var(--size-4)"
        width="80%"
      />
      <Skeleton
        height="var(--size-4)"
        width="60%"
      />
    </div>

    <div
      v-else-if="state === 'unavailable'"
      class="flex min-w-0 flex-col items-start gap-(--spacing-sm)"
    >
      <Message
        severity="warning"
        size="small"
        :label="unavailableMessage"
      />
      <span class="text-body-xs text-(--text-muted)">
        {{ plural(settingsCount, 'Deployment setting', 'Deployment settings') }} selected
      </span>
      <Button
        label="Retry"
        kind="outlined"
        size="small"
        icon="pi pi-refresh"
        @click="emit('retry')"
      />
    </div>

    <template v-else>
      <Message
        v-if="reason === 'partial'"
        severity="warning"
        size="small"
        label="The workloads list was truncated, so these numbers may be incomplete."
      />

      <ul
        v-if="view === 'tree'"
        class="m-0 flex min-w-0 list-none flex-col p-0"
      >
        <li
          v-for="settings in tree"
          :key="settings.id"
          class="flex min-w-0 flex-col"
        >
          <span
            class="flex min-h-8 min-w-0 items-center justify-between gap-(--spacing-xs) pr-(--spacing-xxs)"
          >
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i
                class="ai ai-deploy-pillar shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-label-md text-(--text-default)">
                {{ settings.name }}
              </span>
            </span>
            <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
              {{ plural(settings.domainsCount, 'domain', 'domains') }}
            </span>
          </span>

          <p
            v-if="!settings.environments.length"
            class="pl-(--tree-indent) text-body-xs text-(--text-muted)"
          >
            No workloads deploy with this setting yet.
          </p>

          <ul
            v-else
            class="m-0 flex min-w-0 list-none flex-col p-0 pl-(--tree-indent)"
          >
            <li
              v-for="environment in settings.environments"
              :key="environment.id"
              class="relative flex min-w-0 flex-col before:absolute before:top-0 before:-left-(--tree-rail) before:h-4 before:w-(--tree-rail) before:rounded-bl-(--shape-elements) before:border-b before:border-l before:border-(--border-default) before:content-[''] after:absolute after:top-4 after:bottom-0 after:-left-(--tree-rail) after:border-l after:border-(--border-default) after:content-[''] last:after:hidden"
            >
              <span
                class="flex min-h-8 min-w-0 items-center justify-between gap-(--spacing-xs) pr-(--spacing-xxs)"
              >
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="pi pi-sitemap shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate text-label-md text-(--text-default)">
                    {{ environment.name }}
                  </span>
                </span>
                <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                  {{ plural(environment.workloadsCount, 'workload', 'workloads') }}
                </span>
              </span>

              <ul class="m-0 flex min-w-0 list-none flex-col p-0 pl-(--tree-indent)">
                <li
                  v-for="workload in environment.workloads"
                  :key="workload.id"
                  class="relative flex min-w-0 before:absolute before:top-0 before:-left-(--tree-rail) before:h-4 before:w-(--tree-rail) before:rounded-bl-(--shape-elements) before:border-b before:border-l before:border-(--border-default) before:content-[''] after:absolute after:top-4 after:bottom-0 after:-left-(--tree-rail) after:border-l after:border-(--border-default) after:content-[''] last:after:hidden"
                >
                  <span
                    class="flex min-h-8 min-w-0 flex-1 items-center justify-between gap-(--spacing-xs) pr-(--spacing-xxs)"
                  >
                    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="ai ai-workloads shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate text-label-md text-(--text-muted)">
                        {{ workload.name }}
                      </span>
                    </span>
                    <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                      {{ plural(workload.domainsCount, 'domain', 'domains') }}
                    </span>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>

      <div
        v-else
        class="flex min-w-0 flex-col gap-(--spacing-md)"
      >
        <Flow
          v-for="settings in tree"
          :key="settings.id"
          align="start"
          class="p-0"
        >
          <Flow.Node unstyled>
            <FlowAnchor>
              <span
                class="flex min-w-0 flex-col gap-(--spacing-xxs) rounded-(--shape-card) border border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
              >
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="ai ai-deploy-pillar shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate text-label-md text-(--text-default)">
                    {{ settings.name }}
                  </span>
                </span>
                <span class="text-body-xs tabular-nums text-(--text-muted)">
                  {{ plural(settings.domainsCount, 'domain', 'domains') }}
                </span>
              </span>
            </FlowAnchor>
          </Flow.Node>

          <Flow.Node
            v-if="!settings.environments.length"
            terminal
            unstyled
          >
            <FlowAnchor>
              <span
                class="flex rounded-(--shape-card) border border-(length:--border-width-default) border-dashed border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs) text-body-xs text-(--text-muted)"
              >
                No workloads yet
              </span>
            </FlowAnchor>
          </Flow.Node>

          <Flow.Parallel
            v-else
            align="start"
          >
            <Flow.Node
              v-for="environment in settings.environments"
              :key="environment.id"
              terminal
              unstyled
            >
              <FlowAnchor>
                <span
                  class="flex min-w-0 max-w-(--container-3xs) flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
                >
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-sitemap shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-md text-(--text-default)">
                      {{ environment.name }}
                    </span>
                    <Tag
                      :label="String(environment.workloadsCount)"
                      severity="secondary"
                      size="small"
                    />
                  </span>

                  <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <span
                      v-for="workload in environment.workloads"
                      :key="workload.id"
                      class="flex min-w-0 items-center gap-(--spacing-xs)"
                    >
                      <i
                        class="ai ai-workloads shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate text-body-sm text-(--text-muted)">
                        {{ workload.name }}
                      </span>
                    </span>
                  </span>
                </span>
              </FlowAnchor>
            </Flow.Node>
          </Flow.Parallel>
        </Flow>
      </div>
    </template>
  </div>
</template>
