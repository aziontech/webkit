<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { type TableColumn } from '@aziontech/webkit/table'
  import Tooltip from '@aziontech/webkit/tooltip'
  import {
    type FilteringProperty,
    type PropertyFilterQuery,
    useCollection
  } from '@aziontech/webkit/use-collection'
  import { computed, ref, watch } from 'vue'

  import {
    sampleNow,
    samplePlaceholders,
    sampleResponses
  } from './settings-canned-responses.sample'
  import ResponseDrawer from './settings-canned-responses-response-drawer.vue'
  import ResponsesTable, {
    type CannedResponsesAction
  } from './settings-canned-responses-responses-table.vue'

  /** Who can insert a response: its author, the author's team, or every agent of the account. */
  export type CannedResponsesVisibility = 'personal' | 'team' | 'everyone'

  /** A ticket status a response can set when an agent sends it. */
  export type CannedResponsesTicketStatus = 'New' | 'Open' | 'Pending' | 'On hold' | 'Solved'

  /** One saved reply. */
  export interface CannedResponsesResponse {
    /** Stable key. */
    id: string
    /** Name agents search for; unique in the list. */
    title: string
    /** Folder it is filed under; empty when it has none. */
    folder: string
    /** Who can insert it. */
    visibility: CannedResponsesVisibility
    /** The reply in Markdown, with placeholders written in double braces. */
    body: string
    /** The status the ticket moves to when the reply is sent; null leaves it as it is. */
    status: CannedResponsesTicketStatus | null
    /** When an agent last inserted it, or null when it was never used. */
    lastUsedAt: Date | null
    /** How many times agents inserted it. */
    usageCount: number
  }

  /** A value the app fills in when an agent inserts the response. */
  export interface CannedResponsesPlaceholder {
    /** The path written between double braces, such as ticket.requester.name. */
    value: string
    /** What it stands for, shown in the Insert placeholder menu. */
    label: string
    /** Menu group it is listed under, such as Ticket or Requester. */
    group: string
  }

  /** What Save response sends. */
  export interface CannedResponsesValues {
    /** Trimmed title. */
    title: string
    /** Trimmed folder, an existing one or a new one; empty for none. */
    folder: string
    /** Who can insert it. */
    visibility: CannedResponsesVisibility
    /** The Markdown body. */
    body: string
    /** The status to set when the reply is sent, or null to leave it. */
    status: CannedResponsesTicketStatus | null
  }

  export interface CannedResponsesProps {
    /** The responses to list; filtered, sorted and paged in the browser. Left out, the sample renders. */
    responses?: CannedResponsesResponse[]
    /** The placeholders the editor offers. Left out, the sample placeholders render. */
    placeholders?: CannedResponsesPlaceholder[]
    /** A request is in flight: with no responses it is the first load, with responses a refresh. */
    loading?: boolean
    /** Why the responses could not load; a danger alert with Retry replaces the table. */
    error?: string
    /** The save request is in flight; the drawer's fields lock and Save response spins. */
    saving?: boolean
    /** Why the last save failed; a danger alert at the top of the drawer, the values kept. */
    saveError?: string
    /** The moment Last used counts from. Left out, the real clock; the sample uses its own. */
    now?: Date
    /** Filter tokens applied on mount, for a link that opens the list already filtered. */
    defaultQuery?: PropertyFilterQuery
  }

  const props = withDefaults(defineProps<CannedResponsesProps>(), {
    responses: undefined,
    placeholders: undefined,
    loading: false,
    error: '',
    saving: false,
    saveError: '',
    now: undefined,
    defaultQuery: undefined
  })

  const emit = defineEmits<{
    create: [event: Event, values: CannedResponsesValues]
    update: [event: Event, response: CannedResponsesResponse, values: CannedResponsesValues]
    duplicate: [event: MouseEvent | KeyboardEvent, response: CannedResponsesResponse]
    remove: [event: MouseEvent, response: CannedResponsesResponse]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
  }>()

  const editorOpen = defineModel<boolean>('editorOpen', { default: false })
  const editingKey = defineModel<string | null>('editingKey', { default: null })

  const source = computed<CannedResponsesResponse[]>(
    () => props.responses ?? (props.loading || props.error ? [] : sampleResponses)
  )
  const placeholderList = computed(() => props.placeholders ?? samplePlaceholders)
  const clock = computed(
    () => props.now ?? (props.responses || props.loading || props.error ? undefined : sampleNow)
  )

  const items = ref<CannedResponsesResponse[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )

  const folders = computed(() =>
    [...new Set(items.value.map((item) => item.folder).filter(Boolean))].sort()
  )

  const visibilityLabels: Record<CannedResponsesVisibility, string> = {
    personal: 'Personal',
    team: 'Team',
    everyone: 'Everyone'
  }

  const columns: TableColumn[] = [
    { accessorKey: 'title', header: 'Title', sortable: true, principal: true, hideable: false },
    { accessorKey: 'folder', header: 'Folder', sortable: true, minWidth: 140 },
    { accessorKey: 'visibility', header: 'Visibility', minWidth: 120 },
    { accessorKey: 'lastUsedAt', header: 'Last used', sortable: true, minWidth: 130 },
    { accessorKey: 'usageCount', header: 'Uses', sortable: true, align: 'end', minWidth: 88 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'folder', label: 'Folder', options: folders.value.map((value) => ({ value })) },
    {
      key: 'visibility',
      label: 'Visibility',
      options: Object.entries(visibilityLabels).map(([value, label]) => ({ value, label }))
    }
  ])

  const { paginationProps, tableProps, propertyFilterProps, status, clearFilters } = useCollection({
    items,
    columns,
    filtering: { fields: ['title', 'body', 'folder'] },
    propertyFiltering: { properties, defaultQuery: props.defaultQuery },
    sorting: { defaultState: [{ id: 'usageCount', desc: true }] },
    pagination: { pageSize: 25, pageSizeOptions: [25, 50, 100] }
  })

  const loadFailed = computed(() => props.error !== '')
  const firstUse = computed(() => !props.loading && !loadFailed.value && status.value === 'empty')
  const refreshing = computed(() => props.loading && items.value.length > 0)

  const editing = computed(() =>
    editingKey.value ? (items.value.find((item) => item.id === editingKey.value) ?? null) : null
  )
  const otherTitles = computed(() =>
    items.value.filter((item) => item.id !== editing.value?.id).map((item) => item.title)
  )

  const openEditor = (key: string | null) => {
    editingKey.value = key
    editorOpen.value = true
  }

  watch(
    () => props.saving,
    (now, before) => {
      if (before && !now && !props.saveError) editorOpen.value = false
    }
  )

  const pending = ref<CannedResponsesResponse | null>(null)
  const removeOpen = ref(false)

  const onAction = (
    event: MouseEvent | KeyboardEvent,
    action: CannedResponsesAction,
    response: CannedResponsesResponse
  ) => {
    if (action === 'edit') openEditor(response.id)
    if (action === 'duplicate') emit('duplicate', event, response)
    if (action === 'remove') {
      pending.value = response
      removeOpen.value = true
    }
  }

  const onSave = (event: Event, values: CannedResponsesValues) => {
    if (editing.value) emit('update', event, editing.value, values)
    else emit('create', event, values)
  }

  const remove = (event: MouseEvent) => {
    const response = pending.value
    if (!response) return
    items.value = items.value.filter((item) => item.id !== response.id)
    removeOpen.value = false
    emit('remove', event, response)
  }
</script>

<template>
  <ConfigProvider :now="clock">
    <div class="layout-boundary">
      <div class="layout-column flex flex-col">
        <PageHeader
          title="Canned responses"
          description="Saved replies agents insert into a ticket, with the requester's details filled in."
        >
          <template #actions>
            <Button
              label="New response"
              icon="az az-plus"
              variant="primary"
              size="medium"
              @click="openEditor(null)"
            />
          </template>
        </PageHeader>

        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header
            v-if="!loadFailed && !firstUse"
            class="flex flex-wrap items-start gap-(--layout-group-gap)"
          >
            <div class="flex min-w-0 grow basis-(--container-2xs)">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Search responses"
                aria-label="Search responses"
              />
            </div>
            <Tooltip
              content="Refresh"
              class="shrink-0"
            >
              <IconButton
                icon="az az-refresh"
                variant="outline"
                size="medium"
                :loading="refreshing"
                aria-label="Refresh"
                @click="emit('refresh', $event)"
              />
            </Tooltip>
          </header>

          <Alert
            v-if="loadFailed"
            severity="danger"
            :label="error"
            action-label="Retry"
            @action="(event: MouseEvent) => emit('retry', event)"
          />

          <Card
            key="card-empty"
            v-else-if="firstUse"
            :padded="false"
          >
            <template #default>
              <EmptyState
                size="medium"
                icon="az az-reply"
                title="No canned responses yet"
                description="Save the replies your team sends again and again. An agent inserts one into a ticket in two clicks, with the requester's name and the ticket number filled in."
              >
                <template #actions>
                  <Button
                    label="New response"
                    icon="az az-plus"
                    variant="secondary"
                    size="small"
                    @click="openEditor(null)"
                  />
                </template>
              </EmptyState>
            </template>
          </Card>

          <ResponsesTable
            key="card-table"
            v-else
            :table-props="tableProps"
            :pagination-props="paginationProps"
            :loading="loading"
            :visibility-labels="visibilityLabels"
            @action="onAction"
            @clear="clearFilters"
          />
        </section>
      </div>

      <ResponseDrawer
        v-model:open="editorOpen"
        :response="editing"
        :folders="folders"
        :titles="otherTitles"
        :placeholders="placeholderList"
        :saving="saving"
        :save-error="saveError"
        :visibility-labels="visibilityLabels"
        @save="onSave"
      />

      <ConfirmDialog
        v-model:open="removeOpen"
        title="Delete response"
        :description="`Agents can no longer insert “\u2068${pending?.title ?? ''}\u2069”. Replies already sent keep their text. You cannot undo this.`"
        confirm-label="Delete response"
        size="small"
        @confirm="remove"
      />
    </div>
  </ConfigProvider>
</template>
