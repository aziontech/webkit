<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { daysAgo, formatListDate } from '@shared/lib/dates'
  import { authorAt } from '@shared/lib/people'
  import { computed, defineAsyncComponent, onMounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../../components/form/ResourceDrawer.vue'
  import FunctionArgsFields from '../../../components/function/FunctionArgsFields.vue'
  import AuthorCell from '../../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import FilterButton from '../../../components/list/FilterButton.vue'
  import FilterChips from '../../../components/list/FilterChips.vue'
  import IdCell from '../../../components/list/IdCell.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import ResourceLink from '../../../components/resource/ResourceLink.vue'
  import { sleep } from '../../../lib/behavior/forms'
  import { useListFilters } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../../lib/behavior/table-columns'
  import { countInstance, functionById, functionOptionsFor } from '../../../lib/data/functions'
  import { productFirstUse } from '../../../lib/data/product-empty-states'

  interface Props {
    environment?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    environment: 'application'
  })

  const SUBJECT = {
    application: { noun: 'application', product: 'applications' },
    firewall: { noun: 'firewall', product: 'firewall' }
  }

  const subject = computed(() => SUBJECT[props.environment] ?? SUBJECT.application)
  const HELP = computed(() => productFirstUse(subject.value.product).learnMore.href)

  const MonacoEditor = defineAsyncComponent(
    () => import('../../../components/monaco-editor/monaco-editor.vue')
  )

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, enableSorting: true },
    { accessorKey: 'id', header: 'ID', minWidth: FIT_COLUMN },
    { accessorKey: 'edgeFunction', header: 'Function', minWidth: FIT_COLUMN },
    { accessorKey: 'args', header: 'Arguments', grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    }
  ]

  const withAuthor = (instance, index = 0) => {
    const person = authorAt(index)
    return { ...instance, author: person.name, authorAvatar: person.avatar }
  }

  const SEED = {
    application: [
      {
        id: 'fi-auth',
        name: 'auth-guard',
        functionId: '4021884',
        args: '{}',
        active: true,
        modifiedAt: daysAgo(6)
      },
      {
        id: 'fi-img',
        name: 'img-resize',
        functionId: '4021885',
        args: '{ "quality": 80 }',
        active: false,
        modifiedAt: daysAgo(23)
      }
    ],
    firewall: [
      {
        id: 'fi-bot',
        name: 'bot-score',
        functionId: '4021891',
        args: '{ "blockAbove": 70 }',
        active: true,
        modifiedAt: daysAgo(4)
      },
      {
        id: 'fi-logs',
        name: 'waf-logs',
        functionId: '4021888',
        args: '{ "endpoint": "https://logs.example.com/ingest" }',
        active: true,
        modifiedAt: daysAgo(31)
      }
    ]
  }

  const instances = ref((SEED[props.environment] ?? SEED.application).map(withAuthor))

  const rows = computed(() =>
    instances.value.map((instance) => {
      const fn = functionById(instance.functionId)
      return {
        ...instance,
        edgeFunction: fn?.name ?? 'Deleted function',
        functionExists: !!fn,
        runtime: fn?.runtime ?? '',
        runtimeIcon: fn?.runtimeIcon ?? '',
        status: instance.active ? 'Active' : 'Inactive',
        lastModified: formatListDate(instance.modifiedAt)
      }
    })
  )

  const functionOptions = computed(() => functionOptionsFor(props.environment))
  const functionLabel = (value) =>
    functionOptions.value.find((option) => option.value === value)?.label ?? ''

  const EMPTY_ARGS = '{}'

  const seedArgs = (functionId) => {
    const fn = functionById(functionId)
    if (!fn) return
    form.args = JSON.stringify(fn.args ?? {}, null, 2)
    errors.args = ''
  }

  const prettyArgs = (args) => {
    try {
      return JSON.stringify(JSON.parse(args ?? EMPTY_ARGS), null, 2)
    } catch {
      return args ?? EMPTY_ARGS
    }
  }

  const createOpen = ref(false)
  const editing = ref(null)
  const argsSchema = computed(() => {
    const fn = functionById(form.functionId)
    return fn?.form ? JSON.stringify(fn.form, null, 2) : ''
  })
  const hasArgsForm = computed(() => argsSchema.value.trim().length > 0)
  const argsFields = ref(null)

  const form = reactive({ name: '', functionId: '', args: EMPTY_ARGS })
  const errors = reactive({ name: '', functionId: '', args: '' })
  const submitted = ref(false)
  const submitting = ref(false)

  const functionSelectOpen = ref(false)

  const CREATE_FUNCTION = '__create-function__'
  const onFunctionModel = (value) => {
    if (value === CREATE_FUNCTION) {
      goCreateFunction()
      return
    }
    form.functionId = value
    errors.functionId = ''
    seedArgs(value)
  }

  const openCreate = () => {
    editing.value = null
    createOpen.value = true
  }

  const openInstance = (event, row) => {
    editing.value = row
    form.name = row.name
    form.functionId = row.functionId
    form.args = prettyArgs(row.args)
    submitted.value = false
    errors.name = ''
    errors.functionId = ''
    errors.args = ''
    createOpen.value = true
  }

  watch(createOpen, (open) => {
    if (open) return
    editing.value = null
    form.name = ''
    form.functionId = ''
    form.args = EMPTY_ARGS
    submitted.value = false
    errors.name = ''
    errors.functionId = ''
    errors.args = ''
  })

  const parsedArgs = () => {
    try {
      const value = JSON.parse(form.args)
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    errors.functionId = form.functionId ? '' : 'Select a function.'
    submitted.value = true
    errors.args = parsedArgs() ? '' : 'Arguments must be a JSON object.'
    const unanswered = hasArgsForm.value ? (argsFields.value?.unanswered?.length ?? 0) : 0
    return !errors.name && !errors.functionId && !errors.args && unanswered === 0
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await sleep(900)
      const name = form.name.trim()

      const modifiedAt = new Date()
      const previous = editing.value

      if (previous) {
        instances.value = instances.value.map((instance) =>
          instance.id === previous.id
            ? withAuthor({
                ...instance,
                name,
                functionId: form.functionId,
                args: JSON.stringify(parsedArgs()),
                modifiedAt
              })
            : instance
        )

        if (previous.functionId !== form.functionId) {
          countInstance(previous.functionId, -1)
          countInstance(form.functionId)
        }

        toast.success(`Functions Instance "${name}" saved.`)
      } else {
        instances.value = [
          withAuthor({
            id: `fi-${modifiedAt.getTime()}`,
            name,
            functionId: form.functionId,
            args: JSON.stringify(parsedArgs()),
            active: true,
            modifiedAt
          }),
          ...instances.value
        ]

        countInstance(form.functionId)

        toast.success(`Functions Instance "${name}" created.`)
      }

      createOpen.value = false
    } catch (error) {
      toast.error(
        editing.value
          ? 'Could not save the functions instance.'
          : 'Could not create the functions instance.',
        {
          description: error?.message ?? 'Check your connection and try again.',
          action: { label: 'Retry', onClick: () => submit() }
        }
      )
    } finally {
      submitting.value = false
    }
  }

  const filterFields = [
    {
      id: 'edgeFunction',
      label: 'Function',
      kind: 'options',
      get options() {
        return [...new Set(rows.value.map((instance) => instance.edgeFunction))]
          .sort((a, b) => a.localeCompare(b))
          .map((fn) => ({ value: fn, label: fn }))
      },
      match: (instance, values) => values.includes(instance.edgeFunction)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      match: (instance, values) => values.includes(instance.status)
    }
  ]

  const {
    filters,
    search,
    visibleRows: visibleInstances,
    loading,
    refresh
  } = useListFilters(filterFields, rows)

  const tableRef = ref(null)

  const columnVisibility = ref({ id: false })

  const route = useRoute()
  const router = useRouter()

  const email = computed(() => route.query.email || undefined)
  const functionPath = (row) => `/functions/${row.functionId}`

  const DRAFT_KEY = 'webkit-sample:function-instance-draft'
  const RESUME = 'function-instance'

  const readDraft = () => {
    try {
      const raw = globalThis.sessionStorage?.getItem(DRAFT_KEY)
      const draft = raw ? JSON.parse(raw) : null
      return draft?.path === route.path ? draft : null
    } catch {
      return null
    }
  }

  const clearDraft = () => {
    try {
      globalThis.sessionStorage?.removeItem(DRAFT_KEY)
    } catch {}
  }

  const goCreateFunction = () => {
    functionSelectOpen.value = false
    try {
      globalThis.sessionStorage?.setItem(
        DRAFT_KEY,
        JSON.stringify({
          path: route.path,
          editingId: editing.value?.id ?? '',
          name: form.name,
          functionId: form.functionId,
          args: form.args
        })
      )
    } catch {}

    const returnTo = router.resolve({
      path: route.path,
      query: { ...route.query, resume: RESUME }
    }).fullPath

    router.push({
      path: '/functions/new',
      query: { email: email.value, returnTo, returnLabel: 'Functions Instances' }
    })
  }

  onMounted(() => {
    if (route.query.resume !== RESUME) return clearDraft()

    const draft = readDraft()
    const createdId = route.query.created ? String(route.query.created) : ''

    editing.value = draft?.editingId
      ? (instances.value.find((instance) => instance.id === draft.editingId) ?? null)
      : null
    form.name = draft?.name ?? ''
    form.functionId = createdId || draft?.functionId || ''
    form.args = draft?.args ?? EMPTY_ARGS
    errors.name = ''
    errors.functionId = ''
    errors.args = ''
    if (createdId) seedArgs(createdId)
    createOpen.value = true

    clearDraft()
    const query = { ...route.query }
    delete query.resume
    delete query.created
    router.replace({ path: route.path, query })
  })
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Functions Instances"
      :description="`Edge functions instantiated on this ${subject.noun}.`"
      size="small"
      :documentation="HELP"
    >
      <template #actions>
        <HeadingAction
          label="Add Functions Instance"
          kind="outlined"
          icon="pi pi-plus"
          @click="openCreate"
        />
      </template>
    </PageHeading>

    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <ControlsHeader>
          <FilterButton
            v-model="filters"
            :fields="filterFields"
          />
          <InputText
            v-model="search"
            size="medium"
            placeholder="Search functions instances"
            aria-label="Search functions instances"
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
              filename="function-instances.csv"
            />
            <ColumnsButton
              v-model="columnVisibility"
              :columns="columns"
            />
          </template>
        </ControlsHeader>

        <FilterChips
          v-model="filters"
          :fields="filterFields"
        />

        <CardBox :padded="false">
          <template #content>
            <TableRoot
              ref="tableRef"
              v-model:globalFilter="search"
              v-model:columnVisibility="columnVisibility"
              :data="visibleInstances"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
              :loading="loading"
              @row-click="openInstance"
            >
              <template #cell-name="{ value }">
                <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
              </template>

              <template #cell-id="{ value }">
                <IdCell
                  :value="value"
                  resource="functions instance"
                />
              </template>

              <template #cell-edgeFunction="{ row }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <Tooltip
                    v-if="row.runtimeIcon"
                    :text="row.runtime"
                  >
                    <i
                      :class="[row.runtimeIcon, 'shrink-0 text-body-lg']"
                      :aria-label="row.runtime"
                      role="img"
                    />
                  </Tooltip>
                  <ResourceLink
                    v-if="row.functionExists"
                    :label="row.edgeFunction"
                    :to="{ path: functionPath(row), query: { email } }"
                    module="Functions"
                  />
                  <span
                    v-else
                    class="truncate text-body-sm text-(--text-muted)"
                    >{{ row.edgeFunction }}</span
                  >
                </div>
              </template>

              <template #cell-status="{ value }">
                <Tag
                  :label="value"
                  :severity="value === 'Active' ? 'success' : 'secondary'"
                  size="medium"
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
      :title="editing ? 'Edit Functions Instance' : 'Add Functions Instance'"
      :submitting="submitting"
      @submit="submit"
    >
      <Section
        stacked
        :divided="false"
        title="General"
        :hint="`Instantiates a function from the Functions module on this ${subject.noun}, run by a rule in Rules Engine.`"
      >
        <FieldStack
          label="Name"
          description="One function can be instantiated more than once with different arguments, so the name is what tells them apart in the rules that call them."
          :message="errors.name"
          :message-kind="form.name.trim() ? 'invalid' : 'required'"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              :disabled="submitting"
              class="w-full"
              :placeholder="`My ${subject.noun} function instance`"
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
        title="Function"
        hint="Select an existing function and customize the arguments it runs with."
      >
        <FieldStack
          label="Edge Function"
          :description="`Only functions written for the ${subject.noun} environment are listed. If the one you need does not exist yet, the selector's footer opens the function editor and brings you back here with it selected.`"
          :message="errors.functionId"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <Select
              v-model:open="functionSelectOpen"
              :model-value="form.functionId"
              size="large"
              :disabled="submitting"
              class="w-full"
              placeholder="Select a function"
              :required="!!errors.functionId"
              :display-value="functionLabel"
              @update:model-value="onFunctionModel"
            >
              <Select.Trigger
                :id="controlId"
                aria-label="Edge Function"
                :aria-describedby="describedBy"
              />
              <Select.Content class="z-[1002]!">
                <Select.Option
                  v-for="fn in functionOptions"
                  :key="fn.value"
                  :value="fn.value"
                >
                  {{ fn.label }}
                </Select.Option>
                <template #footer>
                  <Select.Option
                    :value="CREATE_FUNCTION"
                    icon="pi pi-plus-circle"
                    class="w-full"
                  >
                    Create Function
                  </Select.Option>
                </template>
              </Select.Content>
            </Select>
          </template>
        </FieldStack>

        <FunctionArgsFields
          v-if="hasArgsForm"
          ref="argsFields"
          v-model:args="form.args"
          :schema="argsSchema"
          :disabled="submitting"
          :submitted="submitted"
          test-id="function-instance-args"
        />

        <MonacoEditor
          v-else
          v-model="form.args"
          label="Arguments"
          language="json"
          path="function-instance.args.json"
          height="12rem"
          size="small"
          :disabled="submitting"
          :invalid="!!errors.args"
          :helper-text="errors.args || 'Read in the function as event.args(\'arg_name\').'"
          aria-label="Arguments"
          class="w-full"
          @update:model-value="errors.args = ''"
        />
      </Section>
    </ResourceDrawer>
  </div>
</template>
