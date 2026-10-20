<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { AGENT_SETUP_PROMPT, AGENT_TOOLS, useAgentOnboarding } from '@shared/lib/agent-onboarding'
  import AgentMark from '@shared/ui/brand/AgentMark.vue'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProjectDropZone from '../../components/creation/ProjectDropZone.vue'
  import ProjectInitializing from '../../components/creation/ProjectInitializing.vue'
  import FirstUsePromo from '../../components/home/FirstUsePromo.vue'
  import HomeWire from '../../components/home/HomeWire.vue'
  import IconFrame from '../../components/home/IconFrame.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import { useProjectDrop } from '../../lib/behavior/project-upload'
  import { useGreeting } from '../../lib/data/greeting'
  import { allResources, recentResources } from '../../lib/data/home-resources'
  import { AGENT_PROMO } from '../../lib/data/product-empty-states'
  import { presetIcon, presetLabel } from '../../lib/format/presets'
  import { useTenancyReload } from '../../lib/state/tenancy-reload'

  const metrics = [
    {
      label: 'Data Transferred',
      value: '842',
      unit: 'GB',
      trend: { direction: 'up', delta: '12.4%' },
      hint: 'Total bytes delivered across all your resources.'
    },
    {
      label: 'Requests / Second',
      value: '1,240',
      unit: '/s',
      trend: { direction: 'up', delta: '3.8%' },
      hint: 'Average requests handled per second in the selected window.'
    },
    {
      label: 'Bandwidth Saving',
      value: '588',
      unit: 'GB',
      trend: { direction: 'up', delta: '6.2%' },
      hint: 'Bytes served from cache instead of your origin.'
    },
    {
      label: 'Data Offload',
      value: '70',
      unit: '%',
      trend: { direction: 'down', delta: '1.5%' },
      hint: 'Share of traffic offloaded from your origin to the edge.'
    }
  ]

  const rows = ref(allResources())

  const PANEL_ROWS = 5

  const MOCK_ROWS = { workloads: 3, domains: 4 }
  const rowsFor = (type) => MOCK_ROWS[type] ?? PANEL_ROWS

  const panels = computed(() => [
    {
      key: 'applications',
      label: 'Applications',
      path: '/applications',
      recent: false,
      marked: true,
      resources: rows.value
        .filter((row) => row.type === 'applications')
        .slice(0, rowsFor('applications'))
    },
    {
      key: 'workloads',
      label: 'Workloads',
      path: '/workloads',
      recent: false,
      resources: rows.value.filter((row) => row.type === 'workloads').slice(0, rowsFor('workloads'))
    },
    {
      key: 'domains',
      label: 'Domains',
      path: '',
      recent: false,
      resources: rows.value.filter((row) => row.type === 'domains').slice(0, rowsFor('domains'))
    },
    {
      key: 'recents',
      label: 'Recents',
      path: '',
      recent: true,
      resources: recentResources(rows.value, PANEL_ROWS)
    }
  ])

  const { tenancyReloading } = useTenancyReload()

  const LOAD_MS = 620
  const arriving = ref(true)
  let arrivalTimer
  onMounted(() => {
    arrivalTimer = setTimeout(() => {
      arriving.value = false
    }, LOAD_MS)
  })
  onUnmounted(() => {
    clearTimeout(arrivalTimer)
  })

  const { agentOnboardingVisible, dismissAgentOnboarding } = useAgentOnboarding()

  const route = useRoute()
  const { greeting, nameFor } = useGreeting()
  const userName = computed(() => nameFor(route.query.email))

  const copyAgentPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_SETUP_PROMPT)
      toast.success('Setup prompt copied.', {
        description: 'Paste it into Claude, Cursor, Windsurf, Codex or OpenCode.'
      })
    } catch {
      toast.error("Couldn't copy the prompt.", {
        description: 'Clipboard access was blocked by the browser.'
      })
    }
  }

  const onAgentOnboardingClose = () => {
    dismissAgentOnboarding()
  }

  const emptyLine = (panel) => (panel.recent ? 'Nothing opened here yet.' : 'Nothing here yet.')

  const router = useRouter()

  const openResource = (resource) => {
    if (resource.path) router.push(resource.path)
  }

  const { dragging, initializing } = useProjectDrop()

  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const target = pendingDelete.value
    if (!target) return
    rows.value = rows.value.filter((item) => item.id !== target.id)
    toast.success(`${target.name} deleted.`)
    pendingDelete.value = null
  }

  const onRowAction = (event, value, resource) => {
    if (value === 'delete') {
      pendingDelete.value = resource
      deleteOpen.value = true
      return
    }
    if (value === 'view') return openResource(resource)
    toast.info(`Editing ${resource.name}`, {
      description: `${resource.typeLabel} · ${resource.id}`
    })
  }
</script>

<template>
  <div
    class="layout-column layout-boundary relative flex min-h-full flex-col justify-center xl:h-full xl:min-h-0 xl:justify-start"
  >
    <ProjectDropZone
      :active="dragging"
      class="[--drop-zone-inset:var(--layout-boundary-inline)]"
    />

    <ProjectInitializing
      v-if="initializing"
      :files="initializing.files"
      :truncated="initializing.truncated"
    />

    <HomeWire v-if="arriving" />

    <template v-else>
      <header class="flex items-center">
        <h1 class="text-heading-sm text-(--text-muted)">
          {{ greeting }},
          <span class="text-(--text-default)">{{ userName }}</span>
        </h1>
      </header>

      <main
        class="layout-section-start flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1"
      >
        <aside
          class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
          aria-label="Usage"
        >
          <CardBox
            :padded="false"
            class="min-w-0 xl:flex-1"
          >
            <template #content>
              <div class="grid grow grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <div
                  v-for="metric in metrics"
                  :key="metric.label"
                  class="flex min-w-0 flex-col justify-center gap-(--spacing-sm) border-(--border-default) p-(--spacing-md) max-sm:nth-[n+2]:border-t sm:max-xl:[&:nth-child(n+3)]:border-t sm:[&:nth-child(even)]:border-l xl:[&:nth-child(n+2)]:border-l"
                >
                  <div class="flex items-center gap-(--spacing-xs)">
                    <span class="min-w-0 truncate text-label-sm text-(--text-default)">
                      {{ metric.label }}
                    </span>
                    <Tooltip :text="metric.hint">
                      <i
                        class="pi pi-info-circle text-body-sm text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </Tooltip>
                  </div>
                  <div class="flex items-center justify-between gap-(--spacing-sm)">
                    <div class="flex min-w-0 items-baseline gap-(--spacing-xxs)">
                      <Skeleton
                        v-if="tenancyReloading"
                        width="4.5rem"
                        height="1.75rem"
                      />
                      <template v-else>
                        <span class="text-big-number-sm tabular-nums text-(--text-default)">
                          {{ metric.value }}
                        </span>
                        <span
                          v-if="metric.unit"
                          class="text-body-xs text-(--text-muted)"
                          >{{ metric.unit }}</span
                        >
                      </template>
                    </div>

                    <Tag
                      v-if="!tenancyReloading"
                      size="small"
                      :severity="metric.trend.direction === 'up' ? 'success' : 'danger'"
                      class="shrink-0 tabular-nums"
                      :icon="
                        metric.trend.direction === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'
                      "
                      :label="`${metric.trend.direction === 'up' ? '+' : '-'}${metric.trend.delta}`"
                      :aria-label="`${metric.trend.direction === 'up' ? 'Up' : 'Down'} ${metric.trend.delta} versus the previous window`"
                    />
                  </div>
                </div>
              </div>
            </template>
          </CardBox>

          <Transition
            leave-active-class="transition-[scale,translate,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none"
            leave-to-class="scale-95 translate-y-(--spacing-xs) opacity-0"
          >
            <div
              v-if="agentOnboardingVisible"
              class="relative w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)"
            >
              <FirstUsePromo
                :title="AGENT_PROMO.title"
                :description="AGENT_PROMO.description"
                @activate="copyAgentPrompt"
              >
                <template #logos>
                  <IconFrame
                    v-for="agent in AGENT_TOOLS.slice(0, 4)"
                    :key="agent"
                  >
                    <AgentMark
                      :name="agent"
                      class="size-(--size-4) text-(--text-default)"
                    />
                  </IconFrame>
                </template>
              </FirstUsePromo>
              <div class="absolute right-(--spacing-xs) top-(--spacing-xs)">
                <Tooltip
                  text="Dismiss"
                  placement="top"
                >
                  <IconButton
                    icon="pi pi-times"
                    kind="transparent"
                    size="small"
                    aria-label="Dismiss agent setup"
                    @click="onAgentOnboardingClose"
                  />
                </Tooltip>
              </div>
            </div>
          </Transition>
        </aside>

        <section
          class="animate-content-enter motion-reduce:animate-none mt-(--spacing-lg) grid w-full min-w-0 grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:flex-1 xl:grid-cols-5 xl:gap-(--layout-section-gap) [--content-enter-delay:var(--transition-duration-fast-01)]"
          aria-label="Resources"
        >
          <div
            v-for="panel in panels"
            :key="panel.key"
            class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
            :class="panel.recent ? 'sm:col-span-2 lg:col-span-3 xl:col-span-2' : ''"
          >
            <h2
              class="flex min-h-(--size-6) items-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
            >
              <span
                v-if="panel.marked || panel.recent"
                class="shrink-0"
                aria-hidden="true"
              />
              <RouterLink
                v-if="panel.path"
                :to="panel.path"
                class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
              >
                {{ panel.label }}
                <i
                  class="pi pi-chevron-right text-body-xs leading-none text-(--text-muted)"
                  aria-hidden="true"
                />
              </RouterLink>
              <span v-else>{{ panel.label }}</span>
            </h2>

            <div class="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain">
              <Item.List
                v-if="tenancyReloading"
                key="panel-loading"
                aria-busy="true"
              >
                <Item
                  v-for="index in 3"
                  :key="`${panel.key}-skeleton-${index}`"
                  role="listitem"
                  size="small"
                >
                  <Item.Content
                    class="h-(--size-5) justify-center"
                    :class="
                      panel.marked || panel.recent
                        ? 'pl-[calc(var(--size-4)+var(--spacing-xs))]'
                        : ''
                    "
                  >
                    <Skeleton
                      :width="index % 2 ? '55%' : '42%'"
                      height="0.875rem"
                    />
                  </Item.Content>
                </Item>
              </Item.List>

              <Item.List
                v-else-if="panel.resources.length"
                key="panel-rows"
              >
                <Item
                  v-for="resource in panel.resources"
                  :key="`${resource.type}-${resource.id}`"
                  role="listitem"
                  size="small"
                  class="relative rounded-(--shape-elements)! transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) has-[[data-row-link]:focus-visible]:ring-2 has-[[data-row-link]:focus-visible]:ring-(--ring-color) has-[[data-row-link]:focus-visible]:ring-inset"
                >
                  <Item.Content>
                    <Item.Title class="w-full">
                      <template v-if="panel.recent">
                        <span
                          class="flex shrink-0 items-center justify-center"
                          aria-hidden="true"
                        >
                          <i class="pi pi-history text-body-xs leading-none text-(--text-muted)" />
                        </span>
                        <span class="min-w-(--size-24) shrink-0 text-body-sm text-(--text-muted)"
                          >{{ resource.typeLabel }} /</span
                        >
                      </template>

                      <span
                        v-else-if="panel.marked"
                        class="flex shrink-0 items-center justify-center"
                        aria-hidden="true"
                      >
                        <i
                          v-if="presetIcon(resource.preset)"
                          :class="presetIcon(resource.preset)"
                          class="text-body-lg leading-none"
                          :title="presetLabel(resource.preset)"
                        />
                      </span>
                      <button
                        type="button"
                        data-row-link
                        class="min-w-0 cursor-pointer truncate text-left text-label-md text-(--text-default) outline-none group-hover/item:underline focus-visible:underline after:absolute after:inset-0 after:content-['']"
                        @click="openResource(resource)"
                      >
                        {{ resource.name }}
                      </button>
                    </Item.Title>
                  </Item.Content>

                  <Item.Actions class="relative z-10 grid size-(--size-7) place-items-center">
                    <Dropdown
                      placement="bottom-end"
                      class="col-start-1 row-start-1 opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/item:opacity-100 group-focus-within/item:opacity-100"
                      @select="(event, value) => onRowAction(event, value, resource)"
                    >
                      <Dropdown.Trigger>
                        <Tooltip text="Resource actions">
                          <IconButton
                            icon="pi pi-ellipsis-h"
                            kind="transparent"
                            size="small"
                            :aria-label="`Actions for ${resource.name}`"
                          />
                        </Tooltip>
                      </Dropdown.Trigger>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="view"
                          label="View details"
                        />
                        <Dropdown.Option
                          value="edit"
                          label="Edit"
                        />
                      </Dropdown.Group>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="delete"
                          label="Delete"
                        >
                          <template #left>
                            <i
                              class="pi pi-trash"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
                      </Dropdown.Group>
                    </Dropdown>

                    <i
                      class="pi pi-chevron-right col-start-1 row-start-1 shrink-0 text-body-xs text-(--text-muted) transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/item:opacity-0 group-focus-within/item:opacity-0"
                      aria-hidden="true"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>

              <p
                v-else
                class="px-(--spacing-md) py-(--spacing-sm) text-body-sm text-(--text-muted)"
              >
                {{ emptyLine(panel) }}
              </p>
            </div>
          </div>
        </section>
      </main>

      <DeleteDialog
        v-model:open="deleteOpen"
        :kind="pendingDelete?.singular ?? 'resource'"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </template>
  </div>
</template>
