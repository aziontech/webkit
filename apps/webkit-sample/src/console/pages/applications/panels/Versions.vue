<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FilterButton from '../../../components/list/FilterButton.vue'
  import FilterChips from '../../../components/list/FilterChips.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { applyFilters } from '../../../lib/behavior/filter-bar'
  import { useListRefresh } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../../lib/behavior/table-columns'
  import {
    applicationVersion,
    applicationVersions,
    createDraftFrom,
    latestBuiltVersionId,
    versionComment
  } from '../../../lib/data/releases'
  import {
    isActionAvailable,
    VERSION_ACTIONS,
    versionStateMeta,
    versionStateOptions
  } from '../../../lib/data/versioning'

  interface Props {
    application: Record<string, unknown>
  }

  const props = defineProps<Props>()

  const COLUMNS = [
    {
      accessorKey: 'name',
      header: 'Version',
      enableSorting: true,
      principal: true,
      hideable: false
    },
    { accessorKey: 'state', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'createdAt', header: 'Created by', enableSorting: true, minWidth: FIT_COLUMN },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const FIELDS = [
    {
      id: 'state',
      label: 'Status',
      kind: 'options',
      options: versionStateOptions,
      match: (row, values) => values.includes(row.state)
    }
  ]

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || undefined)

  const versions = computed(() => applicationVersions(String(props.application.name)))

  const latestId = computed(() => latestBuiltVersionId(String(props.application.name)))

  const search = ref('')
  const filters = ref({})
  const pagination = ref({ pageIndex: 0, pageSize: 10 })

  const { loading, refresh } = useListRefresh()

  const visibleVersions = computed(() => applyFilters(versions.value, FIELDS, filters.value))

  watch(visibleVersions, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  const canDeploy = (row) => isActionAvailable(row.state, VERSION_ACTIONS.DEPLOY)

  const openVersion = (event, row) =>
    router.push({
      path: `/applications/${props.application.id}/versions/${row.id}`,
      query: { email: userEmail.value }
    })

  const deployVersion = (row) =>
    router.replace({ query: { ...route.query, deploy: '1', version: row.id } })

  const CREATE_MS = 900
  const creating = ref(false)

  const newVersion = async () => {
    if (creating.value) return
    creating.value = true
    const appName = String(props.application.name)
    const source = applicationVersion(appName, latestId.value) ?? versions.value[0] ?? null
    await new Promise((resolve) => setTimeout(resolve, CREATE_MS))
    const draft = createDraftFrom(appName, source?.id)
    await router.push({
      path: `/applications/${props.application.id}/versions/${draft.id}`,
      query: route.query
    })
    creating.value = false
    toast.success('Created new version.', {
      description: source
        ? `${draft.name} is a draft copied from ${source.name}. Edit it, then build or deploy.`
        : `${draft.name} is an empty draft. Configure it, then build or deploy.`,
      closable: true
    })
  }

  const onAction = (event, value, row) => {
    if (value === 'deploy') {
      deployVersion(row)
      return
    }
    openVersion(event, row)
  }
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Versions"
      description="Each version is an isolated snapshot of this application's configuration. Open one to view it, or deploy a Ready version."
      size="small"
    >
      <template #actions>
        <HeadingAction
          label="New Version"
          :loading="creating"
          @click="newVersion"
        />
      </template>
    </PageHeading>

    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
      <ControlsHeader>
        <FilterButton
          v-model="filters"
          :fields="FIELDS"
        />
        <InputText
          v-model="search"
          size="medium"
          placeholder="Search versions"
          aria-label="Search versions"
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
        </template>
      </ControlsHeader>

      <FilterChips
        v-model="filters"
        :fields="FIELDS"
      />

      <CardBox :padded="false">
        <template #content>
          <Table
            v-model:pagination="pagination"
            v-model:globalFilter="search"
            :data="visibleVersions"
            :columns="COLUMNS"
            row-key="id"
            enable-sorting
            paginated
            :page-size="10"
            :border="false"
            :loading="loading"
            @row-click="openVersion"
          >
            <template #cell-name="{ value, row }">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <span
                    class="truncate font-(family-name:--font-code) text-body-sm text-(--text-default)"
                  >
                    {{ value }}
                  </span>
                  <Tag
                    v-if="row.id === latestId"
                    label="Latest"
                    severity="info"
                    size="small"
                  />
                </span>
                <span
                  v-if="versionComment(row)"
                  class="truncate text-body-xs text-(--text-muted)"
                >
                  {{ versionComment(row) }}
                </span>
              </div>
            </template>

            <template #cell-state="{ value }">
              <Tag
                :label="versionStateMeta(value).label"
                :severity="versionStateMeta(value).severity"
                :icon="versionStateMeta(value).icon"
                size="small"
              />
            </template>

            <template #cell-createdAt="{ row }">
              <LastModifiedCell
                :author="row.author"
                :avatar-src="row.authorAvatar"
                :date="row.createdAt"
              />
            </template>

            <template #cell-actions="{ row }">
              <Dropdown
                placement="bottom-end"
                @select="(event, value) => onAction(event, value, row)"
              >
                <Dropdown.Trigger>
                  <Tooltip text="Version actions">
                    <IconButton
                      icon="pi pi-ellipsis-h"
                      kind="outlined"
                      size="small"
                      aria-label="Version actions"
                    />
                  </Tooltip>
                </Dropdown.Trigger>
                <Dropdown.Group>
                  <Dropdown.Option
                    value="open"
                    label="Open configuration"
                  >
                    <template #left>
                      <i
                        class="pi pi-eye"
                        aria-hidden="true"
                      />
                    </template>
                  </Dropdown.Option>
                  <Dropdown.Option
                    value="deploy"
                    label="Deploy"
                    :disabled="!canDeploy(row)"
                  >
                    <template #left>
                      <i
                        class="pi pi-cloud-upload"
                        aria-hidden="true"
                      />
                    </template>
                  </Dropdown.Option>
                </Dropdown.Group>
              </Dropdown>
            </template>
          </Table>
        </template>
      </CardBox>
    </section>
  </div>
</template>
