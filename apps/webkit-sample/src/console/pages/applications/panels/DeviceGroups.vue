<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import TableRoot from '@aziontech/webkit/table-root'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../../components/form/ResourceDrawer.vue'
  import AuthorCell from '../../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import IdCell from '../../../components/list/IdCell.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { sleep } from '../../../lib/behavior/forms'
  import { useListRefresh } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN } from '../../../lib/behavior/table-columns'
  import {
    addDeviceGroup,
    DEVICE_GROUP_NAME_PATTERN,
    DEVICE_GROUP_NAME_RULE,
    updateDeviceGroup,
    useDeviceGroups
  } from '../../../lib/data/device-groups'
  import { productFirstUse } from '../../../lib/data/product-empty-states'

  const HELP = productFirstUse('applications').learnMore.href

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, enableSorting: true },
    { accessorKey: 'id', header: 'ID', minWidth: FIT_COLUMN },
    { accessorKey: 'userAgent', header: 'User-agent match', grow: 2 },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    }
  ]

  const search = ref('')

  const { loading, refresh } = useListRefresh()

  const tableRef = ref(null)

  const columnVisibility = ref({ id: false })

  const deviceGroups = useDeviceGroups()

  const createOpen = ref(false)
  const editing = ref(null)
  const form = reactive({ name: '', userAgent: '' })
  const errors = reactive({ name: '', userAgent: '' })
  const submitting = ref(false)

  const openCreate = () => {
    editing.value = null
    createOpen.value = true
  }

  const openGroup = (event, row) => {
    editing.value = row
    form.name = row.name
    form.userAgent = row.userAgent
    errors.name = ''
    errors.userAgent = ''
    createOpen.value = true
  }

  watch(createOpen, (open) => {
    if (open) return
    editing.value = null
    form.name = ''
    form.userAgent = ''
    errors.name = ''
    errors.userAgent = ''
  })

  const validate = () => {
    const name = form.name.trim()
    if (!name) errors.name = 'Name is required.'
    else if (!DEVICE_GROUP_NAME_PATTERN.test(name)) errors.name = DEVICE_GROUP_NAME_RULE
    else errors.name = ''

    errors.userAgent = form.userAgent.trim() ? '' : 'A regular expression is required.'
    return !errors.name && !errors.userAgent
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await sleep(900)
      const record = { name: form.name.trim(), userAgent: form.userAgent.trim() }
      if (editing.value) {
        updateDeviceGroup(editing.value.id, record)
        toast.success(`Device Group "${record.name}" saved.`)
      } else {
        addDeviceGroup(record)
        toast.success(`Device Group "${record.name}" created.`)
      }
      createOpen.value = false
    } catch (error) {
      toast.error(
        editing.value ? 'Could not save the device group.' : 'Could not create the device group.',
        {
          description: error?.message ?? 'Check your connection and try again.',
          action: { label: 'Retry', onClick: () => submit() }
        }
      )
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Device Groups"
      description="Group requests by User-Agent to apply custom application behaviors."
      size="small"
      :documentation="HELP"
    >
      <template #actions>
        <HeadingAction
          label="Add Device Group"
          kind="outlined"
          icon="pi pi-plus"
          @click="openCreate"
        />
      </template>
    </PageHeading>

    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <ControlsHeader>
          <InputText
            v-model="search"
            size="medium"
            placeholder="Search device groups"
            aria-label="Search device groups"
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
              filename="device-groups.csv"
            />
            <ColumnsButton
              v-model="columnVisibility"
              :columns="columns"
            />
          </template>
        </ControlsHeader>

        <CardBox :padded="false">
          <template #content>
            <TableRoot
              ref="tableRef"
              v-model:globalFilter="search"
              v-model:columnVisibility="columnVisibility"
              :data="deviceGroups"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
              :loading="loading"
              @row-click="openGroup"
            >
              <template #cell-name="{ value }">
                <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
              </template>

              <template #cell-id="{ value }">
                <IdCell
                  :value="value"
                  resource="device group"
                />
              </template>

              <template #cell-author="{ row }">
                <AuthorCell
                  :author="row.author"
                  :avatar-src="row.authorAvatar"
                />
              </template>

              <template #cell-lastModified="{ row }">
                <LastModifiedCell :date="row.modifiedAt" />
              </template>
            </TableRoot>
          </template>
        </CardBox>
      </section>
    </section>

    <ResourceDrawer
      v-model:open="createOpen"
      :title="editing ? 'Edit Device Group' : 'Add Device Group'"
      :submitting="submitting"
      @submit="submit"
    >
      <Section
        stacked
        :divided="false"
        title="General"
        hint="Names the group in the rules that reference it, so renaming it later means revisiting every rule that uses it."
      >
        <FieldStack
          label="Name"
          :description="DEVICE_GROUP_NAME_RULE"
          :message="errors.name"
          :message-kind="form.name.trim() ? 'invalid' : 'required'"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              :disabled="submitting"
              class="w-full font-code"
              placeholder="mobiledevices"
              :required="!!errors.name && !form.name.trim()"
              :invalid="!!errors.name && !!form.name.trim()"
              :aria-describedby="describedBy"
              @update:model-value="errors.name = ''"
            />
          </template>
        </FieldStack>
      </Section>

      <Section
        stacked
        :divided="false"
        title="Match to User-Agent"
        hint="Every request whose User-Agent header matches this expression belongs to the group."
      >
        <FieldStack
          label="Regular expression"
          description="Matched against the header's full value, so anchor the pattern if you need one."
          :message="errors.userAgent"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <Textarea
              :id="controlId"
              v-model="form.userAgent"
              :disabled="submitting"
              class="w-full font-code"
              placeholder="(Mobile|iP(hone|od)|BlackBerry|IEMobile)"
              :required="!!errors.userAgent"
              :aria-describedby="describedBy"
              @update:model-value="errors.userAgent = ''"
            />
          </template>
        </FieldStack>
      </Section>
    </ResourceDrawer>
  </div>
</template>
