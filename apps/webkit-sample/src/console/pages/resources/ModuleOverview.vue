<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { FIT_COLUMN } from '../../lib/behavior/table-columns'
  import { MODULE_OVERVIEWS, moduleEntries } from '../../lib/data/module-overviews'

  interface Props {
    module: string
  }

  const props = defineProps<Props>()

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const config = computed(() => MODULE_OVERVIEWS[props.module])

  const entries = computed(() => moduleEntries(config.value.navIds))

  const count = computed(
    () => entries.value.filter((entry) => entry.typeLabel === config.value.countType).length
  )

  const strip = computed(() => [
    {
      label: config.value.countLabel,
      value: String(count.value),
      hint: `${config.value.countLabel} in this account.`
    },
    ...config.value.stats
  ])

  const RECENT_LIMIT = 6

  const formatModified = (value: string | null) =>
    value
      ? new Date(value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : '—'

  const recent = computed(() =>
    entries.value
      .filter((entry) => entry.modifiedAt)
      .slice(0, RECENT_LIMIT)
      .map((entry) => ({
        key: entry.key,
        name: entry.name,
        subtitle: entry.subtitle,
        icon: entry.icon,
        type: entry.typeLabel,
        modified: formatModified(entry.modifiedAt),
        path: entry.path,
        query: entry.query
      }))
  )

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false },
    { accessorKey: 'type', header: 'Type', minWidth: FIT_COLUMN },
    { accessorKey: 'modified', header: 'Last Modified', minWidth: FIT_COLUMN }
  ]

  const go = (path: string, query: Record<string, string> = {}) =>
    router.push({ path, query: { email: userEmail.value, ...query } })

  const openEntry = (event: Event, row: { path: string; query: Record<string, string> }) =>
    go(row.path, row.query)

  const openCreate = () => go(config.value.create.path)

  const openList = (event: Event) => {
    event.preventDefault()
    go(config.value.list.path)
  }
</script>

<template>
  <AppLayout
    :active="`${module}-overview`"
    :breadcrumb="[{ label: config.title }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <PageHeading
        size="medium"
        :title="config.title"
        :description="config.description"
      >
        <template #actions>
          <HeadingAction
            :label="config.create.label"
            kind="outlined"
            icon="pi pi-plus"
            @click="openCreate"
          />
        </template>
      </PageHeading>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="metric in strip"
            :key="metric.label"
            class="grid"
          >
            <CardBox>
              <template #content>
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <Tooltip :text="metric.hint">
                    <span class="min-w-0 truncate text-body-sm text-(--text-muted)">
                      {{ metric.label }}
                    </span>
                  </Tooltip>
                  <p class="text-heading-lg text-(--text-default)">{{ metric.value }}</p>
                </div>
              </template>
            </CardBox>
          </li>
        </ul>

        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <div class="flex items-center justify-between gap-(--spacing-sm)">
            <h2 class="text-heading-xs text-(--text-default)">Recent</h2>
            <a
              :href="config.list.path"
              class="rounded-(--shape-button) px-(--spacing-xxs) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              @click="openList"
            >
              {{ config.list.label }}
            </a>
          </div>

          <CardBox
            v-if="recent.length"
            :padded="false"
          >
            <template #content>
              <TableRoot
                :data="recent"
                :columns="columns"
                row-key="key"
                :border="false"
                @row-click="openEntry"
              >
                <template #cell-name="{ row, value }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      :class="row.icon"
                      class="shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    <span
                      v-if="row.subtitle"
                      class="hidden min-w-0 truncate text-body-sm text-(--text-muted) md:inline"
                    >
                      {{ row.subtitle }}
                    </span>
                  </div>
                </template>
              </TableRoot>
            </template>
          </CardBox>

          <EmptyState
            v-else
            size="medium"
            :title="`No ${config.title.toLowerCase()} yet`"
            description="Create your first resource and it will show up here."
          />
        </section>
      </section>
    </main>
  </AppLayout>
</template>
