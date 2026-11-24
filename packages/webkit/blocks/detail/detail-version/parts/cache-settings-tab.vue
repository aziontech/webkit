<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { matchesText } from '@aziontech/webkit/use-collection'
  import { computed, reactive, ref, watch } from 'vue'

  import { blankSetting, type CacheSetting, cacheSummary } from '../detail-version-cache'
  import { sampleCacheSettings } from '../sample'
  import CacheBrowserGroup from './cache-browser-group.vue'
  import CacheEdgeGroup from './cache-edge-group.vue'
  import CacheGeneralGroup from './cache-general-group.vue'
  import CacheKeyGroup from './cache-key-group.vue'
  import ListControls from './list-controls.vue'
  import ListTabHeader from './list-tab-header.vue'
  import ModifiedBy from './modified-by.vue'
  import RecordDrawer from './record-drawer.vue'
  import TableEmpty from './table-empty.vue'

  const cacheColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, sortable: true },
    { accessorKey: 'browserCache', header: 'Browser cache', minWidth: 140 },
    { accessorKey: 'edgeCache', header: 'Edge cache', minWidth: 140 },
    { accessorKey: 'tieredCache', header: 'Tiered cache', minWidth: 120 },
    { accessorKey: 'modifiedAt', header: 'Last modified', minWidth: 160 }
  ]
  const cacheSettings = ref<CacheSetting[]>(
    sampleCacheSettings.map((setting) => ({
      ...setting,
      varyByMethod: [...setting.varyByMethod],
      deviceGroups: [...setting.deviceGroups]
    }))
  )
  const rows = computed(() =>
    cacheSettings.value.map((setting) => ({
      ...setting,
      browserCache: cacheSummary(setting.browserBehavior, setting.browserMaxAge),
      edgeCache: cacheSummary(setting.edgeBehavior, setting.edgeMaxAge)
    }))
  )

  const search = ref('')
  const tableEl = ref<TableExposed | null>(null)

  const drawerOpen = ref(false)
  const editingId = ref('')
  const form = reactive(blankSetting())
  const errors = reactive({ name: '' })
  const drawerTitle = computed(() =>
    editingId.value ? 'Edit Cache Settings' : 'Add Cache Settings'
  )

  const openSetting = (setting?: CacheSetting) => {
    editingId.value = setting?.id ?? ''
    const source = setting ?? blankSetting()
    Object.assign(form, blankSetting(), {
      ...source,
      varyByMethod: [...source.varyByMethod],
      deviceGroups: [...source.deviceGroups]
    })
    errors.name = ''
    drawerOpen.value = true
  }

  watch(
    () => form.name,
    () => (errors.name = '')
  )

  const submit = () => {
    errors.name = form.name.trim() ? '' : 'Enter a name for this cache setting.'
    if (errors.name) return
    const record = { ...form, name: form.name.trim() }
    const existing = cacheSettings.value.find((setting) => setting.id === editingId.value)
    if (existing) Object.assign(existing, record, { modifiedAt: new Date().toISOString() })
    else
      cacheSettings.value = [
        ...cacheSettings.value,
        {
          ...record,
          id: String(7100 + cacheSettings.value.length + 1),
          author: 'John Smith',
          modifiedAt: new Date().toISOString()
        }
      ]
    drawerOpen.value = false
    toast.success(
      existing ? `Cache setting "${record.name}" saved.` : `Cache setting "${record.name}" added.`,
      { description: 'The change is part of this draft until you deploy it.' }
    )
  }
  const matchingRows = computed(() =>
    rows.value.filter((row) =>
      matchesText(
        row,
        search.value,
        cacheColumns.flatMap((column) => column.accessorKey ?? [])
      )
    )
  )
</script>

<template>
  <ScrollArea
    aria-label="Version settings"
    fade
  >
    <div class="flex min-h-full flex-col">
      <div
        class="layout-column layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
      >
        <ListTabHeader
          title="Cache Settings"
          description="How responses are cached at the edge and in browsers. A rule picks one with the Set cache policy behavior."
          action-label="Add Cache Settings"
          action-icon="az az-plus"
          @action="openSetting()"
        />

        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ListControls
            v-model:search="search"
            search-label="Search cache settings"
            :table="tableEl"
            csv-filename="web-app-cache-settings.csv"
          />
          <Card :padded="false">
            <template #default>
              <DataTable
                ref="tableEl"
                :data="matchingRows"
                :columns="cacheColumns"
                row-key="id"
                sortable
                :bordered="false"
                aria-label="Cache settings"
              >
                <template #cell-name="{ row }">
                  <Button
                    variant="link"
                    class="min-w-0 max-w-full"
                    :title="row.name"
                    @click="openSetting(row)"
                  >
                    <span class="truncate">{{ row.name }}</span>
                  </Button>
                </template>
                <template #cell-tieredCache="{ value }">
                  <Tag
                    :label="value ? 'Enabled' : 'Disabled'"
                    :severity="value ? 'success' : 'neutral'"
                    size="medium"
                  />
                </template>
                <template #cell-modifiedAt="{ row }">
                  <ModifiedBy
                    :author="row.author"
                    :modified-at="row.modifiedAt"
                  />
                </template>
                <template #empty>
                  <TableEmpty
                    :search="search"
                    no-match="No matching cache settings"
                    empty-title="No cache settings yet"
                    icon="az az-database"
                    empty-action-label="Add Cache Settings"
                    @clear="search = ''"
                    @add="openSetting()"
                  />
                </template>
                <template #footer>
                  <DataTablePagination :page-size="10" />
                </template>
              </DataTable>
            </template>
          </Card>
        </section>
      </div>

      <RecordDrawer
        v-model:open="drawerOpen"
        :title="drawerTitle"
        description="How long browsers and the edge keep a response, and what makes two requests two cached objects."
        :submit-label="editingId ? 'Save' : 'Add Cache Settings'"
        @submit="submit"
      >
        <CacheGeneralGroup
          :form="form"
          :name-error="errors.name"
        />
        <CacheBrowserGroup :form="form" />
        <CacheEdgeGroup :form="form" />
        <CacheKeyGroup :form="form" />
      </RecordDrawer>
    </div>
  </ScrollArea>
</template>
