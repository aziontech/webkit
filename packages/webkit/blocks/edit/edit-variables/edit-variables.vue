<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Drawer from '@aziontech/webkit/drawer-root'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import PageHeader from '@aziontech/webkit/page-header'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, ref, watch } from 'vue'

  import { provideVariablesForm, useVariablesForm } from './composables/use-variables-form'
  import {
    cloneKey,
    insertAfter,
    touched,
    updateRow,
    type VariablesRow,
    withType
  } from './lib/variables-rows'
  import { createScopes, scopesFor } from './lib/variables-scope'
  import VariablesDrawerForm from './parts/variables-drawer-form.vue'
  import VariablesEntries from './parts/variables-entries.vue'
  import VariablesList from './parts/variables-list.vue'
  import VariablesScopeGroup from './parts/variables-scope-group.vue'
  import { sampleVariables } from './sample'

  /** Where a variable applies: the whole account, or one environment, project, service or policy. */
  export interface VariablesScope {
    /** global, environment, project, service or policy. */
    type: string
    /** The resource ID; empty for global. */
    id: string
    /** The resource name shown in the Scope column; empty for global. */
    name: string
  }

  /** One saved variable, a row of the table. */
  export interface VariablesVariable {
    /** Stable key, shown in the hidden ID column. */
    id: string
    /** The variable name, uppercase letters, numbers and underscores. */
    key: string
    /** The value; a secret's value is shown masked. */
    value: string
    /** Whether the value is hidden and write-only. */
    secret: boolean
    /** Where the variable applies. */
    scope: VariablesScope[]
    /** Who changed it last. */
    lastEditor: string
    /** That person's avatar URL; empty shows the initials. */
    lastEditorAvatar: string
    /** When it changed last: a Date or an ISO 8601 string. */
    lastModified: Date | string
  }

  /** One pair the drawer saves, with the scope chosen for every pair. */
  export interface VariablesDraft {
    /** The variable name. */
    key: string
    /** The value; empty when an edited secret keeps its saved value. */
    value: string
    /** Whether the value is a secret. */
    secret: boolean
    /** Where the variable applies. */
    scope: VariablesScope[]
  }

  /** What Save sends. */
  export interface VariablesSavePayload {
    /** The variable being edited, or null when the drawer creates new ones. */
    variable: VariablesVariable | null
    /** The pairs in the drawer. */
    values: VariablesDraft[]
  }

  export interface VariablesProps {
    /** The variables to list; filtered, sorted and paged in the browser. Left out, the sample renders. */
    variables?: VariablesVariable[]
    /** The list is loading or refreshing: Refresh spins and the table shows its loading state. */
    loading?: boolean
    /** The save is in flight: the drawer locks and Save spins; when it ends with no saveError the drawer closes. */
    saving?: boolean
    /** Why the save failed, shown in the danger alert at the top of the drawer; the pairs are kept. */
    saveError?: string
    /** The create drawer starts open. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<VariablesProps>(), {
    variables: undefined,
    loading: false,
    saving: false,
    saveError: '',
    defaultOpen: false
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    save: [event: Event, payload: VariablesSavePayload]
    clone: [event: Event, variable: VariablesVariable]
    delete: [event: Event, variable: VariablesVariable]
  }>()

  const source = computed<VariablesVariable[]>(
    () => props.variables ?? (props.loading ? [] : sampleVariables)
  )
  const rows = ref<VariablesRow[]>([])
  watch(
    source,
    (next) => {
      rows.value = next.map(withType)
    },
    { immediate: true }
  )
  const editing = ref<VariablesRow | null>(null)
  const existingKeys = computed(() =>
    rows.value
      .filter((variable) => variable.id !== editing.value?.id)
      .map((variable) => variable.key)
  )

  const refresh = (event: MouseEvent) => {
    if (props.loading) return
    emit('refresh', event)
  }

  let nextVariableId = rows.value.length
  const newVariableId = () => `v-${String((nextVariableId += 1)).padStart(3, '0')}`

  const drawerOpen = ref(props.defaultOpen)
  const openCreate = () => {
    editing.value = null
    drawerOpen.value = true
  }

  const pending = ref<VariablesRow | null>(null)
  const deleteOpen = ref(false)
  const confirmDelete = (event: Event) => {
    if (!pending.value) return
    const key = pending.value.key
    emit('delete', event, pending.value)
    rows.value = rows.value.filter((variable) => variable.id !== pending.value?.id)
    deleteOpen.value = false
    toast.success(`${key} deleted.`)
  }

  const cloneRow = (event: Event, row: VariablesRow) => {
    const copy = touched({ ...row, id: newVariableId(), key: cloneKey(rows.value, row.key) })
    emit('clone', event, row)
    rows.value = insertAfter(rows.value, row.id, copy)
    toast.success(`${row.key} cloned as ${copy.key}.`)
  }

  const onRowAction = (event: Event, value: DropdownMenuItemValue, row: VariablesRow) => {
    if (value === 'edit') {
      editing.value = row
      drawerOpen.value = true
    } else if (value === 'duplicate') {
      cloneRow(event, row)
    } else if (value === 'delete') {
      pending.value = row
      deleteOpen.value = true
    }
  }

  const form = useVariablesForm({
    existingKeys,
    lockedSecret: () => Boolean(editing.value?.secret)
  })
  provideVariablesForm(form)

  const submitting = computed(() => props.saving)
  const saveError = ref(props.defaultOpen ? props.saveError : '')
  const pendingSave = ref<VariablesSavePayload | null>(null)

  const drawerTitle = computed(() => (editing.value ? 'Edit variable' : 'Create variable'))
  const drawerDescription = computed(() => {
    if (!editing.value) return 'Create one or more variables and define where they are available.'
    if (editing.value.secret) return 'Leave the value empty to keep the saved secret.'
    return 'Change the key, value or scope of this variable.'
  })

  watch(drawerOpen, (isOpen) => {
    if (!isOpen) return
    const current = editing.value
    form.reset(
      current
        ? [form.createEntry(current.key, current.secret ? '' : current.value, current.secret)]
        : [form.createEntry()],
      current ? scopesFor(current.scope) : createScopes()
    )
    pendingSave.value = null
    saveError.value = ''
  })

  const finishSave = ({ variable, values }: VariablesSavePayload) => {
    if (variable) {
      rows.value = updateRow(rows.value, variable.id, values)
      toast.success(`${values[0].key} updated.`)
    } else {
      rows.value = [
        ...values.map((value) => touched({ ...value, id: newVariableId() })),
        ...rows.value
      ]
      toast.success(
        values.length === 1 ? `${values[0].key} created.` : `${values.length} variables created.`
      )
    }
    editing.value = null
    drawerOpen.value = false
  }

  watch(
    () => props.saveError,
    (message) => {
      if (drawerOpen.value) saveError.value = message
    }
  )

  watch(
    () => props.saving,
    (now, was) => {
      const payload = pendingSave.value
      if (!was || now || !payload) return
      pendingSave.value = null
      if (props.saveError) {
        saveError.value = props.saveError
        return
      }
      finishSave(payload)
    }
  )

  const submit = async (event: Event, formEl: HTMLFormElement | null) => {
    if (submitting.value || !(await form.check(formEl))) return
    saveError.value = ''
    const payload: VariablesSavePayload = { variable: editing.value, values: form.drafts() }
    emit('save', event, payload)
    await nextTick()
    if (props.saving) {
      pendingSave.value = payload
      return
    }
    if (props.saveError) {
      saveError.value = props.saveError
      return
    }
    finishSave(payload)
  }
</script>

<template>
  <div class="layout-column layout-boundary flex flex-col">
    <PageHeader
      title="Variables"
      description="Configure variable names, values, and settings for use across your projects."
    >
      <template #actions>
        <Button
          label="Documentation"
          aria-label="Documentation (opens in a new tab)"
          icon="az az-book"
          variant="outline"
          href="https://example.com/docs/variables"
          target="_blank"
          size="medium"
        />
        <Button
          label="Create variable"
          icon="az az-plus"
          variant="primary"
          size="medium"
          @click="openCreate"
        />
      </template>
    </PageHeader>

    <VariablesList
      :rows="rows"
      :loading="loading"
      @refresh="refresh"
      @create="openCreate"
      @row-action="onRowAction"
    />

    <Drawer
      v-model:open="drawerOpen"
      size="large"
      side="end"
    >
      <VariablesDrawerForm
        :title="drawerTitle"
        :description="drawerDescription"
        shortcut-label="Save variable"
        :active="drawerOpen"
        :submitting="submitting"
        :save-error="saveError"
        @submit="submit"
      >
        <VariablesEntries
          :editing="!!editing"
          :secret-locked="Boolean(editing?.secret)"
        />
        <VariablesScopeGroup />
      </VariablesDrawerForm>
    </Drawer>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete variable"
      size="medium"
      confirm-label="Delete variable"
      :confirmation-phrase="pending?.key ?? ''"
      @confirm="confirmDelete"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          The selected variable will be deleted, and services in its scope stop reading it on their
          next deployment.
        </p>
      </div>
    </ConfirmDialog>
  </div>
</template>
