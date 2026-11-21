<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SchemaForm, { type SchemaFormSchema } from '@aziontech/webkit/schema-form'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  import DetailVersion from '../detail-version.vue'

  type FunctionOption = {
    value: string
    label: string
    schema: SchemaFormSchema | null
  }
  type FunctionInstance = {
    id: string
    name: string
    functionId: string
    args: Record<string, unknown>
    active: boolean
    author: string
    modifiedAgo: string
  }

  const CREATE_FUNCTION = '__create-function__'
  const functionOptions: FunctionOption[] = [
    {
      value: 'image-resizer',
      label: 'image-resizer',
      schema: {
        type: 'object',
        required: ['width'],
        properties: {
          width: {
            type: 'integer',
            title: 'Width',
            description: 'The width in pixels images are resized to.',
            minimum: 16,
            maximum: 4096
          },
          quality: {
            type: 'integer',
            title: 'Quality',
            description: 'JPEG and WebP quality, from 1 to 100.',
            minimum: 1,
            maximum: 100
          },
          format: {
            type: 'string',
            title: 'Format',
            description: 'The format served to browsers that accept it.',
            enum: ['webp', 'avif', 'jpeg']
          }
        }
      }
    },
    {
      value: 'maintenance-page',
      label: 'maintenance-page',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            title: 'Message',
            description: 'The text visitors read while the site is down.',
            maxLength: 120
          },
          retryAfter: {
            type: 'integer',
            title: 'Retry after in seconds',
            description: 'Sent in the Retry-After header.',
            minimum: 0
          }
        }
      }
    },
    { value: 'header-rewrite', label: 'header-rewrite', schema: null }
  ]
  const functionLabel = (value: unknown) =>
    functionOptions.find((option) => option.value === value)?.label ?? ''

  const instanceColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, sortable: true },
    { accessorKey: 'functionId', header: 'Function', minWidth: 160 },
    { accessorKey: 'args', header: 'Arguments', grow: 2 },
    { accessorKey: 'active', header: 'Status', minWidth: 104 },
    { accessorKey: 'modifiedAgo', header: 'Last modified', minWidth: 160 }
  ]
  const instances = ref<FunctionInstance[]>([
    {
      id: '5201',
      name: 'product-images',
      functionId: 'image-resizer',
      args: { width: 640, quality: 80, format: 'webp' },
      active: true,
      author: 'Priya Patel',
      modifiedAgo: '5 hours ago'
    },
    {
      id: '5202',
      name: 'security-headers',
      functionId: 'header-rewrite',
      args: { set: { 'strict-transport-security': 'max-age=31536000' } },
      active: true,
      author: 'John Smith',
      modifiedAgo: '3 days ago'
    },
    {
      id: '5203',
      name: 'planned-maintenance',
      functionId: 'maintenance-page',
      args: { message: 'We are upgrading the store. Back soon.', retryAfter: 1800 },
      active: false,
      author: 'Alex Morgan',
      modifiedAgo: '2 weeks ago'
    }
  ])

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

  const FUNCTION_LINK_CLASS =
    'group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)'
</script>

<template>
  <DetailVersion tab="functions-instances">
    <template #functions-instances>
      <ScrollArea
        aria-label="Version settings"
        fade
      >
        <div class="flex min-h-full flex-col">
          <div
            class="layout-column layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Functions Instances"
              description="Functions instantiated on this resource with their own arguments. A rule runs an instance."
              size="small"
            >
              <template #actions>
                <Button
                  label="Add Functions Instance"
                  variant="outline"
                  size="medium"
                  icon="az az-plus"
                  @click="openInstance()"
                />
              </template>
            </PageHeader>

            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex items-center gap-(--layout-group-gap)">
                <div class="flex min-w-36 grow basis-(--container-2xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search functions instances"
                    aria-label="Search functions instances"
                    class="w-full"
                  >
                    <template #leading>
                      <i
                        class="az az-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
                <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                  <Tooltip
                    content="Refresh"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="az az-refresh"
                      variant="outline"
                      size="medium"
                      aria-label="Refresh"
                    />
                  </Tooltip>
                  <Tooltip
                    content="Download CSV"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="az az-download"
                      variant="outline"
                      size="medium"
                      :disabled="!tableEl"
                      aria-label="Download CSV"
                      @click="tableEl?.exportCsv({ filename: 'web-app-functions-instances.csv' })"
                    />
                  </Tooltip>
                  <Tooltip
                    content="Columns"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="az az-columns-3"
                      variant="outline"
                      size="medium"
                      aria-label="Columns"
                    />
                  </Tooltip>
                </div>
              </header>
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
                        <Tooltip :content="`Open ${value} in Functions`">
                          <a
                            :href="`/functions/${value}`"
                            :class="FUNCTION_LINK_CLASS"
                          >
                            <span class="truncate underline-offset-2 group-hover/link:underline">{{
                              value
                            }}</span>
                            <i
                              class="az az-external-link shrink-0 text-body-xs leading-none"
                              aria-hidden="true"
                            />
                          </a>
                        </Tooltip>
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
                      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <Tooltip :content="row.author">
                          <Avatar
                            :alt="row.author"
                            :label="row.author"
                            size="small"
                            variant="square"
                          />
                        </Tooltip>
                        <span class="truncate text-body-sm text-(--text-muted)">{{
                          row.modifiedAgo
                        }}</span>
                      </div>
                    </template>
                    <template #empty>
                      <EmptyState
                        key="empty-state-1"
                        v-if="search.trim()"
                        size="medium"
                        icon="az az-search"
                        title="No matching functions instances"
                        :description="`Nothing matches ${search.trim()}.`"
                      >
                        <template #actions>
                          <Button
                            label="Clear search"
                            variant="outline"
                            size="small"
                            @click="search = ''"
                          />
                        </template>
                      </EmptyState>
                      <EmptyState
                        key="empty-state-2"
                        v-else
                        size="medium"
                        icon="az az-functions"
                        title="No functions instances yet"
                        description="Add the first one to this version."
                      >
                        <template #actions>
                          <Button
                            label="Add Functions Instance"
                            icon="az az-plus"
                            variant="secondary"
                            size="small"
                            @click="openInstance()"
                          />
                        </template>
                      </EmptyState>
                    </template>
                  </DataTable>
                </template>
              </Card>
            </section>
          </div>

          <Drawer
            v-model:open="drawerOpen"
            size="large"
            side="end"
          >
            <DrawerContent>
              <form
                class="flex min-h-0 flex-1 flex-col"
                :aria-label="drawerTitle"
                novalidate
                @submit.prevent="submit"
              >
                <PanelHeader class="w-full">
                  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                    <DrawerTitle>{{ drawerTitle }}</DrawerTitle>
                    <DrawerDescription>
                      Pick a function and the arguments it runs with on this resource.
                    </DrawerDescription>
                  </div>
                </PanelHeader>
                <PanelBody>
                  <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
                    <legend class="sr-only">{{ drawerTitle }}</legend>
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
                          <Field.Error v-if="errors.functionId">{{
                            errors.functionId
                          }}</Field.Error>
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
                  </fieldset>
                </PanelBody>
                <PanelFooter>
                  <div class="flex w-full justify-end gap-(--spacing-xs)">
                    <Button
                      type="button"
                      label="Cancel"
                      variant="outline"
                      size="medium"
                      @click="drawerOpen = false"
                    />
                    <Button
                      type="submit"
                      :label="editingId ? 'Save' : 'Add Functions Instance'"
                      variant="primary"
                      size="medium"
                    />
                  </div>
                </PanelFooter>
              </form>
            </DrawerContent>
          </Drawer>
        </div>
      </ScrollArea>
    </template>
  </DetailVersion>
</template>
