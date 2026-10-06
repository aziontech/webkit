<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import InputText from '@aziontech/webkit/input-text'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../../components/form/ResourceDrawer.vue'
  import AuthorCell from '../../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { useListRefresh } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../../lib/behavior/table-columns'
  import { WAF_CONDITIONS, wafAllowedFor } from '../../../lib/data/waf-rules'

  interface Props {
    ruleSet: Record<string, unknown>
    seed?: unknown[]
    onSeedConsumed?: (...args: unknown[]) => unknown
  }

  const props = withDefaults(defineProps<Props>(), {
    seed: () => [],
    onSeedConsumed: null
  })

  const rules = ref(wafAllowedFor(props.ruleSet.id))

  const search = ref('')

  const { loading, refresh } = useListRefresh()

  const tableRef = ref(null)
  const columnVisibility = ref({})

  const columns = [
    {
      accessorKey: 'ruleId',
      header: 'Rule ID',
      enableSorting: true,
      principal: true,
      hideable: false
    },
    { accessorKey: 'description', header: 'Description', grow: 3 },
    { accessorKey: 'path', header: 'Path', grow: 2 },
    { accessorKey: 'conditions', header: 'Conditions', grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const createOpen = ref(false)
  const editing = ref(null)
  const form = reactive({ ruleId: '', description: '', path: '', conditions: [] })
  const errors = reactive({ ruleId: '', path: '' })
  const submitting = ref(false)

  const reset = () => {
    form.ruleId = ''
    form.description = ''
    form.path = ''
    form.conditions = []
    errors.ruleId = ''
    errors.path = ''
  }

  const openCreate = () => {
    editing.value = null
    reset()
    createOpen.value = true
  }

  const openEdit = (row) => {
    editing.value = row
    form.ruleId = row.ruleId
    form.description = row.description
    form.path = row.path
    form.conditions = [...row.conditions]
    errors.ruleId = ''
    errors.path = ''
    createOpen.value = true
  }

  watch(
    () => props.seed,
    (tuningRows) => {
      if (!tuningRows?.length) return
      const first = tuningRows[0]
      editing.value = null
      reset()
      form.ruleId = first.ruleId
      form.path = first.paths?.[0] ?? ''
      createOpen.value = true
      props.onSeedConsumed?.()
    },
    { immediate: true }
  )

  watch(createOpen, (open) => {
    if (!open) {
      editing.value = null
      reset()
    }
  })

  const submit = async () => {
    const ruleId = form.ruleId.trim()
    const path = form.path.trim()
    errors.ruleId = ruleId ? '' : 'A rule ID is required.'
    errors.path = path ? '' : 'A path is required, so the exception stays scoped.'
    if (errors.ruleId || errors.path) return

    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (editing.value) {
      Object.assign(editing.value, {
        ruleId,
        path,
        description: form.description.trim(),
        conditions: [...form.conditions]
      })
      toast.success(`Allowed rule ${ruleId} updated.`)
    } else {
      rules.value = [
        {
          id: `wa-${Date.now()}`,
          ruleId,
          path,
          description: form.description.trim(),
          conditions: [...form.conditions],
          status: 'Active',
          modifiedAt: new Date(),
          lastModified: 'just now',
          author: 'You',
          authorAvatar: ''
        },
        ...rules.value
      ]
      toast.success(`Rule ${ruleId} is now allowed on ${path}.`)
    }

    submitting.value = false
    createOpen.value = false
  }

  const conditionsLabel = (value) =>
    !value?.length ? '' : value.length === 1 ? value[0] : `${value.length} conditions`

  const rowActions = computed(() => [
    { label: 'Edit', value: 'edit', icon: 'pi pi-pencil' },
    { label: 'Delete', value: 'delete', icon: 'pi pi-trash', danger: true }
  ])

  const onRowAction = (value, row) => {
    if (value === 'edit') return openEdit(row)
    rules.value = rules.value.filter((rule) => rule.id !== row.id)
    toast.success(`Allowed rule ${row.ruleId} deleted.`)
  }
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Allowed Rules"
      description="Matches this rule set permits. Each one is scoped to a path, so the rule keeps enforcing everywhere else."
      size="small"
    >
      <template #actions>
        <HeadingAction
          label="Add Allowed Rule"
          kind="outlined"
          icon="pi pi-plus"
          @click="openCreate"
        />
      </template>
    </PageHeading>

    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <ControlsHeader v-if="rules.length">
          <InputText
            v-model="search"
            size="medium"
            placeholder="Search allowed rules"
            aria-label="Search allowed rules"
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
              filename="waf-allowed-rules.csv"
            />
            <ColumnsButton
              v-model="columnVisibility"
              :columns="columns"
            />
          </template>
        </ControlsHeader>

        <CardBox :padded="false">
          <template #content>
            <EmptyState
              v-if="!rules.length"
              icon="ai ai-waf"
              title="No allowed rules"
              description="Nothing is exempt from this rule set. Add an exception when a rule matches legitimate traffic."
            >
              <template #actions>
                <Button
                  label="Add Allowed Rule"
                  kind="secondary"
                  size="large"
                  icon="pi pi-plus"
                  @click="openCreate"
                />
              </template>
            </EmptyState>
            <TableRoot
              v-else
              ref="tableRef"
              v-model:globalFilter="search"
              v-model:columnVisibility="columnVisibility"
              :data="rules"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
              :row-actions="rowActions"
              :loading="loading"
              @row-click="(event, row) => openEdit(row)"
              @row-action="onRowAction"
            >
              <template #cell-ruleId="{ value }">
                <span class="cursor-pointer truncate font-mono hover:underline">{{ value }}</span>
              </template>

              <template #cell-path="{ value }">
                <span class="truncate font-mono text-body-sm">{{ value }}</span>
              </template>

              <template #cell-conditions="{ value }">
                <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-xxs)">
                  <Tag
                    v-for="condition in value"
                    :key="condition"
                    :label="condition"
                    size="small"
                  />
                  <span
                    v-if="!value.length"
                    class="text-(--text-muted)"
                    >Any</span
                  >
                </span>
              </template>

              <template #cell-status="{ value }">
                <Tag
                  :label="value"
                  :severity="value === 'Active' ? 'success' : 'neutral'"
                  size="small"
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
      :title="editing ? 'Edit Allowed Rule' : 'Add Allowed Rule'"
      :submitting="submitting"
      @submit="submit"
    >
      <Section
        stacked
        :divided="false"
        title="Rule"
        hint="The rule this exception applies to."
      >
        <FieldStack
          label="Rule ID"
          description="The ID reported on the Tuning tab."
          :message="errors.ruleId"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.ruleId"
              size="large"
              :disabled="submitting"
              class="w-full font-code"
              placeholder="1005"
              :required="!!errors.ruleId"
              :aria-describedby="describedBy"
              @update:model-value="errors.ruleId = ''"
            />
          </template>
        </FieldStack>

        <FieldStack
          label="Description"
          description="Why this traffic is legitimate. The next person to read this list is deciding whether the exception is still needed."
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.description"
              size="large"
              :disabled="submitting"
              class="w-full"
              placeholder="Search accepts quotes in free-text queries"
              :aria-describedby="describedBy"
            />
          </template>
        </FieldStack>
      </Section>

      <Section
        stacked
        :divided="false"
        title="Scope"
        hint="Where the exception applies."
      >
        <FieldStack
          label="Path"
          description="Required. A rule allowed with no path stops being enforced anywhere."
          :message="errors.path"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.path"
              size="large"
              :disabled="submitting"
              class="w-full font-code"
              placeholder="/api/v1/search"
              :required="!!errors.path"
              :aria-describedby="describedBy"
              @update:model-value="errors.path = ''"
            />
          </template>
        </FieldStack>

        <FieldStack
          label="Conditions"
          description="The parts of the request the exception covers. Leave empty to allow the rule anywhere on that path."
        >
          <template #default="{ controlId, describedBy }">
            <MultiSelect
              v-model="form.conditions"
              size="large"
              :disabled="submitting"
              placeholder="Any part of the request"
              :display-value="conditionsLabel"
              class="w-full"
            >
              <MultiSelect.Trigger
                :id="controlId"
                :aria-describedby="describedBy"
              />
              <MultiSelect.Content>
                <MultiSelect.Option
                  v-for="option in WAF_CONDITIONS"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </MultiSelect.Option>
              </MultiSelect.Content>
            </MultiSelect>
          </template>
        </FieldStack>
      </Section>
    </ResourceDrawer>
  </div>
</template>
