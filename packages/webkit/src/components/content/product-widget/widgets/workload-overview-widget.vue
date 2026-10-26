<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import CopyButton from '../../../actions/copy-button/copy-button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import Avatar from '../../../avatar/avatar.vue'
  import StatusIndicator from '../../../feedback/status-indicator/status-indicator.vue'
  import RadioButton from '../../../inputs/radio-button/radio-button.vue'
  import type { TextureMaterialKind } from '../../../marketing/texture-material/texture-material.vue'
  import TabView from '../../../navigation/tab-view/index.js'
  import Tag, { type TagSeverity } from '../../../tag/tag.vue'
  import CardBox from '../../card-box/card-box.vue'
  import ShellMockup, { type ShellMockupFade } from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'

  defineOptions({ name: 'WorkloadOverviewWidget' })

  export type WorkloadOverviewTab = 'overview' | 'topology' | 'deploy'

  interface Props {
    /** Beat the mockup plays: the page top, the topology scrolled into view, or the deploy drawer open. */
    tab?: WorkloadOverviewTab
    /** Edge the mockup fades out along. */
    fade?: ShellMockupFade
    /** Texture the frame is grounded with. */
    texture?: TextureMaterialKind
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    tab: 'overview',
    fade: 'none',
    texture: 'none',
    active: true
  })

  interface TopologyNode {
    key: string
    kind: string
    icon: string
    name: string
    status: string
    severity: TagSeverity
    link?: boolean
    dashed?: boolean
    column: number
    row: number
  }

  const SCROLL_INSET = 16

  const topologyRef = ref<globalThis.HTMLElement | null>(null)
  const scrolled = ref(0)

  const measure = () => {
    scrolled.value =
      props.tab === 'topology' && topologyRef.value
        ? Math.max(topologyRef.value.offsetTop - SCROLL_INSET, 0)
        : 0
  }

  const pageStyle = computed(() => ({ translate: `0 -${scrolled.value}px` }))

  onMounted(() => nextTick(measure))
  watch(
    () => props.tab,
    () => nextTick(measure)
  )

  const TABS = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]

  const FACTS = {
    domain: 'w1082318.azion.run',
    id: '1082318',
    created: 'Jul 13 by Jordan Avery',
    owner: 'JA'
  }

  const NODES: TopologyNode[] = [
    {
      key: 'domains',
      kind: 'Domains',
      icon: 'ai ai-domains',
      name: FACTS.domain,
      status: '1 domain',
      severity: 'secondary',
      column: 1,
      row: 1
    },
    {
      key: 'workload',
      kind: 'Workload',
      icon: 'ai ai-workloads',
      name: 'storefront-prod',
      status: 'Live',
      severity: 'success',
      link: true,
      column: 3,
      row: 1
    },
    {
      key: 'firewall',
      kind: 'Firewall',
      icon: 'ai ai-edge-firewall',
      name: '',
      status: 'Not bound',
      severity: 'secondary',
      dashed: true,
      column: 5,
      row: 1
    },
    {
      key: 'application',
      kind: 'Application',
      icon: 'ai ai-edge-application',
      name: 'storefront-prod',
      status: 'Active',
      severity: 'success',
      link: true,
      column: 7,
      row: 1
    },
    {
      key: 'custom-page',
      kind: 'Custom Page',
      icon: 'ai ai-custom-pages',
      name: '',
      status: 'Not bound',
      severity: 'secondary',
      dashed: true,
      column: 7,
      row: 2
    }
  ]

  const LINKS = [2, 4]

  const SELECTED_ENVIRONMENT = 'Production'

  const ENVIRONMENTS = [
    {
      name: 'Production',
      tag: 'Last used',
      selected: true,
      description: 'Live traffic. One version serves the domain, and deploying replaces it.'
    },
    {
      name: 'Preview',
      tag: '',
      selected: false,
      description:
        'Every other branch. Each version keeps its own URL, so a build can be read before it is live.'
    }
  ]
</script>

<template>
  <ShellMockup
    :fade="fade"
    :texture="texture"
    :active="active"
    :width="1320"
    rail="workloads"
    title="Workloads › storefront-prod"
  >
    <div class="flex h-full flex-col">
      <ShellMockupPart :order="0">
        <div
          class="flex items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-lg) py-(--spacing-sm)"
        >
          <TabView
            value="overview"
            class="-ml-(--spacing-xs) min-w-0 flex-1"
          >
            <TabView.List>
              <TabView.Item
                v-for="tab in TABS"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
            </TabView.List>
          </TabView>
          <Button
            label="Deploy"
            kind="outlined"
            size="medium"
            icon="pi pi-cloud-upload"
          />
        </div>
      </ShellMockupPart>

      <div class="relative min-h-0 flex-1 overflow-hidden">
        <div
          :style="pageStyle"
          class="relative flex flex-col gap-(--spacing-xl) px-(--spacing-lg) pt-(--spacing-lg) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
        >
          <ShellMockupPart :order="1">
            <CardBox :padded="false">
              <template #content>
                <div
                  class="flex min-h-14 items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-xs)"
                >
                  <div class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                    <i
                      class="ai ai-domains shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span
                      class="inline-flex items-center gap-(--spacing-xxs) text-body-sm text-(--text-default)"
                    >
                      {{ FACTS.domain }}
                      <i
                        class="pi pi-external-link text-body-xs leading-none"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                    <Button
                      label="Visit"
                      kind="secondary"
                      size="medium"
                      icon="pi pi-external-link"
                    />
                    <span
                      class="flex h-8 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default)"
                    >
                      <i
                        class="ai ai-layers shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                      Production
                      <i
                        class="pi pi-chevron-down shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </span>
                    <IconButton
                      icon="pi pi-ellipsis-h"
                      kind="outlined"
                      size="medium"
                      ariaLabel="Workload actions"
                    />
                  </div>
                </div>

                <div
                  class="grid grid-cols-4 gap-(--spacing-sm) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md)"
                >
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <span
                      class="flex items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)"
                    >
                      Custom domains
                      <i
                        class="pi pi-plus-circle text-body-sm leading-none"
                        aria-hidden="true"
                      />
                    </span>
                    <div class="flex min-h-7 items-center">
                      <span class="text-body-sm text-(--text-disabled)">None</span>
                    </div>
                  </div>
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <span class="text-label-sm text-(--text-muted)">Status</span>
                    <div class="flex min-h-7 items-center">
                      <StatusIndicator
                        severity="success"
                        label="Live"
                      />
                    </div>
                  </div>
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <span class="text-label-sm text-(--text-muted)">Workload ID</span>
                    <div class="flex min-h-7 items-center gap-(--spacing-xs)">
                      <span class="text-body-sm tabular-nums text-(--text-default)">{{
                        FACTS.id
                      }}</span>
                      <CopyButton
                        kind="outlined"
                        :value="FACTS.id"
                        aria-label="Copy workload ID"
                      />
                    </div>
                  </div>
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <span class="text-label-sm text-(--text-muted)">Created</span>
                    <div class="flex min-h-7 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        FACTS.created
                      }}</span>
                      <Avatar
                        :label="FACTS.owner"
                        size="small"
                        kind="square"
                      />
                    </div>
                  </div>
                </div>

                <div
                  class="flex min-h-12 items-center gap-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md)"
                >
                  <i
                    class="pi pi-angle-down text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="text-label-md text-(--text-default)">Deployment Settings</span>
                  <span
                    class="ml-auto inline-flex items-center gap-(--spacing-xxs) text-body-sm text-(--text-default)"
                  >
                    Azion Default
                    <i
                      class="pi pi-external-link text-body-xs leading-none"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </template>
            </CardBox>
          </ShellMockupPart>

          <div ref="topologyRef">
            <ShellMockupPart :order="2">
              <div class="flex flex-col gap-(--layout-group-gap)">
                <h2 class="m-0 text-heading-xs text-(--text-default)">Deployment topology</h2>
                <CardBox
                  :padded="false"
                  class="overflow-hidden bg-(--bg-surface-raised)"
                >
                  <template #content>
                    <div
                      class="grid grid-cols-[1fr_1.5rem_1fr_1.5rem_1fr_1.5rem_1fr_1.5rem] p-(--spacing-md)"
                    >
                      <div
                        v-for="column in LINKS"
                        :key="column"
                        :style="{ gridColumn: column, gridRow: 1 }"
                        class="relative mt-5 h-px border-t border-dashed border-(--accent)"
                      >
                        <span
                          class="absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                        <span
                          class="absolute top-1/2 right-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                      </div>
                      <div
                        class="relative"
                        style="grid-column: 6; grid-row: 1"
                      >
                        <span
                          class="absolute top-5 left-0 w-3/4 border-t border-dashed border-(--accent)"
                        />
                        <span
                          class="absolute top-5 bottom-0 left-3/4 border-l border-dashed border-(--accent)"
                        />
                        <span
                          class="absolute top-5 left-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                        <span
                          class="absolute top-5 right-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                      </div>
                      <div
                        class="relative"
                        style="grid-column: 6; grid-row: 2"
                      >
                        <span
                          class="absolute top-0 left-3/4 h-5 border-l border-dashed border-(--accent)"
                        />
                        <span
                          class="absolute top-5 right-0 left-3/4 border-t border-dashed border-(--accent)"
                        />
                        <span
                          class="absolute top-5 right-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                      </div>
                      <div
                        class="relative mt-5 h-px border-t border-dashed border-(--accent)"
                        style="grid-column: 8; grid-row: 1"
                      >
                        <span
                          class="absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent)"
                        />
                      </div>
                      <div
                        v-for="node in NODES"
                        :key="node.key"
                        :style="{ gridColumn: node.column, gridRow: node.row }"
                        :data-dashed="node.dashed || null"
                        :data-focus="(tab === 'topology' && node.key === 'workload') || null"
                        :data-gap="node.key === 'application' || null"
                        class="min-w-0 self-start rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) shadow-sm data-dashed:border-dashed data-focus:border-(--primary) data-gap:mb-(--spacing-sm)"
                      >
                        <div
                          class="flex w-full items-center gap-(--spacing-xxs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs)"
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
                            class="ml-auto shrink-0"
                            :severity="node.severity"
                            :label="node.status"
                            size="small"
                          />
                          <i
                            class="pi pi-chevron-down shrink-0 text-(--text-muted)"
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)"
                        >
                          <span
                            class="inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default)"
                          >
                            <span class="truncate">{{ node.name || '—' }}</span>
                            <i
                              v-if="node.link"
                              class="pi pi-external-link shrink-0 text-body-xs leading-none"
                              aria-hidden="true"
                            />
                          </span>
                          <IconButton
                            v-if="node.status !== 'Live' && node.status !== 'Active'"
                            class="ml-auto shrink-0"
                            icon="pi pi-plus"
                            kind="outlined"
                            size="small"
                            ariaLabel="Bind"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </CardBox>
              </div>
            </ShellMockupPart>
          </div>
        </div>
      </div>
    </div>

    <template #overlay>
      <div
        :data-open="tab === 'deploy' || null"
        class="absolute inset-0 bg-(--bg-backdrop) opacity-0 transition-opacity duration-moderate-02 ease-productive-entrance data-open:opacity-100 motion-reduce:transition-none"
      />
      <aside
        :data-open="tab === 'deploy' || null"
        class="absolute inset-y-0 right-0 flex w-[47%] translate-x-full flex-col border-l border-(--border-default) bg-(--bg-surface) transition-[translate] duration-slow-01 ease-productive-entrance data-open:translate-x-0 motion-reduce:transition-none"
      >
        <div
          class="flex shrink-0 items-start gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-lg) py-(--spacing-md)"
        >
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <h2 class="m-0 text-heading-xs text-(--text-default)">Deploy</h2>
            <p class="m-0 text-body-sm text-(--text-muted)">
              Publish storefront-prod. Review what this release carries and where it lands.
            </p>
          </div>
          <IconButton
            class="ml-auto shrink-0"
            icon="pi pi-times"
            kind="outlined"
            size="small"
            ariaLabel="Close"
          />
        </div>

        <div
          class="flex min-h-0 flex-1 flex-col gap-(--spacing-xl) px-(--spacing-lg) py-(--spacing-lg)"
        >
          <div class="flex flex-col gap-(--spacing-sm)">
            <h3
              class="m-0 flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)"
            >
              Resources
              <i
                class="pi pi-info-circle text-body-xs text-(--text-muted)"
                aria-hidden="true"
              />
            </h3>
            <div
              class="flex flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
            >
              <div class="flex items-center gap-(--spacing-sm) p-(--spacing-sm)">
                <span
                  class="inline-flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default)"
                >
                  <i
                    class="ai ai-edge-application text-body-md leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
                <span class="flex min-w-0 flex-col">
                  <span class="flex items-center gap-(--spacing-xs) text-body-sm">
                    <span class="text-(--text-muted)">Application</span>
                    <span class="text-(--text-default)">storefront-prod</span>
                    <Tag
                      label="Ready"
                      severity="success"
                      size="small"
                    />
                  </span>
                  <span class="text-body-sm text-(--text-muted)">AWFBBZ1Q</span>
                </span>
                <span
                  class="ml-auto flex h-8 shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) text-label-sm text-(--text-default)"
                >
                  Change Version
                  <i
                    class="pi pi-chevron-down text-(--text-muted)"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div
                class="flex items-center border-y border-(--border-default) bg-(--bg-canvas) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-default)"
              >
                Dependencies
                <i
                  class="pi pi-chevron-down ml-auto text-(--text-muted)"
                  aria-hidden="true"
                />
              </div>
              <div class="flex items-center gap-(--spacing-sm) p-(--spacing-sm)">
                <span
                  class="inline-flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default)"
                >
                  <i
                    class="ai ai-edge-storage text-body-md leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
                <span class="flex min-w-0 flex-col">
                  <span class="flex items-center gap-(--spacing-xs) text-body-sm">
                    <span class="text-(--text-muted)">Object Storage</span>
                    <span class="text-(--text-default)">storefront-prod-storage</span>
                  </span>
                  <span class="text-body-sm text-(--text-muted)">Not versioned</span>
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-(--spacing-sm)">
            <h3
              class="m-0 flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)"
            >
              Environment
              <i
                class="pi pi-info-circle text-body-xs text-(--text-muted)"
                aria-hidden="true"
              />
            </h3>
            <div
              v-for="environment in ENVIRONMENTS"
              :key="environment.name"
              :data-selected="environment.selected || null"
              class="flex gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm) data-selected:border-(--primary) data-selected:bg-(--bg-selected)"
            >
              <RadioButton
                class="mt-0.5"
                tabindex="-1"
                :model-value="SELECTED_ENVIRONMENT"
                :value="environment.name"
              />
              <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                <span
                  class="flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)"
                >
                  {{ environment.name }}
                  <Tag
                    v-if="environment.tag"
                    class="ml-auto"
                    :label="environment.tag"
                    severity="info"
                    size="small"
                  />
                </span>
                <span class="text-body-xs text-(--text-muted)">{{ environment.description }}</span>
              </span>
            </div>
          </div>
        </div>

        <div
          class="flex shrink-0 items-center justify-end border-t border-(--border-default) px-(--spacing-lg) py-(--spacing-md)"
        >
          <Button
            label="Deploy"
            kind="primary"
            size="medium"
          />
        </div>
      </aside>
    </template>
  </ShellMockup>
</template>
