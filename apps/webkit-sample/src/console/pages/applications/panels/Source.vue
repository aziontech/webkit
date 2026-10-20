<script setup lang="ts">
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import TableRoot from '@aziontech/webkit/table-root'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { authorAt } from '@shared/lib/people'
  import { computed, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { useListRefresh } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN } from '../../../lib/behavior/table-columns'
  import { applicationBucket } from '../../../lib/data/application-source'
  import { productFirstUse } from '../../../lib/data/product-empty-states'
  import { glyphForExtension } from '../../../lib/format/file-glyph'

  interface Props {
    application: Record<string, unknown>
  }

  const props = defineProps<Props>()

  const HELP = productFirstUse('object-storage').learnMore.href

  const router = useRouter()

  const bucket = computed(() => applicationBucket(props.application))

  const empty = computed(() => Object.keys(bucket.value.tree).length === 0)

  const folderPath = ref([])

  watch(
    () => bucket.value.id,
    () => {
      folderPath.value = []
    }
  )

  const isFolder = (entry: { children?: object }) => Boolean(entry && entry.children)

  const currentFolder = computed(() => {
    let node = bucket.value.tree
    for (const segment of folderPath.value) {
      node = node?.[segment]?.children
      if (!node) return {}
    }
    return node
  })

  const rows = computed(() => {
    const entries = Object.entries(currentFolder.value)
    const folders = entries
      .filter(([, entry]) => isFolder(entry))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name]) => ({ id: name, name, kind: 'folder', size: '-', lastModified: '' }))
    const files = entries
      .filter(([, entry]) => !isFolder(entry))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, entry], index) => {
        const person = authorAt(index)
        return {
          id: name,
          name,
          kind: 'file',
          ext: entry.ext,
          size: entry.size,
          lastModified: entry.lastModified,
          author: person.name,
          authorAvatar: person.avatar
        }
      })

    const list = [...folders, ...files]
    if (folderPath.value.length) {
      list.unshift({ id: '..', name: '..', kind: 'parent', size: '-', lastModified: '' })
    }
    return list
  })

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      principal: true,
      hideable: false,
      grow: 3
    },
    { accessorKey: 'size', header: 'Size', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    }
  ]

  const search = ref('')

  const columnVisibility = ref({})

  const { loading, refresh } = useListRefresh()

  const tableRef = ref(null)

  const pathCrumbs = computed(() => [
    { label: bucket.value.name, href: '0' },
    ...folderPath.value.map((segment, index) => ({ label: segment, href: String(index + 1) }))
  ])

  const onCrumb = (event: Event, href: string) => {
    event.preventDefault()
    const depth = Number(href)
    if (Number.isFinite(depth)) folderPath.value = folderPath.value.slice(0, depth)
  }

  const onRowClick = (event, row) => {
    if (row.kind === 'parent') {
      folderPath.value = folderPath.value.slice(0, -1)
      return
    }
    if (row.kind === 'folder') {
      folderPath.value = [...folderPath.value, row.name]
      return
    }
    toast.info(`Downloading ${row.name}`, { description: row.size })
  }

  const upload = () =>
    toast.info('Upload files', { description: `Upload into ${bucket.value.name}` })

  const openBucket = () =>
    router.push({ path: bucket.value.href, query: { name: bucket.value.name } })
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Source"
      :description="`Files this application serves, stored in the ${bucket.name} bucket.`"
      size="small"
      :documentation="HELP"
    >
      <template #actions>
        <HeadingAction
          label="Upload Files"
          icon="pi pi-upload"
          @click="upload"
        />
      </template>
    </PageHeading>

    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <EmptyState
        v-if="empty"
        bordered
        icon="ai ai-edge-storage"
        title="No source files yet"
        :description="`${bucket.name} is empty. Build a version of ${application.name} to publish its files here, or upload them directly.`"
      >
        <template #actions>
          <Button
            label="Upload Files"
            kind="outlined"
            size="medium"
            icon="pi pi-upload"
            @click="upload"
          />
          <Button
            label="Open Bucket"
            kind="text"
            size="medium"
            @click="openBucket"
          />
        </template>
      </EmptyState>

      <section
        v-else
        class="flex min-w-0 flex-col gap-(--layout-group-gap)"
      >
        <ControlsHeader>
          <InputText
            v-model="search"
            size="medium"
            placeholder="Search in folder"
            aria-label="Search in folder"
            class="min-w-36 grow basis-(--container-2xs)"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
          <template #actions>
            <RefreshButton
              :loading="loading"
              @refresh="refresh"
            />
            <ExportButton
              :table="tableRef"
              filename="source.csv"
            />
            <ColumnsButton
              v-model="columnVisibility"
              :columns="columns"
            />
            <Tooltip text="Open in Object Storage">
              <IconButton
                icon="pi pi-external-link"
                kind="outlined"
                size="medium"
                aria-label="Open in Object Storage"
                @click="openBucket"
              />
            </Tooltip>
          </template>
        </ControlsHeader>

        <Breadcrumb
          :items="pathCrumbs"
          @navigate="onCrumb"
        />

        <CardBox :padded="false">
          <template #content>
            <TableRoot
              ref="tableRef"
              v-model:globalFilter="search"
              v-model:columnVisibility="columnVisibility"
              :data="rows"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
              :loading="loading"
              export-filename="source.csv"
              @row-click="onRowClick"
            >
              <template #cell-name="{ value, row }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    v-if="row.kind === 'parent'"
                    class="pi pi-folder-open shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <i
                    v-else-if="row.kind === 'folder'"
                    class="pi pi-folder shrink-0 text-body-lg text-(--text-link)"
                    aria-hidden="true"
                  />
                  <i
                    v-else
                    :class="glyphForExtension(row.ext)"
                    class="shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="cursor-pointer truncate hover:underline">{{ value }}</span>
                </div>
              </template>

              <template #cell-size="{ value }">
                <span class="text-(--text-muted)">{{ value }}</span>
              </template>

              <template #cell-lastModified="{ value, row }">
                <LastModifiedCell
                  :author="row.author"
                  :avatar-src="row.authorAvatar"
                  :date="value"
                />
              </template>
            </TableRoot>
          </template>
        </CardBox>
      </section>
    </section>
  </div>
</template>
