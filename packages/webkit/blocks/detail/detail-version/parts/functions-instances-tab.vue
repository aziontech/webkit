<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import SchemaForm from '@aziontech/webkit/schema-form'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  import {
    type FunctionInstance,
    sampleFunctionInstances,
    sampleFunctionOptions as functionOptions
  } from '../sample'
  import ListControls from './list-controls.vue'
  import ListTabHeader from './list-tab-header.vue'
  import ModifiedBy from './modified-by.vue'
  import RecordDrawer from './record-drawer.vue'
  import TableEmpty from './table-empty.vue'

  const CREATE_FUNCTION = '__create-function__'
  const functionLabel = (value: unknown) =>
    functionOptions.find((option) => option.value === value)?.label ?? ''

  const instanceColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, sortable: true },
    { accessorKey: 'functionId', header: 'Function', minWidth: 160 },
    { accessorKey: 'args', header: 'Arguments', grow: 2 },
    { accessorKey: 'active', header: 'Status', minWidth: 104 },
    { accessorKey: 'modifiedAgo', header: 'Last modified', minWidth: 160 }
  ]
  const instances = ref<FunctionInstance[]>(
    sampleFunctionInstances.map((instance) => ({ ...instance, args: { ...instance.args } }))
  )

  const search = ref('')
  const tableEl = ref<TableExposed | null>(null)

  const drawerOpen = ref(false)
  const functionSelectOpen = ref(false)
  const editingId = ref('')
  const form = reactive({
    name: '',
    functionId: '',
    args: {} as Record<string, unknown>,
    argsJson: '{}'
  })
  const errors = reactive({ name: '', functionId: '', args: '' })
  const drawerTitle = computed(() =>
    editingId.value ? 'Edit Functions Instance' : 'Add Functions Instance'
  )
  const selectedSchema = computed(
    () => functionOptions.find((option) => option.value === form.functionId)?.schema ?? null
  )

  const openInstance = (instance?: FunctionInstance) => {
    editingId.value = instance?.id ?? ''
    form.name = instance?.name ?? ''
    form.functionId = instance?.functionId ?? ''
    form.args = { ...(instance?.args ?? {}) }
    form.argsJson = JSON.stringify(instance?.args ?? {}, null, 2)
    Object.assign(errors, { name: '', functionId: '', args: '' })
    drawerOpen.value = true
  }

  const onFunction = (value: string) => {
    if (value === CREATE_FUNCTION) {
      functionSelectOpen.value = false
      toast.info('Create Function', {
        description: 'The function editor opens, then brings you back here with it selected.'
      })
      return
    }
    form.functionId = value
    form.args = {}
    form.argsJson = '{}'
    errors.functionId = ''
  }

  watch(
    () => form.name,
    () => (errors.name = '')
  )
  watch(
    () => form.argsJson,
    () => (errors.args = '')
  )

  const parsedArgs = () => {
    if (selectedSchema.value) return form.args
    try {
      return JSON.parse(form.argsJson || '{}') as Record<string, unknown>
    } catch {
      return null
    }
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'Enter a name for the instance.'
    errors.functionId = form.functionId ? '' : 'Select a function.'
    errors.args = parsedArgs() ? '' : 'Write the arguments as a JSON object.'
    return !errors.name && !errors.functionId && !errors.args
  }

  const submit = () => {
    if (!validate()) return
    const record = {
      name: form.name.trim(),
      functionId: form.functionId,
      args: parsedArgs() ?? {}
    }
    const existing = instances.value.find((instance) => instance.id === editingId.value)
    if (existing) Object.assign(existing, record, { modifiedAgo: 'Just now' })
    else
      instances.value = [
        ...instances.value,
        {
          id: String(5200 + instances.value.length + 1),
          ...record,
          active: true,
          author: 'John Smith',
          modifiedAgo: 'Just now'
        }
      ]
    drawerOpen.value = false
    toast.success(
      existing ? `Instance "${record.name}" saved.` : `Instance "${record.name}" added.`,
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
          title="Functions Instances"
          description="Functions instantiated on this resource with their own arguments. A rule runs an instance."
          action-label="Add Functions Instance"
          action-icon="az az-plus"
          @action="openInstance()"
        />

        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ListControls
            v-model:search="search"
            search-label="Search functions instances"
            :table="tableEl"
            csv-filename="web-app-functions-instances.csv"
          />
          <Card :padded="false">
            <template #default>
              <DataTable
                ref="tableEl"
                v-model:globalFilter="search"
                :data="instances"
                :columns="instanceColumns"
                row-key="id"
                sortable
                paginated
                :page-size="10"
                :bordered="false"
                aria-label="Functions instances"
              >
                <template #cell-name="{ row }">
                  <Button
                    variant="link"
                    class="min-w-0 max-w-full"
                    :title="row.name"
                    @click="openInstance(row)"
                  >
                    <span class="truncate">{{ row.name }}</span>
                  </Button>
                </template>
                <template #cell-functionId="{ value }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <Tooltip content="JavaScript">
                      <i
                        class="az-color az-javascript shrink-0 text-body-lg"
                        role="img"
                        aria-label="JavaScript"
                      />
                    </Tooltip>
                    <TableCellLink
                      :label="value"
                      :href="`/functions/${value}`"
                    />
                  </div>
                </template>
                <template #cell-args="{ value }">
                  <span class="truncate text-label-code-sm text-(--text-muted)">{{
                    JSON.stringify(value)
                  }}</span>
                </template>
                <template #cell-active="{ value }">
                  <Tag
                    :label="value ? 'Active' : 'Inactive'"
                    :severity="value ? 'success' : 'neutral'"
                    size="medium"
                  />
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
                    no-match="No matching functions instances"
                    empty-title="No functions instances yet"
                    icon="az az-functions"
                    empty-action-label="Add Functions Instance"
                    @clear="search = ''"
                    @add="openInstance()"
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
        description="Pick a function and the arguments it runs with on this resource."
        :submit-label="editingId ? 'Save' : 'Add Functions Instance'"
        @submit="submit"
      >
        <SettingsGroup
          label="General"
          hint="A function can run more than once with different arguments; the name tells the instances apart in the rules."
        >
          <Field :invalid="!!errors.name">
            <Field.Label>Name</Field.Label>
            <Input
              v-model="form.name"
              size="large"
              class="w-full"
              placeholder="product-images"
              autocomplete="off"
            />
            <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
          </Field>
        </SettingsGroup>
        <SettingsGroup
          label="Function"
          hint="Select an existing function and set the arguments it runs with."
        >
          <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
            <Field :invalid="!!errors.functionId">
              <Field.Label>Function</Field.Label>
              <Select
                v-model:open="functionSelectOpen"
                :model-value="form.functionId"
                size="large"
                class="w-full"
                placeholder="Select a function"
                :invalid="!!errors.functionId"
                :display-value="functionLabel"
                @update:model-value="onFunction"
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item
                    v-for="option in functionOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                  <template #footer>
                    <Select.Item
                      :value="CREATE_FUNCTION"
                      class="w-full"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">
                        <i
                          class="az az-circle-plus"
                          aria-hidden="true"
                        />
                        Create Function
                      </span>
                    </Select.Item>
                  </template>
                </Select.Content>
              </Select>
              <Field.Description>
                Only functions written for this resource are listed.
              </Field.Description>
              <Field.Error v-if="errors.functionId">{{ errors.functionId }}</Field.Error>
            </Field>

            <SchemaForm
              v-if="selectedSchema"
              v-model="form.args"
              :schema="selectedSchema"
            />
            <Field
              v-else-if="form.functionId"
              :invalid="!!errors.args"
            >
              <Field.Label>Arguments</Field.Label>
              <CodeEditor
                v-model="form.argsJson"
                language="json"
                path="function-instance.args.json"
                height="12rem"
                :invalid="!!errors.args"
                aria-label="Arguments"
              />
              <Field.Description>
                A JSON object, read in the function as event.args.
              </Field.Description>
              <Field.Error v-if="errors.args">{{ errors.args }}</Field.Error>
            </Field>
          </div>
        </SettingsGroup>
      </RecordDrawer>
    </div>
  </ScrollArea>
</template>
