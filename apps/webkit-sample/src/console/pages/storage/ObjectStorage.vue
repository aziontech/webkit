<script setup>
  // Object Storage — the Azion Console "Object Storage" module (Store area). Like
  // SQL Database, the app shell (sidebar + GlobalHeader with the module
  // breadcrumb) comes from AppLayout; this page renders only its content: a
  // PageHeading (title + description + "Create Bucket") over a data-driven
  // <Table> of buckets. Opening a bucket enters its file navigator
  // (BucketBrowser.vue), where the objects live.
  //
  // Empty = one clear next action: with no buckets the content region swaps to an
  // EmptyState with the single "Create Bucket" action (/ux-heuristics).
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { daysAgo, formatListDate } from '@shared/lib/dates'
  import { authorAt } from '@shared/lib/people'
  import { provisionedBuckets, removeDeployment } from '@shared/lib/provisioning'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import FilterBar from '../../components/list/FilterBar.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../lib/behavior/filter-bar'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { createResourcePath } from '../../lib/data/create-resources'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  // The sample's EMPTY version: this module before it owns anything. The same block the
  // /empty-states gallery reviews, rendered in the module's own page
  // (../lib/sample-mode.js, ./ui/ProductFirstUse.vue).
  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('object-storage')

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The buckets that back the table (data-driven mode). Object counts / sizes are
  // mock figures; the file navigator inside a bucket (BucketBrowser.vue) owns the
  // actual object tree.
  const buckets = ref(
    [
      {
        id: 'webkit-storybook-dev',
        name: 'webkit-storybook-dev',
        access: 'Public',
        objects: 128,
        size: '412.6 MB',
        modifiedAt: daysAgo(29)
      },
      {
        id: 'azion-assets-prod',
        name: 'azion-assets-prod',
        access: 'Public',
        objects: 4210,
        size: '18.4 GB',
        modifiedAt: daysAgo(2)
      },
      {
        id: 'user-uploads',
        name: 'user-uploads',
        access: 'Private',
        objects: 902,
        size: '2.1 GB',
        modifiedAt: daysAgo(1)
      }
    ].map((bucket, index) => {
      const person = authorAt(index)
      // `modifiedAt` is the real instant — the Last Modified field compares it — and
      // `lastModified` (the sortable display string) is derived from it by one
      // formatter rather than hand-written per row (src/lib/dates.js).
      return {
        ...bucket,
        author: person.name,
        authorAvatar: person.avatar,
        lastModified: formatListDate(bucket.modifiedAt)
      }
    })
  )

  // Buckets provisioned by the deploy flow lead the list, newest first — the last
  // link of the chain a deploy creates (src/lib/provisioning.js): the connector's
  // origin, holding the assets that were uploaded.
  // Switching organization, account or workspace reloads the module: skeletons while
  // the new scope's buckets arrive (src/lib/tenancy-reload.js). Buckets provisioned
  // by this session's deploy lead the list and are never projected away; the seeded
  // ones below belong to the scope in force (src/lib/tenancy-scope.js).
  const allBuckets = computed(() => [
    ...provisionedBuckets.value,
    ...tenancyRows(buckets.value, 'object-storage')
  ])

  // ── The filter catalog ────────────────────────────────────────────────────
  // Access is the one enumerable column and Last Modified becomes the same relative
  // periods every other list offers; Name, Objects and Size are covered by the search
  // field (Objects and Size are magnitudes — a chip per bucket count would be one
  // option per row).
  const filterFields = [
    {
      id: 'access',
      label: 'Access',
      kind: 'options',
      options: [
        { value: 'Public', label: 'Public' },
        { value: 'Private', label: 'Private' }
      ],
      match: (bucket, values) => values.includes(bucket.access)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      // A bucket provisioned by this session's deploy may carry no instant yet, so it
      // is never narrowed away by a window it cannot answer for.
      match: (bucket, values) => !bucket.modifiedAt || matchDate(bucket.modifiedAt, values)
    }
  ]

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleBuckets,
    loading: tenancyReloading
  } = useListFilters(filterFields, allBuckets)

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, grow: 2 },
    { accessorKey: 'access', header: 'Access', enableSorting: true },
    { accessorKey: 'objects', header: 'Objects', enableSorting: true },
    { accessorKey: 'size', header: 'Size', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // Creating: the module's own create page. Its two fields are the two the API takes —
  // the bucket name and what the workspace's workloads may do with the objects
  // (../lib/create-resources.js).
  const createBucket = () =>
    router.push({
      path: createResourcePath('object-storage'),
      query: { email: userEmail.value }
    })

  // Opening a bucket enters its file navigator, carrying the bucket name so the
  // browser reads it from the route without a round-trip.
  const openBucket = (event, row) =>
    router.push({
      path: `/object-storage/${row.id}`,
      query: { email: userEmail.value, name: row.name }
    })

  // Deleting is the one row action with no undo, so the menu click only ARMS it: the
  // row waits here until the dialog has been given its name back.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    removeDeployment(row.id)
    buckets.value = buckets.value.filter((b) => b.id !== row.id)
    toast.success(`Bucket "${row.name}" deleted.`)
    pendingDelete.value = null
  }

  const onRowAction = (event, value, row) => {
    if (value === 'open') {
      openBucket(event, row)
      return
    }
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(`Editing ${row.name}`, { description: `Bucket ID ${row.id}` })
  }
</script>

<template>
  <AppLayout
    active="object-storage"
    :breadcrumb="[{ label: 'Object Storage' }]"
  >
    <main
      class="flex min-h-full flex-col"
      :class="accountEmpty ? 'layout-column-focused' : 'layout-column'"
    >
      <!-- The page's parent section. A module list opens straight on it (no
           PageHeading — the module name is the breadcrumb crumb), so the
           `:first-child` rule zeroes its step and the boundary is its top space. -->
      <!-- FIRST USE, IN HOME'S CONTAINER.
           The same box the first access uses on /home (./HomeEmptyState.vue) and the
           /empty-states gallery around it (../ProductEmptyStates.vue): centred in the
           viewport rather than hanging from the top edge. This screen and that one are the
           same KIND of screen — a short block answering "there is nothing here yet" — and a
           short block pinned to the top with a void under it reads as content that failed
           to load. The section step is gone with it: a centred box measures from the middle,
           and a top margin would only pull it off centre.
           CENTRED WITH AUTO MARGINS, not `min-h-full justify-center`. That pair looks
           right and does nothing: `min-height: 100%` resolves against a parent whose own
           height is `auto` (main is `min-h-full`, not `h-full`), so the box stayed at
           content height and `justify-center` then centred the content inside itself — a
           no-op. `my-auto` asks the flex parent to split its free space above and below
           this one item, which is the definition of centred; and when the block is TALLER
           than the viewport the auto margins collapse to 0 instead of clipping its top,
           which is what `flex-1 justify-center` would have done. -->
      <div
        v-if="accountEmpty"
        class="my-auto flex w-full flex-col py-(--spacing-xl)"
      >
        <ProductFirstUse :product="firstUse" />
      </div>

      <section
        v-else
        class="layout-section-start flex min-h-0 min-w-0 flex-1 flex-col gap-(--layout-section-gap)"
      >
        <!-- ONE section — the module's list band: either the controls row over the
             table it narrows (at --layout-group-gap), or the empty state that replaces
             both. `flex-1` is passed down from the parent so that empty state can
             still centre itself in the page. -->
        <section class="flex min-h-0 min-w-0 flex-1 flex-col gap-(--layout-group-gap)">
          <!-- First-level module list: no PageHeading — the module name already IS the
               header breadcrumb crumb (AppLayout). The page opens with its CONTROLS row
               (search, with the module's own actions on the right); the table follows.
               Rendered only when there are rows: over an empty state the single clear
               next action is the state's own, and a search field with nothing to search
               is noise. -->
          <ControlsHeader v-if="allBuckets.length">
            <InputText
              v-model="search"
              size="large"
              placeholder="Search buckets"
              aria-label="Search buckets"
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
              <Button
                label="Create Bucket"
                kind="primary"
                size="large"
                icon="pi pi-plus"
                @click="createBucket"
              />
            </template>
          </ControlsHeader>

          <!-- The filter bar takes its own row: it grows as filters are applied, so
               sharing the controls row would make the search field jump width. It
               follows the controls row's condition — with no buckets there is nothing
               to narrow. -->
          <FilterBar
            v-if="allBuckets.length"
            v-model="filters"
            :fields="filterFields"
          />

          <!-- Empty = one clear next action; otherwise the borderless Table in a
               flush CardBox, framed edge-to-edge. -->
          <section
            v-if="!allBuckets.length"
            class="flex min-h-0 flex-1 items-center justify-center"
          >
            <CardBox class="w-full max-w-(--container-2xl)">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No buckets yet"
                  description="Create your first bucket to store and serve static objects at the edge."
                  class="flex-1 rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
                >
                  <template #icon>
                    <span class="relative flex size-10 items-center justify-center">
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                      />
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                      />
                      <span
                        class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                      >
                        <i
                          class="ai ai-edge-storage text-[1rem] leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Create Bucket"
                      kind="secondary"
                      size="large"
                      icon="pi pi-plus"
                      @click="createBucket"
                    />
                  </template>
                </EmptyState>
              </template>
            </CardBox>
          </section>

          <section
            v-else
            class="flex min-h-0 flex-col"
          >
            <CardBox :padded="false">
              <template #content>
                <Table
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  :data="visibleBuckets"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="tenancyReloading"
                  @row-click="openBucket"
                >
                  <template #cell-name="{ value }">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="ai ai-edge-storage shrink-0 text-[1.15em] text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    </div>
                  </template>

                  <template #cell-access="{ value }">
                    <Tag
                      :label="value"
                      :severity="value === 'Public' ? 'success' : 'neutral'"
                      size="medium"
                    />
                  </template>

                  <template #cell-lastModified="{ value, row }">
                    <LastModifiedCell
                      :author="row.author"
                      :avatar-src="row.authorAvatar"
                      :date="value"
                    />
                  </template>

                  <template #cell-actions="{ row }">
                    <Dropdown
                      placement="bottom-end"
                      @select="(event, value) => onRowAction(event, value, row)"
                    >
                      <Dropdown.Trigger>
                        <Tooltip text="Row actions">
                          <IconButton
                            icon="pi pi-ellipsis-h"
                            kind="outlined"
                            size="small"
                            aria-label="Row actions"
                          />
                        </Tooltip>
                      </Dropdown.Trigger>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="open"
                          label="Browse files"
                        >
                          <template #left
                            ><i
                              class="pi pi-folder-open"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="edit"
                          label="Settings"
                        >
                          <template #left
                            ><i
                              class="pi pi-cog"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                      </Dropdown.Group>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="delete"
                          label="Delete"
                        >
                          <template #left
                            ><i
                              class="pi pi-trash"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                      </Dropdown.Group>
                    </Dropdown>
                  </template>
                </Table>
              </template>
            </CardBox>
          </section>
        </section>
      </section>

      <DeleteDialog
        v-model:open="deleteOpen"
        kind="Bucket"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </main>
  </AppLayout>
</template>
