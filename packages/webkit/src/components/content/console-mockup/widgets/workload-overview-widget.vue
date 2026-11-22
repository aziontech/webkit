<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, watch } from 'vue'

  import Button from '../../../action/button/button.vue'
  import CopyButton from '../../../action/copy-button/copy-button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import type { TextureVariant } from '../../../content/texture/texture.vue'
  import StatusIndicator from '../../../feedback/status-indicator/status-indicator.vue'
  import Tabs from '../../../navigation/tabs'
  import Avatar from '../../avatar/avatar.vue'
  import Card from '../../card/card.vue'
  import Tag from '../../tag/tag.vue'
  import {
    WORKLOAD_OVERVIEW_FACTS,
    WORKLOAD_OVERVIEW_LINKS,
    WORKLOAD_OVERVIEW_NODES,
    WORKLOAD_OVERVIEW_TABS
  } from '../lib/workload-overview-data'
  import ConsoleMockupShell, {
    type ConsoleMockupShellFade
  } from '../parts/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import WorkloadDeployDrawer from '../parts/workload-deploy-drawer.vue'

  defineOptions({ name: 'WorkloadOverviewWidget' })

  export type ConsoleMockupWorkloadOverviewTab = 'overview' | 'topology' | 'deploy'

  interface Props {
    /** Beat the mockup plays: the page top, the topology scrolled into view, or the deploy drawer open. */
    tab?: ConsoleMockupWorkloadOverviewTab
    /** Edge the mockup fades out along. */
    fade?: ConsoleMockupShellFade
    /** Texture the frame is grounded with. */
    texture?: TextureVariant
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    tab: 'overview',
    fade: 'none',
    texture: 'none',
    active: true
  })

  const SCROLL_INSET = 16

  const topologyEl = ref<globalThis.HTMLElement | null>(null)
  const scrolled = ref(0)

  const measure = () => {
    scrolled.value =
      props.tab === 'topology' && topologyEl.value
        ? Math.max(topologyEl.value.offsetTop - SCROLL_INSET, 0)
        : 0
  }

  const pageStyle = computed(() => ({ translate: `0 -${scrolled.value}px` }))

  onMounted(() => nextTick(measure))
  watch(
    () => props.tab,
    () => nextTick(measure)
  )

  const ENVIRONMENT_SELECT_CLASS =
    'flex h-8 items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default)'

  const NODE_CLASS =
    'min-w-0 self-start rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) shadow-sm ' +
    'data-dashed:border-dashed ' +
    'data-focused:border-(--primary) ' +
    'data-gap:mb-(--spacing-sm)'
</script>

<template>
  <ConsoleMockupShell
    :fade="fade"
    :texture="texture"
    :active="active"
    :width="1320"
    rail="workloads"
    title="Workloads › storefront-prod"
  >
    <div class="flex h-full flex-col">
      <ConsoleMockupShellItem :order="0">
        <div
          class="flex items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-lg) py-(--spacing-sm)"
        >
          <Tabs
            model-value="overview"
            class="-ms-(--spacing-xs) min-w-0 flex-1"
          >
            <Tabs.List>
              <Tabs.Trigger
                v-for="tab in WORKLOAD_OVERVIEW_TABS"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
            </Tabs.List>
          </Tabs>
          <Button
            label="Deploy"
            variant="outline"
            size="medium"
            icon="az az-cloud-upload"
          />
        </div>
      </ConsoleMockupShellItem>

      <div class="relative min-h-0 flex-1 overflow-hidden">
        <div
          :style="pageStyle"
          class="relative flex flex-col gap-(--spacing-xl) px-(--spacing-lg) pt-(--spacing-lg) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
        >
          <ConsoleMockupShellItem :order="1">
            <Card :padded="false">
              <template #default>
                <div
                  class="flex min-h-14 items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-xs)"
                >
                  <div class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                    <i
                      class="az az-domains shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span
                      class="inline-flex items-center gap-(--spacing-2xs) text-body-sm text-(--text-default)"
                    >
                      {{ WORKLOAD_OVERVIEW_FACTS.domain }}
                      <i
                        class="az az-external-link text-body-xs leading-none"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                    <Button
                      label="Visit"
                      variant="secondary"
                      size="medium"
                      icon="az az-external-link"
                    />
                    <span :class="ENVIRONMENT_SELECT_CLASS">
                      <i
                        class="az az-layers shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                      Production
                      <i
                        class="az az-chevron-down shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </span>
                    <IconButton
                      icon="az az-ellipsis"
                      variant="outline"
                      size="medium"
                      ariaLabel="Workload actions"
                    />
                  </div>
                </div>

                <div
                  class="grid grid-cols-4 gap-(--spacing-sm) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md)"
                >
                  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                    <span
                      class="flex items-center gap-(--spacing-2xs) text-label-sm text-(--text-muted)"
                    >
                      Custom domains
                      <i
                        class="az az-circle-plus text-body-sm leading-none"
                        aria-hidden="true"
                      />
                    </span>
                    <div class="flex min-h-7 items-center">
                      <span class="text-body-sm text-(--text-disabled)">None</span>
                    </div>
                  </div>
                  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                    <span class="text-label-sm text-(--text-muted)">Status</span>
                    <div class="flex min-h-7 items-center">
                      <StatusIndicator
                        severity="success"
                        label="Live"
                      />
                    </div>
                  </div>
                  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                    <span class="text-label-sm text-(--text-muted)">Workload ID</span>
                    <div class="flex min-h-7 items-center gap-(--spacing-xs)">
                      <span class="text-body-sm tabular-nums text-(--text-default)">{{
                        WORKLOAD_OVERVIEW_FACTS.id
                      }}</span>
                      <CopyButton
                        variant="outline"
                        :value="WORKLOAD_OVERVIEW_FACTS.id"
                        aria-label="Copy workload ID"
                        size="small"
                      />
                    </div>
                  </div>
                  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                    <span class="text-label-sm text-(--text-muted)">Created</span>
                    <div class="flex min-h-7 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        WORKLOAD_OVERVIEW_FACTS.created
                      }}</span>
                      <Avatar
                        :label="WORKLOAD_OVERVIEW_FACTS.owner"
                        size="small"
                        variant="square"
                      />
                    </div>
                  </div>
                </div>

                <div
                  class="flex min-h-12 items-center gap-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md)"
                >
                  <i
                    class="az az-chevron-down text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="text-label-md text-(--text-default)">Deployment Settings</span>
                  <span
                    class="ms-auto inline-flex items-center gap-(--spacing-2xs) text-body-sm text-(--text-default)"
                  >
                    Azion Default
                    <i
                      class="az az-external-link text-body-xs leading-none"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </template>
            </Card>
          </ConsoleMockupShellItem>

          <div ref="topologyEl">
            <ConsoleMockupShellItem :order="2">
              <div class="flex flex-col gap-(--layout-group-gap)">
                <h2 class="m-0 text-heading-xs text-(--text-default)">Deployment topology</h2>
                <Card
                  :padded="false"
                  class="overflow-hidden bg-(--bg-surface-raised)"
                >
                  <template #default>
                    <div
                      class="grid grid-cols-[1fr_1.5rem_1fr_1.5rem_1fr_1.5rem_1fr_1.5rem] p-(--spacing-md)"
                    >
                      <div
                        v-for="column in WORKLOAD_OVERVIEW_LINKS"
                        :key="column"
                        :style="{ gridColumn: column, gridRow: 1 }"
                        class="relative mt-5 h-px border-t border-dashed border-(--accent)"
                      >
                        <span
                          class="absolute top-1/2 start-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                        <span
                          class="absolute top-1/2 end-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                      </div>
                      <div
                        class="relative"
                        style="grid-column: 6; grid-row: 1"
                      >
                        <span
                          class="absolute top-5 start-0 w-3/4 border-t border-dashed border-(--accent)"
                        />
                        <span
                          class="absolute top-5 bottom-0 start-3/4 border-s border-dashed border-(--accent)"
                        />
                        <span
                          class="absolute top-5 start-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                        <span
                          class="absolute top-5 end-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                      </div>
                      <div
                        class="relative"
                        style="grid-column: 6; grid-row: 2"
                      >
                        <span
                          class="absolute top-0 start-3/4 h-5 border-s border-dashed border-(--accent)"
                        />
                        <span
                          class="absolute top-5 end-0 start-3/4 border-t border-dashed border-(--accent)"
                        />
                        <span
                          class="absolute top-5 end-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                      </div>
                      <div
                        class="relative mt-5 h-px border-t border-dashed border-(--accent)"
                        style="grid-column: 8; grid-row: 1"
                      >
                        <span
                          class="absolute top-1/2 start-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                      </div>
                      <div
                        v-for="node in WORKLOAD_OVERVIEW_NODES"
                        :key="node.key"
                        :style="{ gridColumn: node.column, gridRow: node.row }"
                        :data-dashed="node.dashed || null"
                        :data-focused="(tab === 'topology' && node.key === 'workload') || null"
                        :data-gap="node.key === 'application' || null"
                        :class="NODE_CLASS"
                      >
                        <div
                          class="flex w-full items-center gap-(--spacing-2xs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-2xs)"
                        >
                          <i
                            :class="node.icon"
                            class="shrink-0 text-body-xs leading-none text-(--text-muted)"
                            aria-hidden="true"
                          />
                          <span class="truncate text-label-sm text-(--text-muted)">{{
                            node.kind
                          }}</span>
                          <Tag
                            class="ms-auto shrink-0"
                            :severity="node.severity"
                            :label="node.status"
                            size="small"
                          />
                          <i
                            class="az az-chevron-down shrink-0 text-(--text-muted)"
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)"
                        >
                          <span
                            class="inline-flex min-w-0 items-center gap-(--spacing-2xs) text-body-sm text-(--text-default)"
                          >
                            <span class="truncate">{{ node.name || '—' }}</span>
                            <i
                              v-if="node.link"
                              class="az az-external-link shrink-0 text-body-xs leading-none"
                              aria-hidden="true"
                            />
                          </span>
                          <IconButton
                            v-if="node.status !== 'Live' && node.status !== 'Active'"
                            class="ms-auto shrink-0"
                            icon="az az-plus"
                            variant="outline"
                            size="small"
                            ariaLabel="Bind"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
            </ConsoleMockupShellItem>
          </div>
        </div>
      </div>
    </div>

    <template #overlay>
      <div
        :data-state="tab === 'deploy' ? 'open' : 'closed'"
        class="absolute inset-0 bg-(--bg-backdrop) opacity-0 transition-opacity duration-moderate-02 ease-productive-entrance data-[state=open]:opacity-100 motion-reduce:transition-none"
      />
      <WorkloadDeployDrawer :data-state="tab === 'deploy' ? 'open' : 'closed'" />
    </template>
  </ConsoleMockupShell>
</template>
