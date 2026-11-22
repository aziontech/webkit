<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn, type TableExposed } from '@aziontech/webkit/data-table'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'

  import { type DeviceGroup, sampleDeviceGroups } from '../sample'
  import ListControls from './list-controls.vue'
  import ListTabHeader from './list-tab-header.vue'
  import ModifiedBy from './modified-by.vue'
  import RecordDrawer from './record-drawer.vue'
  import TableEmpty from './table-empty.vue'

  const groupColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, sortable: true },
    { accessorKey: 'userAgent', header: 'User-Agent match', grow: 2 },
    { accessorKey: 'modifiedAgo', header: 'Last modified', minWidth: 160 }
  ]
  const groups = ref<DeviceGroup[]>(sampleDeviceGroups.map((group) => ({ ...group })))

  const search = ref('')
  const tableEl = ref<TableExposed | null>(null)

  const drawerOpen = ref(false)
  const editingId = ref('')
  const form = reactive({ name: '', userAgent: '' })
  const errors = reactive({ name: '', userAgent: '' })
  const drawerTitle = computed(() => (editingId.value ? 'Edit Device Group' : 'Add Device Group'))

  const openGroup = (group?: DeviceGroup) => {
    editingId.value = group?.id ?? ''
    form.name = group?.name ?? ''
    form.userAgent = group?.userAgent ?? ''
    errors.name = ''
    errors.userAgent = ''
    drawerOpen.value = true
  }

  watch(
    () => form.name,
    () => (errors.name = '')
  )
  watch(
    () => form.userAgent,
    () => (errors.userAgent = '')
  )

  const validate = () => {
    const name = form.name.trim()
    if (!name) errors.name = 'Enter a name for the device group.'
    else if (!/^[a-z0-9-]+$/.test(name))
      errors.name = 'Use lowercase letters, numbers and hyphens only.'
    errors.userAgent = form.userAgent.trim() ? '' : 'Enter a regular expression.'
    return !errors.name && !errors.userAgent
  }

  const submit = () => {
    if (!validate()) return
    const record = { name: form.name.trim(), userAgent: form.userAgent.trim() }
    const existing = groups.value.find((group) => group.id === editingId.value)
    if (existing) Object.assign(existing, record, { modifiedAgo: 'Just now' })
    else
      groups.value = [
        ...groups.value,
        {
          id: String(3100 + groups.value.length + 1),
          ...record,
          author: 'John Smith',
          modifiedAgo: 'Just now'
        }
      ]
    drawerOpen.value = false
    toast.success(
      existing ? `Device group "${record.name}" saved.` : `Device group "${record.name}" added.`,
      { description: 'The change is part of this draft until you deploy it.' }
    )
  }
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
          title="Device Groups"
          description="Group requests by their User-Agent, then vary cache and rules by group."
          action-label="Add Device Group"
          action-icon="az az-plus"
          @action="openGroup()"
        />

        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ListControls
            v-model:search="search"
            search-label="Search device groups"
            :table="tableEl"
            csv-filename="web-app-device-groups.csv"
          />
          <Card :padded="false">
            <template #default>
              <DataTable
                ref="tableEl"
                v-model:globalFilter="search"
                :data="groups"
                :columns="groupColumns"
                row-key="id"
                sortable
                paginated
                :page-size="10"
                :bordered="false"
                aria-label="Device groups"
              >
                <template #cell-name="{ row }">
                  <Button
                    variant="link"
                    class="min-w-0 max-w-full"
                    :title="row.name"
                    @click="openGroup(row)"
                  >
                    <span class="truncate">{{ row.name }}</span>
                  </Button>
                </template>
                <template #cell-userAgent="{ value }">
                  <span class="truncate text-label-code-sm text-(--text-muted)">{{ value }}</span>
                </template>
                <template #cell-modifiedAgo="{ row }">
                  <ModifiedBy
                    :author="row.author"
                    :modified-ago="row.modifiedAgo"
                  />
                </template>
                <template #empty>
                  <TableEmpty
                    :search="search"
                    no-match="No matching device groups"
                    empty-title="No device groups yet"
                    icon="az az-mobile"
                    empty-action-label="Add Device Group"
                    @clear="search = ''"
                    @add="openGroup()"
                  />
                </template>
              </DataTable>
            </template>
          </Card>
        </section>
      </div>

      <RecordDrawer
        v-model:open="drawerOpen"
        :title="drawerTitle"
        description="Requests whose User-Agent matches the expression belong to the group."
        :submit-label="editingId ? 'Save' : 'Add Device Group'"
        @submit="submit"
      >
        <SettingsGroup
          label="General"
          hint="Names the group in the rules that reference it, so renaming it means revisiting those rules."
        >
          <Field :invalid="!!errors.name">
            <Field.Label>Name</Field.Label>
            <Input
              v-model="form.name"
              size="large"
              class="w-full"
              placeholder="mobile"
              autocomplete="off"
              monospace
              :spellcheck="false"
            />
            <Field.Description>Lowercase letters, numbers and hyphens.</Field.Description>
            <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
          </Field>
        </SettingsGroup>
        <SettingsGroup
          label="Match to User-Agent"
          hint="Every request whose User-Agent header matches this expression belongs to the group."
        >
          <Field :invalid="!!errors.userAgent">
            <Field.Label>Regular expression</Field.Label>
            <Textarea
              v-model="form.userAgent"
              class="w-full"
              placeholder="(Mobile|iP(hone|od)|Android)"
              monospace
              :spellcheck="false"
            />
            <Field.Description>
              Matched against the full header value, so anchor the pattern when you need one.
            </Field.Description>
            <Field.Error v-if="errors.userAgent">{{ errors.userAgent }}</Field.Error>
          </Field>
        </SettingsGroup>
      </RecordDrawer>
    </div>
  </ScrollArea>
</template>
