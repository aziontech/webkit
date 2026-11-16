<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn, type TableExposed } from '@aziontech/webkit/data-table'
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
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  import VersionDetail from '../version-detail.vue'

  type DeviceGroup = {
    id: string
    name: string
    userAgent: string
    author: string
    modifiedAgo: string
  }

  const groupColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, sortable: true },
    { accessorKey: 'userAgent', header: 'User-Agent match', grow: 2 },
    { accessorKey: 'modifiedAgo', header: 'Last modified', minWidth: 160 }
  ]
  const groups = ref<DeviceGroup[]>([
    {
      id: '3101',
      name: 'mobile',
      userAgent: '(Mobile|iP(hone|od)|Android|IEMobile)',
      author: 'Jane Doe',
      modifiedAgo: '2 days ago'
    },
    {
      id: '3102',
      name: 'tablet',
      userAgent: '(iPad|Tablet|Kindle|Silk)',
      author: 'Alex Morgan',
      modifiedAgo: '1 week ago'
    },
    {
      id: '3103',
      name: 'crawlers',
      userAgent: '(Googlebot|Bingbot|DuckDuckBot)',
      author: 'Sam Lee',
      modifiedAgo: '3 weeks ago'
    }
  ])

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
  <VersionDetail tab="device-groups">
    <template #device-groups>
      <ScrollArea
        aria-label="Version settings"
        fade
      >
        <div class="flex min-h-full flex-col">
          <div
            class="layout-column layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Device Groups"
              description="Group requests by their User-Agent, then vary cache and rules by group."
              size="small"
            >
              <template #actions>
                <Button
                  label="Add Device Group"
                  variant="outline"
                  size="medium"
                  icon="ai ai-plus"
                  @click="openGroup()"
                />
              </template>
            </PageHeader>

            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex items-center gap-(--layout-group-gap)">
                <div class="flex min-w-36 grow basis-(--container-2xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search device groups"
                    aria-label="Search device groups"
                    class="w-full"
                  >
                    <template #leading>
                      <i
                        class="ai ai-search"
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
                      icon="ai ai-refresh"
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
                      icon="ai ai-download"
                      variant="outline"
                      size="medium"
                      :disabled="!tableEl"
                      aria-label="Download CSV"
                      @click="tableEl?.exportCsv({ filename: 'web-app-device-groups.csv' })"
                    />
                  </Tooltip>
                  <Tooltip
                    content="Columns"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="ai ai-column"
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
                      <span class="truncate text-label-code-sm text-(--text-muted)">{{
                        value
                      }}</span>
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
                        icon="ai ai-search"
                        title="No matching device groups"
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
                        icon="ai ai-mobile"
                        title="No device groups yet"
                        description="Add the first one to this version."
                      >
                        <template #actions>
                          <Button
                            label="Add Device Group"
                            icon="ai ai-plus"
                            variant="secondary"
                            size="small"
                            @click="openGroup()"
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
                      Requests whose User-Agent matches the expression belong to the group.
                    </DrawerDescription>
                  </div>
                </PanelHeader>
                <PanelBody>
                  <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
                    <legend class="sr-only">{{ drawerTitle }}</legend>
                    <SettingsSection
                      title="General"
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
                        <Field.Description
                          >Lowercase letters, numbers and hyphens.</Field.Description
                        >
                        <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
                      </Field>
                    </SettingsSection>
                    <SettingsSection
                      title="Match to User-Agent"
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
                          Matched against the full header value, so anchor the pattern when you need
                          one.
                        </Field.Description>
                        <Field.Error v-if="errors.userAgent">{{ errors.userAgent }}</Field.Error>
                      </Field>
                    </SettingsSection>
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
                      :label="editingId ? 'Save' : 'Add Device Group'"
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
  </VersionDetail>
</template>
