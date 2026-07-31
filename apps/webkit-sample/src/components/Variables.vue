<script setup>
  // The Variables module — the Azion Console "Variables" list. Unlike Applications
  // (whose create flow is a dedicated PAGE), Variables creates inline: the "Create
  // Variable" button opens a Drawer built the way the Create Rule drawer is — the body
  // is a stack of SECTIONS, each a section title over a CardBox, spaced at the section
  // step with the title sitting a group step above its card.
  //
  // Accessibility follows the `/form` skill, FIELDS SEPARATED (Approach B) inside those
  // sections: each field is a triad — a real `<Label for>` (always carrying the required
  // tag, so it advertises the field from first render), the control, and the field's own
  // helper row. The helper row IS the guidance row: on a failed submit it swaps to the
  // message and the field reveals its state — amber `required` for an empty field
  // (required is NOT an error), red `invalid` for a filled-but-malformed value, never
  // both. The `field-*` wrappers own that wiring (`for` ↔ `input-id`,
  // `aria-describedby`, `aria-required` / `aria-invalid`), which is why the fields are
  // FieldText / FieldSwitch and not loose inputs. Validation runs on submit only and
  // clears as the user edits; there is no error-summary block and no Message callout.
  // The scope is one native `<form novalidate @submit.prevent>` (Enter submits via the
  // sr-only submit); one `submitting` flag locks the whole scope (fieldset :disabled +
  // Save :loading). Only a request-level failure toasts (with Retry) — never silent.
  //
  // Narrowing follows the module-list pattern: the COLUMNS decide the fields, and they
  // live in a FILTER POPOVER behind one IconButton (ui/FilterPopover.vue) that LEADS the
  // controls row, to the LEFT of the search — every enumerable column gets a multiple
  // Select (Authors, Type) and the date column gets a plain date picker (Calendar,
  // `mode="range"`), while the free-text columns (Key, Value) are covered by the search
  // field instead of one field each. They pre-filter `:data`; the search narrows what is
  // left, through the table's own global filter. This replaces the generic
  // field/operator/value builder that sat in the table's own toolbar: `Table.Filter` /
  // `Table.AppliedFilters` read the table's filter state through `inject`, so they could
  // never be hoisted out of the card — and `lastEditor` is not a column at all (it
  // renders inside the Last Modified cell), so the table's own filter state could not
  // have hosted that field either.
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Calendar from '@aziontech/webkit/calendar'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Dropdown from '@aziontech/webkit/dropdown'
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import FieldText from '@aziontech/webkit/field-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { daysAgo, formatListDate, withinRange } from '../lib/dates'
  import { filterDisplay } from '../lib/filters'
  import { authorAt } from '../lib/people'
  import { useTenancyReload } from '../lib/tenancy-reload'
  import { tenancyRows } from '../lib/tenancy-scope'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import FilterPopover from './ui/FilterPopover.vue'
  import LastModifiedCell from './ui/LastModifiedCell.vue'

  const route = useRoute()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')
  const editorName = computed(() => userEmail.value.split('@')[0])

  // --- The records that back the table (data-driven mode) -------------------
  // `modifiedAt` is the real instant — the Last Modified filter compares it, the cell
  // renders it relative, and `lastModified` (the sortable / exportable display string)
  // is derived from it by one formatter instead of being hand-written per row
  // (src/lib/dates.js explains why a display string is never parsed back).
  const variables = ref(
    [
      {
        id: 'v-001',
        key: 'API_BASE_URL',
        value: 'https://api.example.com',
        secret: false,
        modifiedAt: daysAgo(32)
      },
      {
        id: 'v-002',
        key: 'STRIPE_SECRET_KEY',
        value: 'sk_live_51H8sX2eZv...',
        secret: true,
        modifiedAt: daysAgo(48)
      },
      {
        id: 'v-003',
        key: 'FEATURE_FLAGS',
        value: 'checkout_v2,dark_mode',
        secret: false,
        modifiedAt: daysAgo(61)
      },
      {
        id: 'v-004',
        key: 'DATABASE_PASSWORD',
        value: 'p4ssw0rd-r0t4t3d',
        secret: true,
        modifiedAt: daysAgo(73)
      },
      {
        id: 'v-005',
        key: 'MAX_UPLOAD_MB',
        value: '25',
        secret: false,
        modifiedAt: daysAgo(99)
      }
    ].map((variable, index) => {
      const person = authorAt(index)
      return {
        ...variable,
        lastEditor: person.name,
        lastEditorAvatar: person.avatar,
        lastModified: formatListDate(variable.modifiedAt)
      }
    })
  )

  // Switching organization, account or workspace reloads the module: skeletons while
  // the new scope's variables arrive (src/lib/tenancy-reload.js). A variable belongs
  // to the scope it was set in, so the seed is projected through the one in force; a
  // variable created in this session is the operator's own and always shows
  // (src/lib/tenancy-scope.js).
  const { tenancyReloading } = useTenancyReload()
  const scopedVariables = computed(() => tenancyRows(variables.value, 'variables'))

  // Column model. `key` is the principal (emphasized) column; the trailing
  // `actions` column (kind: 'action') auto-pins to the right edge.
  const columns = [
    { accessorKey: 'key', header: 'Key', enableSorting: true, principal: true },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'secret', header: 'Type', enableSorting: true },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── Column selectors ──────────────────────────────────────────────────────
  // Authors come from the data, so the selector can never offer someone with no
  // rows in the list. (The column is "Last Modified"; the person renders inside that
  // cell as `lastEditor`.) Each option carries that person's photo, so the filter
  // identifies them the way the cell does — by face first, name second.
  const authorOptions = computed(() =>
    [
      ...new Map(
        variables.value.map((variable) => [variable.lastEditor, variable.lastEditorAvatar])
      )
    ]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([author, avatar]) => ({ value: author, label: author, avatar }))
  )

  // The roster is long enough that scanning it beats reading it: the panel gets its
  // own search field (Select.Content's `#search` slot), narrowing the options by
  // name. Cleared on close so the panel never reopens pre-filtered.
  const authorQuery = ref('')
  const authorOpen = ref(false)
  watch(authorOpen, (open) => {
    if (!open) authorQuery.value = ''
  })
  const visibleAuthorOptions = computed(() => {
    const query = authorQuery.value.trim().toLowerCase()
    if (!query) return authorOptions.value
    return authorOptions.value.filter((option) => option.label.toLowerCase().includes(query))
  })

  // The Type column is a boolean in the record and a Tag in the cell; the selector
  // speaks the words the cell shows, not `true` / `false`.
  const typeOptions = [
    { value: 'variable', label: 'Variable' },
    { value: 'secret', label: 'Secret' }
  ]

  // Free-text search. The field lives in the page's ControlsHeader, above the card, so it
  // is a plain InputText bound to the table's `v-model:globalFilter` — the context-aware
  // `Table.Search` only works inside `<Table>`. The table still owns the matching
  // (every visible column, TanStack's global filter).
  const search = ref('')
  const authorFilter = ref([])
  const typeFilter = ref([])
  const modifiedRange = ref(null)

  // The badge on the filter trigger counts FIELDS that are narrowing the list, not
  // selected values — two authors is still one filter on Authors. The search is not
  // counted: it stays visible in the row, so it is never a hidden filter.
  const activeFilterCount = computed(
    () =>
      Number(authorFilter.value.length > 0) +
      Number(typeFilter.value.length > 0) +
      Number(Boolean(modifiedRange.value))
  )

  // "Clear all" resets the fields the panel renders, and only those — the search sits
  // outside it.
  const clearFilters = () => {
    authorFilter.value = []
    typeFilter.value = []
    modifiedRange.value = null
  }

  // The panel's fields pre-filter `:data`; the search field narrows what is left,
  // through the table's own global filter.
  const filteredVariables = computed(() =>
    scopedVariables.value.filter((variable) => {
      if (authorFilter.value.length && !authorFilter.value.includes(variable.lastEditor))
        return false
      if (
        typeFilter.value.length &&
        !typeFilter.value.includes(variable.secret ? 'secret' : 'variable')
      )
        return false
      return withinRange(variable.modifiedAt, modifiedRange.value)
    })
  )

  // External `:data` filtering does not trip TanStack's `autoResetPageIndex`, so own
  // the pagination state and rewind to the first page when a filter changes — or when
  // a tenancy-scope switch narrows the list the same way.
  const pagination = ref({ pageIndex: 0, pageSize: 10 })
  watch([authorFilter, typeFilter, modifiedRange, tenancyReloading], () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  // Secret values are masked in the list — never render a stored secret in plain
  // text once saved (mirrors the console).
  const displayValue = (row) => (row.secret ? '••••••••••••' : row.value)

  // --- Create Drawer state -------------------------------------------------
  const drawerOpen = ref(false)

  const form = reactive({
    key: '',
    value: '',
    secret: false
  })

  // Per-field error messages. Empty string = valid.
  const errors = reactive({
    key: '',
    value: ''
  })

  // One flag locks the whole drawer scope while the request is in flight.
  const submitting = ref(false)

  // Opening the drawer starts from a clean slate.
  const openCreate = () => {
    drawerOpen.value = true
  }

  // Reset the form + errors whenever the drawer closes (cancel, overlay, Escape,
  // or a successful create) so the next open is pristine.
  watch(drawerOpen, (open) => {
    if (open) return
    form.key = ''
    form.value = ''
    form.secret = false
    errors.key = ''
    errors.value = ''
  })

  // Keys accept only upper-case letters, numbers, and underscore.
  const KEY_PATTERN = /^[A-Z0-9_]+$/

  const validate = () => {
    const key = form.key.trim()
    if (!key) errors.key = 'Key is required.'
    else if (!KEY_PATTERN.test(key))
      errors.key = 'Use upper-case letters, numbers, and underscore only.'
    else errors.key = ''

    errors.value = form.value.trim() ? '' : 'Value is required.'

    return !errors.key && !errors.value
  }

  const cancel = () => {
    drawerOpen.value = false
  }

  const submit = async () => {
    if (submitting.value) return // re-entrancy lock

    // Validation feedback is now on the fields themselves (required + :invalid).
    if (!validate()) return

    // Lock the scope off one flag: Save shows :loading and every field is
    // :disabled while the create request is in flight.
    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      // Same shape as a seeded row: the instant is the record, the display string is
      // derived from it — so the new row sorts and filters like every other one.
      const modifiedAt = new Date()
      variables.value = [
        {
          id: `v-${Date.now()}`,
          key: form.key.trim(),
          value: form.value,
          secret: form.secret,
          lastEditor: editorName.value,
          lastEditorAvatar: '',
          modifiedAt,
          lastModified: formatListDate(modifiedAt)
        },
        ...variables.value
      ]
      toast.success(`Variable "${form.key.trim()}" created.`)
      drawerOpen.value = false // watch() resets the form
    } catch (error) {
      // Request-level failure → toast with a way to recover. Never silent.
      toast.error('Could not create the variable.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }

  const onRowAction = (event, value, row) => {
    if (value === 'delete') {
      variables.value = variables.value.filter((item) => item.id !== row.id)
      toast.success(`${row.key} deleted`)
      return
    }
    const copy = {
      edit: `Editing ${row.key}`,
      duplicate: `Duplicating ${row.key}`
    }
    toast.info(copy[value] ?? row.key, { description: `Variable ${row.id}` })
  }
</script>

<template>
  <AppLayout
    active="variables"
    :breadcrumb="[{ label: 'Variables' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <!-- The page's parent section. A module list opens straight on it (no
           PageHeading — the module name is the breadcrumb crumb), so the
           `:first-child` rule zeroes its step and the boundary is its top space. -->
      <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
        <!-- ONE section: the controls row narrows the table under it, so the two
             sit at --layout-group-gap. -->
        <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
          <!-- First-level module list: no PageHeading — the module name already IS the
               header breadcrumb crumb (AppLayout). The page opens with its CONTROLS row
               — the filter, then the search, the module's own actions on the right — and
               the table follows. -->
          <ControlsHeader v-if="scopedVariables.length">
            <!-- The column selectors, collapsed behind one icon (ui/FilterPopover.vue) —
                 the same filter the other module lists carry, leading the row to the LEFT
                 of the search. They apply as they are picked; the badge on the trigger
                 reports how many are set. -->
            <FilterPopover
              :count="activeFilterCount"
              description="Narrow variables by author, when they last changed, or type."
              @clear="clearFilters"
            >
              <Select
                v-model="authorFilter"
                v-model:open="authorOpen"
                multiple
                size="large"
                placeholder="All Authors"
                :display-value="filterDisplay('All Authors', authorOptions)"
              >
                <Select.Trigger aria-label="Filter by author" />
                <Select.Content>
                  <!-- `#search` renders above the scrolling list, so the field stays put
                       while the options move. `@keydown.stop` keeps the panel's
                       Arrow/Home/End handler from pulling focus onto an option while the
                       user is still typing. -->
                  <template #search>
                    <InputText
                      v-model="authorQuery"
                      size="large"
                      class="w-full"
                      placeholder="Search authors..."
                      aria-label="Search authors"
                      @keydown.stop
                    >
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
                          aria-hidden="true"
                        />
                      </template>
                    </InputText>
                  </template>
                  <Select.Option
                    v-for="option in visibleAuthorOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    <template #left>
                      <Avatar
                        :src="option.avatar || undefined"
                        :alt="option.label"
                        :label="option.label"
                        size="small"
                        kind="square"
                      />
                    </template>
                    {{ option.label }}
                  </Select.Option>
                  <!-- A search that matches nothing must say so; an empty panel reads as
                       a broken filter. -->
                  <p
                    v-if="!visibleAuthorOptions.length"
                    class="px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-body-sm text-[var(--text-muted)]"
                  >
                    No author matches “{{ authorQuery }}”.
                  </p>
                </Select.Content>
              </Select>

              <!-- Last Modified is a plain DATE PICKER: one field, one panel, a month
                   grid. No `:presets`, no `period`. `:show-fields="false"` drops the
                   Start/End text inputs, which restate what the grid already says; the
                   width classes stretch Calendar's fixed `--container-3xs` trigger to the
                   panel, so it lines up with the Selects above and below it. -->
              <Calendar
                v-model="modifiedRange"
                mode="range"
                size="large"
                clearable
                :show-fields="false"
                placeholder="Last Modified"
                class="w-full [&>span]:w-full [&>span>span]:w-full"
              />

              <Select
                v-model="typeFilter"
                multiple
                size="large"
                placeholder="All Types"
                :display-value="filterDisplay('All Types', typeOptions)"
              >
                <Select.Trigger aria-label="Filter by type" />
                <Select.Content>
                  <Select.Option
                    v-for="option in typeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </FilterPopover>

            <!-- Search drives the table's global filter from outside the card, so the
                 field is a plain InputText (`Table.Search` is context-aware and only works
                 inside `<Table>`). With the selectors collapsed into the filter popover
                 beside it, the field keeps the whole row. -->
            <InputText
              v-model="search"
              size="large"
              placeholder="Search variables..."
              aria-label="Search variables"
              class="min-w-36 grow basis-[var(--container-2xs)]"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>

            <template #actions>
              <Button
                label="Create Variable"
                kind="primary"
                size="large"
                icon="pi pi-plus"
                @click="openCreate"
              />
            </template>
          </ControlsHeader>

          <!-- Variables table -->
          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <Table
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  :data="filteredVariables"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="10"
                  :border="false"
                  :loading="tenancyReloading"
                >
                  <!-- A key and a value are data, not code: both keep the cell's own type
                       and --text-default, so a row reads at one weight across its columns
                       (Applications.vue's list is the reference). -->
                  <template #cell-key="{ value }">
                    <span class="min-w-0 truncate">{{ value }}</span>
                  </template>

                  <template #cell-value="{ row }">
                    <div class="flex w-full min-w-0 items-center gap-[var(--spacing-xs)]">
                      <span class="min-w-0 truncate">{{ displayValue(row) }}</span>
                      <CopyButton
                        v-if="!row.secret"
                        kind="outlined"
                        :value="row.value"
                        aria-label="Copy value"
                        class="ml-auto shrink-0"
                      />
                    </div>
                  </template>

                  <template #cell-lastModified="{ value, row }">
                    <LastModifiedCell
                      :author="row.lastEditor"
                      :avatar-src="row.lastEditorAvatar"
                      :date="value"
                    />
                  </template>

                  <template #cell-secret="{ value }">
                    <Tag
                      :label="value ? 'Secret' : 'Variable'"
                      :severity="value ? 'warning' : 'secondary'"
                      size="medium"
                    />
                  </template>

                  <template #cell-actions="{ row }">
                    <Dropdown
                      placement="bottom-end"
                      @select="(event, value) => onRowAction(event, value, row)"
                    >
                      <Dropdown.Trigger>
                        <Tooltip text="Row actions">
                          <IconButton
                            icon="pi pi-ellipsis-h"
                            kind="outlined"
                            size="small"
                            aria-label="Row actions"
                          />
                        </Tooltip>
                      </Dropdown.Trigger>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="edit"
                          label="Edit"
                        >
                          <template #left>
                            <i
                              class="pi pi-pencil"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="duplicate"
                          label="Clone"
                        >
                          <template #left>
                            <i
                              class="pi pi-clone"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
                      </Dropdown.Group>

                      <Dropdown.Group>
                        <Dropdown.Option
                          value="delete"
                          label="Delete"
                        >
                          <template #left>
                            <i
                              class="pi pi-trash"
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
        </section>
      </section>
    </main>

    <!-- Create flow — a Drawer whose body is SECTIONS (the Create Rule drawer's
         anatomy: a section title over a CardBox, sections spaced at the section step)
         with FIELDS SEPARATED inside each card (/form Approach B): a Label + control +
         HelperText triad per field, stacked. `medium` (672px) is the measure a single
         column of stacked fields wants — `large` is for the repeater-heavy Create Rule,
         and would stretch three inputs across 1024px. -->
    <Drawer
      v-model:open="drawerOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <!-- One native form owns the scope: Enter submits (via the sr-only
               submit control, since the styled Button can't be type=submit), the
               fieldset locks every field while the request is in flight. -->
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Variable"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                <DrawerTitle>Create Variable</DrawerTitle>
                <p class="text-body-sm text-[var(--text-muted)]">
                  Create environment variables or secrets to use with configured Functions.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <!-- One flag locks the whole scope; the sections sit at the section step
                   inside it, each one title-over-card at the group step. -->
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--layout-section-gap)] border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Create variable</legend>

                <!-- Section: General — the variable itself (Fields separated) -->
                <section class="flex flex-col gap-[var(--layout-group-gap)]">
                  <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                    General
                  </p>
                  <CardBox>
                    <template #content>
                      <!-- Field → field is the LG step; inside a field, Label → control →
                           HelperText is the XS step baked into every `field-*`. -->
                      <div class="flex flex-col gap-[var(--spacing-lg)]">
                        <!-- The Label is rendered here and is ALWAYS `required`, so the
                             tag advertises the field from first render; the wrapper gets
                             no `label` so its own tag can't couple to the post-submit
                             state. The helper row is the GUIDANCE row — on a failed submit
                             it swaps to the message and the field reveals amber `required`
                             (empty) or red `invalid` (malformed). Required is NOT an error,
                             and the two states are never both on. (The old rows carried a
                             `font-code` class here; the theme declares `--font-code`
                             outside `@theme`, so Tailwind generates no such utility and it
                             styled nothing — the field keeps its own type token.) -->
                        <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                          <Label
                            for="variable-key"
                            required
                            >Key</Label
                          >
                          <FieldText
                            v-model="form.key"
                            input-id="variable-key"
                            name="key"
                            size="large"
                            class="w-full"
                            placeholder="VARIABLE_KEY_NAME"
                            :required="!!errors.key && !form.key.trim()"
                            :invalid="!!errors.key && !!form.key.trim()"
                            :helper-text="
                              errors.key ||
                              'Give a name or identifier for the variable. Accepts upper-case letters, numbers, and underscore.'
                            "
                            @update:model-value="errors.key = ''"
                          />
                        </div>

                        <!-- Value is required-only: empty → amber `required`, never red. -->
                        <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                          <Label
                            for="variable-value"
                            required
                            >Value</Label
                          >
                          <FieldText
                            v-model="form.value"
                            input-id="variable-value"
                            name="value"
                            size="large"
                            class="w-full"
                            placeholder="VARIABLE_VALUE"
                            :required="!!errors.value"
                            :helper-text="
                              errors.value || 'Enter the data associated with the variable key.'
                            "
                            @update:model-value="errors.value = ''"
                          />
                        </div>
                      </div>
                    </template>
                  </CardBox>
                </section>

                <!-- Section: Type — what the list's Type column will read (Variable /
                     Secret). A switch is its own complete field (FieldSwitch labels the
                     control and carries the description), so it needs no Label beside it. -->
                <section class="flex flex-col gap-[var(--layout-group-gap)]">
                  <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                    Type
                  </p>
                  <CardBox>
                    <template #content>
                      <FieldSwitch
                        v-model="form.secret"
                        label="Secret"
                        description="Store the value encrypted and masked in the list. Its behavior can't be edited once saved."
                      />
                    </template>
                  </CardBox>
                </section>
              </fieldset>
            </PanelContent>

            <PanelFooter class="flex-col md:flex-row md:justify-end">
              <Button
                class="w-full md:w-auto"
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
                :disabled="submitting"
                @click="cancel"
              />
              <!-- webkit Button hardcodes type="button" and doesn't forward a
                   type, so drive submit from its click; the sr-only submit below
                   gives the form real Enter-to-submit. -->
              <Button
                class="w-full md:w-auto"
                label="Save"
                kind="primary"
                size="medium"
                :loading="submitting"
                @click="submit"
              />
              <button
                type="submit"
                class="sr-only"
                tabindex="-1"
                aria-hidden="true"
              >
                Save
              </button>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </AppLayout>
</template>
