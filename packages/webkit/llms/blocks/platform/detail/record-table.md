# RecordTable (`platform/detail/record-table`)

> A DNS zone detail page, opened from its index: a full-bleed tab bar with Main settings and Records over a scrolling tab panel. Main settings is a settings form in the form column: four stacked sections (General, Configure your nameserver, DNSSEC, Status), each an anchored heading with a hint glyph over a flush `Card` of `ItemList` rows. Name and Domain Name are required `Input`s that show a required `HelperText` only after a failed save; the three nameservers and, while DNSSEC is on, the key tag, algorithm, digest type and digest are read-only code `Input`s in an `InputGroupRoot` with a transparent `CopyButton`; DNSSEC and Active are `Switch`es; editing anything raises the save bar at the bottom. Records is a small-heading list inside the tab (Documentation and Add Record actions) with the TableView controls row (Type and Policy filters) and a records table: the value cell pins a copy button, Weight and Description fall back to an em dash, and the row menu carries Edit and Delete. Built from `PageHeader`, `PageTabs`, `SettingsSection`, `SettingRow`, `SaveBar`, `Tabs`, `Card`, `ItemList`, `Input`, `InputGroupRoot`, `CopyButton`, `Switch`, `HelperText`, `Button` and the TableView controls row and table recipes.

- Surface: product
- Source: `blocks/platform/detail/record-table/record-table.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/detail/record-table")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Badge](../../../components/badge.md), [Button](../../../components/button.md), `CalendarRoot`, [Card](../../../components/card.md), [Chip](../../../components/chip.md), [CopyButton](../../../components/copy-button.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, `DropdownMenuGroup`, `DropdownMenuOption`, [Field](../../../components/field.md), [FileDropzone](../../../components/file-dropzone.md), [HelperText](../../../components/helper-text.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), `InputGroupRoot`, `ItemList`, [PageHeader](../../../components/page-header.md), [PageTabs](../../../components/page-tabs.md), `PanelContent`, `PanelFooter`, `PanelHeader`, `PopoverContent`, `PopoverRoot`, `PopoverTrigger`, [SaveBar](../../../components/save-bar.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [Switch](../../../components/switch.md), [Table](../../../components/table.md), `TableRoot`, [Tabs](../../../components/tabs.md), [Tag](../../../components/tag.md), [Textarea](../../../components/textarea.md), [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-tables`, `webkit-form`, `webkit-navigation`

## Asked as

dns zone; dns records; record table; zone detail; nameservers; dnssec; records list; zona dns; registros dns; tabela de registros; import zone file; zone file; bind import; import dns records; importar arquivo de zona; importar registros dns

The detail page of a resource that owns a long list of records, here a DNS zone. The user arrives from the zones index to do one of two jobs: adjust the zone itself (name, nameservers, DNSSEC, status) and save, or find, add, edit and delete the records the zone answers with. A tab bar splits the two jobs so the settings form and the records table never share a scroll.

## When to use

- A resource has its own settings and also owns many child records that need search, filters, sorting and paging (DNS records, firewall entries, list items).
- Users copy values out of the resource into another system (nameservers, DNSSEC digests) and need a copy control next to each value.
- Child records are added from inside the resource, so the action reads `Add <Module>`.

## When not to use

- The child list is short and needs no search or filters: use `platform/detail/attached-resources` inside a settings section.
- A first-level list reached from the sidebar: use `platform/view/table-view`.
- A resource whose detail page is an overview with several tabs and no dominant record list: use `platform/detail/details-page`.
- Settings only, with no child records: use `platform/edit/edit-resource`.

## Building blocks

### A. Tab bar — `PageTabs`, `Tabs` (required)

A full-bleed `PageTabs` with one `Tabs.Item` per tab, Main settings first and Records second. Each tab panel scrolls on its own under the bar. See `skills/webkit-navigation`.

### B. Settings sections — `SettingsSection`, `Card`, `ItemList`, `SettingRow`, `Input`, `HelperText` (required)

Main settings is a form in the form column with four `SettingsSection` bands: General, Configure your nameserver, DNSSEC and Status. Each band wraps a flush `Card :padded="false"` around an `ItemList` of `SettingRow`s, each with a title and a one-sentence description. Name and Domain Name are large `Input`s; their required `HelperText` appears only after Save is pressed with them empty and clears as soon as the user types. See `skills/webkit-form`.

### C. Copyable values — `InputGroupRoot`, `Input`, `CopyButton` (required)

Values the user copies elsewhere (the three nameservers, and the key tag, algorithm, digest type and digest) are read-only large `Input`s inside an `InputGroupRoot` that ends with a transparent `CopyButton`. A helper line under the nameservers says where to paste them.

### D. Toggles — `Switch` (required)

Enable DNSSEC and Active are compact `SettingRow`s whose control is a `Switch`. The DNSSEC key rows appear only while DNSSEC is on.

### E. Save bar — `SaveBar`, `Button` (required)

A docked `SaveBar` slides up at the bottom of the form on the first edit, with the unsaved-changes label, an outlined Discard and a primary Save, both medium. While saving, the fieldset is disabled, Save shows its loading state and Discard is disabled. The bar leaves when Save lands or Discard restores the record.

### F. Records heading — `PageHeader`, `Button` (required)

The Records tab opens with a small `PageHeader` titled Records with a one-sentence description, and two outlined medium actions: Documentation and Add Record. Inside a resource no action is primary and the create verb is Add.

### G. Filter popover — `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `Button`, `Badge`, `IconButton`, `CalendarRoot`, `Input`, `Avatar` (optional)

The outlined Filter `Button` opens one popover with the Type and Policy fields; a `Badge` on the trigger counts applied fields. Filters narrow `:data` and rewind pagination to the first page. It is the same recipe as `platform/view/table-view`.

### H. Toolbar and columns — `Input`, `Tooltip`, `IconButton`, `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `Field`, `Switch`, `Button` (optional)

A medium search `Input` bound to `v-model:globalFilter`, then outlined `IconButton`s for Refresh, Download CSV and Columns, each named by a `Tooltip`. The Columns popover holds one `Switch` per hideable column and a Show all columns `Button`. ID is hidden by default; Name cannot be hidden.

### I. Applied filters — `Chip`, `Avatar` (optional)

One wrapping row of filled medium `Chip`s, one per applied field, in field order. Each chip reopens its field and can be removed.

### J. Records table — `Card`, `TableRoot`, `Table.CellId`, `Table.CellLink`, `Table.CellActions`, `Tag` (required)

`Card :padded="false"` around `TableRoot :bordered="false"` with `row-key="id"`, sorting, `paginated` at 8 rows and `:loading`. Name is `principal`. Type is a secondary `Tag`. ID is `Table.CellId` ("Copy record ID") and Value is `Table.CellLink` with `copyable`, so their copy buttons stay pinned at the cell end while the text truncates; row actions are `Table.CellActions` named after the record. Weight and Description show a dash glyph when empty.

### K. Row actions — `Table.CellActions`, `DropdownMenuGroup`, `DropdownMenuOption` (required)

`Table.CellActions`, named after the record ("Actions for www"), opens a menu placed `bottom-end` with Edit in the first group and Delete alone in the last.

## Do

- Keep settings and records on separate tabs, each with its own scroll.
- Show required errors only after a failed save, and clear each one when its field changes.
- Make every copyable value read-only and pair it with a `CopyButton` whose label names the value.
- Raise the save bar only when something changed, and keep it until Save lands or Discard restores the record.
- Reuse the table view controls row and table recipe in the Records tab so filters, search and columns behave the same as on index pages.
- Rewind pagination to the first page when filters or search change.

## Don't

- Don't put a primary or large Create button in the Records heading; it is `Add Record`, outlined.
- Don't validate on first render or on blur; the form is quiet until Save.
- Don't make nameservers or digests editable text the user could change by accident.
- Don't save Main settings from a button inside each section; one save bar covers the whole form.
- Don't let the records table scroll the page sideways.

## Copy

- **Tabs:** short nouns, e.g. "Main settings", "Records".
- **Section titles:** a noun or a short instruction, e.g. "General", "Configure your nameserver".
- **Row descriptions:** one sentence that ends with a period, e.g. "Give a unique and descriptive name to identify your zone."
- **Required error:** "This field is required."
- **Save bar:** the label states the fact, e.g. "You have unsaved changes."; buttons "Discard" and "Save".
- **Records heading:** title "Records", description one sentence, e.g. "The authoritative records this zone answers with."; actions "Documentation" and "Add Record".
- **Copy buttons:** name the value, e.g. "Copy nameserver 1", "Copy record value".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The form is labeled "Zone settings" and its fieldset has a visually hidden legend with the same words.
- Each `Input` has an `aria-label` matching its row title; an `Input` with an error points to its `HelperText` through `aria-describedby`.
- Every icon-only control has an `aria-label` and a `Tooltip` with the same words; decorative icons carry `aria-hidden="true"`, and so does the filter `Badge`.
- Search has an `aria-label` that matches its placeholder, "Search records".
- Focus order follows reading order: tabs, form fields, save bar; or heading actions, Filter, search, toolbar, chips, table, pagination.
- Tab panel entrances respect reduced motion.

## States

- MainSettings: the Main settings tab with General, nameservers, DNSSEC and Status; the save bar appears on the first edit.
- Records: the Records tab with the zone's one A record, the ID column hidden by default.
- ImportZoneFile: Import zone file, beside Add Record, opens a large `Drawer`. The file comes from a `FileDropzone` (one `.zone`, `.txt` or `.db` file; a rejected or empty file shows an invalid `HelperText` under it) or is pasted into a `Textarea`. Every line is previewed in a `TableRoot`: line number, name relative to the origin, type, value and a Ready, Skipped or Error `Tag`, with the reason under the value. The counts sit in a polite status line, errors add a danger `Alert` above the preview, and Import N records (disabled at zero) adds only the ready lines, then a toast says how many were imported and how many lines were left out.

## Importing a zone file

- Parse on the client as the text changes and preview every line before anything is written; never import on drop.
- Name the line number on every row, so the user can fix the file.
- Skip with a reason what the zone manages itself (SOA, apex NS) and types it does not support; mark as errors only values that are wrong.
- Import what is ready even when some lines fail, and say in the toast how many were left out.

## Related

- `platform/view/table-view` — the index this page is opened from, and the source of the controls row recipe.
- `platform/edit/edit-resource` — the settings form and save bar pattern used by Main settings.
- `platform/detail/attached-resources` — a short related list inside a settings section.
- `platform/delete/delete-with-confirmation` — the dialog behind the row menu's Delete.
- `SaveBar` — the unsaved-changes band; see `skills/webkit-form`.

## Variants

- `MainSettings` — primary (the code below)
- `Records` — The Records tab with the zone’s one A record, the ID column hidden by default.
- `ImportZoneFile` — The Records tab with Import zone file open: a large `Drawer` that takes one BIND zone file from a `FileDropzone` (or Browse files) or pasted into a `Textarea`, parses it as it changes ($ORIGIN, $TTL with units, inherited names, quoted TXT) and previews every line in a `TableRoot` with its line number, name, type, value and a Ready, Skipped or Error `Tag`, the reason under the value. A polite status line counts ready, skipped and errors; errors raise a danger `Alert` saying the ready records still import. The SOA, the apex NS and unsupported types are skipped with their reason; a bad address or a missing value is an error. Import N records adds the ready ones to the table and reports through a toast that counts what was left out.

Each variant is the same screen in another state: `get_pattern("platform/detail/record-table", { variant })`, or the file under `blocks/platform/detail/record-table/variants/`.

## Code (`MainSettings`)

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import CalendarRoot from '@aziontech/webkit/calendar-root'
  import Card from '@aziontech/webkit/card'
  import Chip from '@aziontech/webkit/chip'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import ItemList from '@aziontech/webkit/item-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

  const activeTab = ref('main-settings')

  const zone = { name: 'main-zone', domain: 'example.com' }

  const tabs = [
    { value: 'main-settings', label: 'Main settings' },
    { value: 'records', label: 'Records' }
  ]

  const nameservers = ['ns1.example.net', 'ns2.example.com', 'ns3.example.org']

  const dnssecKeys = [
    {
      label: 'Key tag',
      value: '34505',
      description:
        'Unique identifier for the DNSSEC key used to sign your zone. Use this value with your domain provider.'
    },
    {
      label: 'Algorithm',
      value: '13 (ECDSA Curve P-256 with SHA-256)',
      description: 'Specifies the algorithm used to generate the DNSSEC key.'
    },
    {
      label: 'Digest type',
      value: '2 (SHA-256)',
      description: 'Indicates the hash function used for the DNSSEC digest.'
    },
    {
      label: 'Digest',
      value: '8A9E1F2C3B4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F',
      description:
        'Cryptographic hash of the public key for DNSSEC validation. Provide this to your provider.'
    }
  ]

  const errors = reactive({ name: '', domain: '' })
  const settings = reactive({ name: zone.name, domain: zone.domain, dnssec: true, active: true })
  const saving = ref(false)
  const baseline = ref(JSON.stringify(settings))
  const dirty = computed(() => JSON.stringify(settings) !== baseline.value)
  const nameMessageId = useId()
  const domainMessageId = useId()
  const nameserverMessageId = useId()

  const validate = () => {
    errors.name = settings.name.trim() ? '' : 'This field is required.'
    errors.domain = settings.domain.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.domain
  }

  const save = () => {
    if (saving.value || !validate()) return
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(settings)
      saving.value = false
    }, 900)
  }

  const discard = () => {
    Object.assign(settings, JSON.parse(baseline.value))
    errors.name = ''
    errors.domain = ''
  }

  const POLICY_TYPES = [
    { value: 'simple', label: 'Simple' },
    { value: 'weighted', label: 'Weighted' }
  ]

  const policyLabel = (value) => POLICY_TYPES.find((policy) => policy.value === value)?.label ?? ''

  const filterFields = [
    {
      id: 'type',
      label: 'Type',
      kind: 'options',
      options: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'].map((value) => ({ value, label: value })),
      match: (record, values) => values.includes(record.type)
    },
    {
      id: 'policy',
      label: 'Policy',
      kind: 'options',
      options: POLICY_TYPES,
      match: (record, values) => values.includes(record.policy)
    }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', enableSorting: true, minWidth: 80 },
    { accessorKey: 'type', header: 'Type', enableSorting: true, minWidth: 104 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'ttl', header: 'TTL (seconds)', enableSorting: true, minWidth: 80 },
    { accessorKey: 'policy', header: 'Policy', minWidth: 80 },
    { accessorKey: 'weight', header: 'Weight', minWidth: 80 },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const rows = [
    {
      id: '423916',
      name: 'www',
      type: 'A',
      value: '192.0.2.1',
      ttl: 3600,
      policy: 'simple',
      weight: 255,
      description: 'Points www at the origin server.'
    }
  ]

  const search = ref('')

  const filters = ref({})
  const filterOpen = ref(false)
  const activeId = ref(null)
  const customId = ref(null)
  const calendarOpen = ref(false)
  const customRange = ref(null)
  const query = ref('')
  const direction = ref('forward')
  const filterPanel = ref(null)
  let requestedId = null

  const isApplied = (field) => Boolean(filters.value[field.id]?.length)
  const appliedFilters = computed(() => filterFields.filter(isApplied))
  const appliedCount = computed(() => appliedFilters.value.length)
  const summarize = (field) => {
    const values = filters.value[field.id] ?? []
    if (!values.length) return null
    const first = field.options.find((option) => option.value === values[0])
    return { label: first ? first.label : field.formatValue(values[0]), extra: values.length - 1 }
  }
  const summarizeText = (field) => {
    const parts = summarize(field)
    if (!parts) return ''
    return parts.extra ? `${parts.label} +${parts.extra}` : parts.label
  }
  const avatarsOf = (field) =>
    field.options
      .filter(
        (option) => 'avatar' in option && (filters.value[field.id] ?? []).includes(option.value)
      )
      .slice(0, 3)

  const customField = computed(() => filterFields.find((field) => field.id === customId.value))
  const activeField = computed(
    () => filterFields.find((field) => field.id === activeId.value) ?? customField.value
  )
  const levelKey = computed(() => {
    if (customId.value) return `custom:${customId.value}`
    return activeId.value ? `values:${activeId.value}` : 'fields'
  })
  const filterRows = computed(() => {
    const term = query.value.trim().toLowerCase()
    const source = activeField.value ? activeField.value.options : filterFields
    return term ? source.filter((row) => row.label.toLowerCase().includes(term)) : source
  })
  const isPicked = (value) => (filters.value[activeId.value] ?? []).includes(value)

  watch(filterOpen, (open) => {
    if (!open) return
    activeId.value = requestedId
    requestedId = null
    customId.value = null
    calendarOpen.value = false
    customRange.value = null
    query.value = ''
    direction.value = 'forward'
  })

  const toLevel = (dir, mutate) => {
    direction.value = dir
    mutate()
  }
  const enter = (fieldId) => {
    if (!filterOpen.value) {
      requestedId = fieldId
      filterOpen.value = true
      return
    }
    toLevel('forward', () => {
      activeId.value = fieldId
      query.value = ''
    })
  }
  const back = () =>
    toLevel('back', () => {
      activeId.value = null
      query.value = ''
    })
  const pick = (field, option) => {
    if (option.custom) {
      toLevel('forward', () => {
        customId.value = field.id
      })
      calendarOpen.value = true
      return
    }
    const current = filters.value[field.id] ?? []
    const next =
      field.kind === 'range'
        ? current[0] === option.value
          ? []
          : [option.value]
        : current.includes(option.value)
          ? current.filter((item) => item !== option.value)
          : [...current, option.value]
    filters.value = { ...filters.value, [field.id]: next }
    if (field.kind === 'range') back()
  }
  const leaveCustom = () => {
    calendarOpen.value = false
    customRange.value = null
    toLevel('back', () => {
      customId.value = null
    })
  }
  const commitCustom = (range) => {
    const field = customField.value
    if (!field) return
    const next = { ...filters.value }
    if (range?.start || range?.end) next[field.id] = [range]
    else delete next[field.id]
    filters.value = next
    leaveCustom()
    back()
    filterOpen.value = false
  }
  const clearFilter = (field) => {
    const next = { ...filters.value }
    delete next[field.id]
    filters.value = next
  }
  const levelRows = () => [
    ...(filterPanel.value?.querySelectorAll(`[data-level="${levelKey.value}"] [data-filter-row]`) ??
      [])
  ]
  const move = (event, step) => {
    const items = levelRows()
    if (!items.length) return
    event.preventDefault()
    const index = items.indexOf(event.target)
    items[(index + step + items.length) % items.length]?.focus()
  }
  watch(levelKey, async () => {
    await nextTick()
    levelRows()[0]?.focus()
  })

  const loading = ref(false)
  let refreshTimer
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const listedColumns = columns
    .filter((column) => column.kind !== 'action')
    .map((column) => ({
      id: column.id ?? column.accessorKey,
      label: column.label ?? column.header,
      locked: column.hideable === false
    }))
  const columnsOpen = ref(false)
  const columnsTipOpen = ref(false)
  watch(columnsOpen, (open) => {
    if (open) columnsTipOpen.value = false
  })
  const columnVisibility = ref({ id: false })
  const isVisible = (id) => columnVisibility.value[id] !== false
  const setVisible = (id, visible) => {
    const next = { ...columnVisibility.value }
    if (visible) delete next[id]
    else next[id] = false
    columnVisibility.value = next
  }
  const hiddenCount = computed(() => listedColumns.filter((column) => !isVisible(column.id)).length)
  const showAll = () => {
    columnVisibility.value = {}
  }

  const tableRef = ref(null)
  const pagination = ref({ pageIndex: 0, pageSize: 8 })
  const visibleRows = computed(() =>
    rows.filter((row) =>
      filterFields.every((field) => {
        const values = filters.value[field.id]
        return !values?.length || field.match(row, values)
      })
    )
  )
  watch(filters, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <main class="flex h-full min-h-0 flex-col">
      <PageTabs v-model="activeTab">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>

      <section
        v-if="activeTab === 'main-settings'"
        class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col overflow-auto"
      >
        <form
          class="flex min-h-full min-w-0 flex-col"
          aria-label="Zone settings"
          novalidate
          @submit.prevent="save"
        >
          <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
              <fieldset
                class="m-0 flex min-w-0 flex-col border-0 p-0"
                :disabled="saving"
              >
                <legend class="sr-only">Zone settings</legend>
                <SettingsSection
                  title="General"
                  hint="How this zone is identified across the platform."
                  anchor="general"
                >
                  <Card :padded="false">
                    <template #content>
                      <ItemList>
                        <SettingRow
                          title="Name"
                          description="Give a unique and descriptive name to identify your zone."
                        >
                          <Input
                            v-model="settings.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            autocomplete="off"
                            :required="!!errors.name"
                            :aria-describedby="errors.name ? nameMessageId : undefined"
                            :disabled="saving"
                            @update:model-value="errors.name = ''"
                          />
                          <HelperText
                            v-if="errors.name"
                            :id="nameMessageId"
                            kind="required"
                            :label="errors.name"
                          />
                        </SettingRow>

                        <SettingRow
                          title="Domain name"
                          description="Provide the domain name you want to host. Example: example.com."
                        >
                          <Input
                            v-model="settings.domain"
                            size="large"
                            class="w-full"
                            aria-label="Domain name"
                            autocomplete="off"
                            :required="!!errors.domain"
                            :aria-describedby="errors.domain ? domainMessageId : undefined"
                            :disabled="saving"
                            @update:model-value="errors.domain = ''"
                          />
                          <HelperText
                            v-if="errors.domain"
                            :id="domainMessageId"
                            kind="required"
                            :label="errors.domain"
                          />
                        </SettingRow>
                      </ItemList>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="Configure your nameserver"
                  hint="Make this zone the authoritative DNS for the domain."
                  anchor="configure-your-nameserver"
                >
                  <Card :padded="false">
                    <template #content>
                      <ItemList>
                        <SettingRow
                          title="Nameservers"
                          description="Make this zone the authoritative DNS for the domain by copying the nameserver values."
                        >
                          <div class="flex w-full flex-col gap-(--spacing-xs)">
                            <InputGroupRoot
                              v-for="(ns, index) in nameservers"
                              :key="ns"
                            >
                              <div class="flex flex-1 font-code">
                                <Input
                                  :model-value="ns"
                                  size="large"
                                  class="w-full"
                                  :aria-label="'Nameserver ' + (index + 1)"
                                  readonly
                                />
                              </div>
                              <CopyButton
                                kind="transparent"
                                :value="ns"
                                :aria-label="'Copy nameserver ' + (index + 1)"
                              />
                            </InputGroupRoot>
                          </div>
                          <HelperText
                            :id="nameserverMessageId"
                            kind="helper"
                            label="Add the nameservers in your domain provider."
                          />
                        </SettingRow>
                      </ItemList>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="DNSSEC"
                  hint="Signs the zone so resolvers can detect spoofed answers."
                  anchor="dnssec"
                >
                  <Card :padded="false">
                    <template #content>
                      <ItemList>
                        <SettingRow
                          title="Enable DNSSEC"
                          description="Enable DNSSEC to secure your DNS zone against cache poisoning and spoofing attacks. Configure the key tag and digest values in your domain provider to complete the setup."
                          kind="compact"
                        >
                          <Switch
                            v-model="settings.dnssec"
                            aria-label="Enable DNSSEC"
                            :disabled="saving"
                          />
                        </SettingRow>

                        <template v-if="settings.dnssec">
                          <SettingRow
                            v-for="key in dnssecKeys"
                            :key="key.label"
                            :title="key.label"
                            :description="key.description"
                          >
                            <InputGroupRoot class="w-full">
                              <div class="flex flex-1 font-code">
                                <Input
                                  :model-value="key.value"
                                  size="large"
                                  class="w-full"
                                  :aria-label="key.label"
                                  readonly
                                />
                              </div>
                              <CopyButton
                                kind="transparent"
                                :value="key.value"
                                :aria-label="'Copy ' + key.label"
                              />
                            </InputGroupRoot>
                          </SettingRow>
                        </template>
                      </ItemList>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="Status"
                  hint="A zone can be held inactive while its records are being built."
                  anchor="status"
                >
                  <Card :padded="false">
                    <template #content>
                      <ItemList>
                        <SettingRow
                          title="Active"
                          description="When active, the zone answers authoritative DNS queries for the domain."
                          kind="compact"
                        >
                          <Switch
                            v-model="settings.active"
                            aria-label="Active"
                            :disabled="saving"
                          />
                        </SettingRow>
                      </ItemList>
                    </template>
                  </Card>
                </SettingsSection>
              </fieldset>
            </section>
          </div>
          <Transition
            enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
            enter-from-class="translate-y-2 opacity-0"
            leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
            leave-to-class="translate-y-2 opacity-0"
          >
            <SaveBar
              v-if="dirty || saving"
              kind="docked"
            >
              You have unsaved changes.

              <template #actions>
                <Button
                  type="button"
                  label="Discard"
                  kind="outlined"
                  size="medium"
                  :disabled="saving"
                  @click="discard"
                />
                <Button
                  type="submit"
                  label="Save"
                  kind="primary"
                  size="medium"
                  :loading="saving"
                />
              </template>
            </SaveBar>
          </Transition>
        </form>
      </section>

      <section
        v-else
        class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto"
      >
        <div class="layout-column layout-boundary flex min-w-0 flex-col">
          <PageHeader
            title="Records"
            description="The authoritative records this zone answers with."
            size="small"
          >
            <template #actions>
              <Button
                label="Documentation"
                icon="pi pi-book"
                kind="outlined"
                size="medium"
                href="https://example.com/docs/records"
                target="_blank"
              />
              <Button
                label="Add Record"
                icon="pi pi-plus"
                kind="outlined"
                size="medium"
              />
            </template>
          </PageHeader>
          <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
            <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex items-center gap-(--layout-group-gap)">
                <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
                  <div class="flex shrink-0 items-center">
                    <PopoverRoot
                      v-model:open="filterOpen"
                      placement="bottom-start"
                      :dismissible="!calendarOpen"
                      class="shrink-0"
                    >
                      <div class="relative">
                        <PopoverTrigger>
                          <Button
                            label="Filter"
                            kind="outlined"
                            size="medium"
                            icon="pi pi-filter"
                          />
                          <Transition
                            enter-from-class="scale-75 opacity-0"
                            enter-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
                            leave-to-class="scale-75 opacity-0"
                            leave-active-class="transition-[transform,scale,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                          >
                            <div
                              v-if="appliedCount"
                              class="pointer-events-none absolute -top-2 -end-2 min-w-5"
                            >
                              <Badge
                                :label="String(appliedCount)"
                                severity="primary"
                                size="small"
                                aria-hidden="true"
                                class="w-full"
                              />
                            </div>
                          </Transition>
                        </PopoverTrigger>
                      </div>
                      <PopoverContent>
                        <div
                          ref="filterPanel"
                          class="flex flex-col"
                          @keydown.down="move($event, 1)"
                          @keydown.up="move($event, -1)"
                        >
                          <div class="relative overflow-hidden">
                            <Transition
                              :enter-from-class="
                                direction === 'forward'
                                  ? 'translate-x-[12%] opacity-0'
                                  : 'translate-x-[-12%] opacity-0'
                              "
                              enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                              :leave-to-class="
                                direction === 'forward'
                                  ? 'translate-x-[-12%] opacity-0'
                                  : 'translate-x-[12%] opacity-0'
                              "
                              leave-active-class="absolute inset-x-0 top-0 transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                            >
                              <div
                                :key="levelKey"
                                :data-level="levelKey"
                                class="flex flex-col"
                              >
                                <div
                                  v-if="activeField"
                                  class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-xs) py-(--spacing-xs)"
                                >
                                  <IconButton
                                    icon="pi pi-angle-left"
                                    kind="outlined"
                                    size="small"
                                    :aria-label="
                                      customField ? 'Back to date periods' : 'Back to all filters'
                                    "
                                    @click="customField ? leaveCustom() : back()"
                                  />
                                  <span class="truncate text-label-sm text-(--text-default)">{{
                                    activeField.label
                                  }}</span>
                                </div>

                                <div
                                  v-if="customField"
                                  class="px-(--spacing-md) py-(--spacing-sm)"
                                >
                                  <CalendarRoot
                                    v-model="customRange"
                                    v-model:open="calendarOpen"
                                    mode="range"
                                    size="medium"
                                    :show-fields="false"
                                    placeholder="Select a range"
                                    class="w-full"
                                    @update:model-value="commitCustom"
                                  />
                                </div>

                                <template v-else>
                                  <div class="border-b border-(--border-default) p-(--spacing-xs)">
                                    <Input
                                      v-model="query"
                                      size="medium"
                                      class="w-full"
                                      :placeholder="
                                        activeField
                                          ? 'Search ' + activeField.label.toLowerCase()
                                          : 'Search fields'
                                      "
                                      :aria-label="
                                        activeField
                                          ? 'Search ' + activeField.label + ' values'
                                          : 'Search filter fields'
                                      "
                                    >
                                      <template #iconLeft>
                                        <i
                                          class="pi pi-search"
                                          aria-hidden="true"
                                        />
                                      </template>
                                    </Input>
                                  </div>

                                  <div
                                    class="flex max-h-(--container-3xs) flex-col gap-(--spacing-xxs) overflow-y-auto p-(--spacing-xxs)"
                                  >
                                    <template v-if="!activeField">
                                      <button
                                        v-for="field in filterRows"
                                        :key="field.id"
                                        type="button"
                                        data-filter-row
                                        class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                        :aria-expanded="false"
                                        @click="enter(field.id)"
                                      >
                                        <span class="grow truncate">{{ field.label }}</span>
                                        <span
                                          v-if="isApplied(field)"
                                          class="truncate text-(--text-muted)"
                                          >{{ summarizeText(field) }}</span
                                        >
                                        <i
                                          class="pi pi-angle-right shrink-0 text-(--text-muted)"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </template>

                                    <template v-else>
                                      <button
                                        v-for="option in filterRows"
                                        :key="String(option.value)"
                                        type="button"
                                        data-filter-row
                                        :role="
                                          option.custom
                                            ? undefined
                                            : activeField.kind === 'range'
                                              ? 'menuitemradio'
                                              : 'menuitemcheckbox'
                                        "
                                        :aria-checked="
                                          option.custom ? undefined : isPicked(option.value)
                                        "
                                        class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                        @click="pick(activeField, option)"
                                      >
                                        <Avatar
                                          v-if="'avatar' in option"
                                          :src="option.avatar || undefined"
                                          :alt="option.label"
                                          :label="option.label"
                                          size="small"
                                          kind="square"
                                          class="shrink-0"
                                        />
                                        <span class="grow truncate">{{ option.label }}</span>
                                        <i
                                          v-if="option.custom"
                                          class="pi pi-angle-right shrink-0 text-(--text-muted)"
                                          aria-hidden="true"
                                        />
                                        <i
                                          v-else
                                          class="pi pi-check shrink-0 text-(--text-default)"
                                          :class="isPicked(option.value) ? '' : 'invisible'"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </template>

                                    <p
                                      v-if="!filterRows.length"
                                      class="px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)"
                                    >
                                      No match for “{{ query }}”.
                                    </p>
                                  </div>

                                  <div
                                    v-if="activeField && isApplied(activeField)"
                                    class="border-t border-(--border-default) p-(--spacing-xxs)"
                                  >
                                    <button
                                      type="button"
                                      class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                      @click="clearFilter(activeField)"
                                    >
                                      <i
                                        class="pi pi-filter-slash text-(--text-muted)"
                                        aria-hidden="true"
                                      />
                                      Clear {{ activeField.label }}
                                    </button>
                                  </div>
                                </template>
                              </div>
                            </Transition>
                          </div>
                        </div>
                      </PopoverContent>
                    </PopoverRoot>
                  </div>
                  <div class="flex min-w-36 grow basis-(--container-2xs)">
                    <Input
                      v-model="search"
                      size="medium"
                      placeholder="Search records"
                      aria-label="Search records"
                      class="w-full"
                    >
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </div>
                </div>
                <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                  <Tooltip
                    text="Refresh"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="pi pi-refresh"
                      kind="outlined"
                      size="medium"
                      :loading="loading"
                      aria-label="Refresh"
                      @click="refresh"
                    />
                  </Tooltip>
                  <Tooltip
                    text="Download CSV"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="pi pi-download"
                      kind="outlined"
                      size="medium"
                      :disabled="!tableRef"
                      aria-label="Download CSV"
                      @click="tableRef?.exportCsv({ filename: 'records.csv' })"
                    />
                  </Tooltip>
                  <PopoverRoot
                    v-model:open="columnsOpen"
                    placement="bottom-end"
                    class="shrink-0"
                  >
                    <PopoverTrigger>
                      <Tooltip
                        v-model:open="columnsTipOpen"
                        text="Columns"
                        :disabled="columnsOpen"
                      >
                        <IconButton
                          icon="ai ai-column"
                          kind="outlined"
                          size="medium"
                          aria-label="Columns"
                        />
                      </Tooltip>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div class="flex flex-col">
                        <div
                          class="border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)"
                        >
                          <p class="text-label-md text-(--text-default)">Columns</p>
                        </div>
                        <div
                          class="flex max-h-(--container-xs) flex-col gap-(--spacing-xxs) overflow-y-auto overscroll-contain p-(--spacing-xxs)"
                        >
                          <div
                            v-for="column in listedColumns"
                            :key="column.id"
                            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
                            :class="
                              column.locked
                                ? 'cursor-default'
                                : 'cursor-pointer hover:bg-(--bg-hover)'
                            "
                          >
                            <Field
                              orientation="horizontal"
                              :disabled="column.locked"
                            >
                              <Switch
                                :model-value="isVisible(column.id)"
                                @update:model-value="(value) => setVisible(column.id, !!value)"
                              />
                              <Field.Label>
                                <span class="min-w-0 truncate">{{ column.label }}</span>
                              </Field.Label>
                              <span
                                v-if="column.locked"
                                class="shrink-0 text-label-xs text-(--text-muted)"
                                >Always shown</span
                              >
                            </Field>
                          </div>
                        </div>
                        <div
                          v-if="hiddenCount"
                          class="border-t border-(--border-default) p-(--spacing-xxs)"
                        >
                          <Button
                            label="Show all columns"
                            kind="transparent"
                            size="small"
                            class="w-full"
                            @click="showAll"
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </PopoverRoot>
                </div>
              </header>
              <div
                v-if="appliedFilters.length"
                class="relative flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
              >
                <TransitionGroup
                  move-class="transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                  enter-from-class="scale-90 opacity-0"
                  leave-from-class="scale-100 opacity-100"
                  leave-to-class="scale-90 opacity-0"
                  leave-active-class="pointer-events-none absolute duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                >
                  <span
                    v-for="field in appliedFilters"
                    :key="field.id"
                    class="inline-flex w-fit max-w-full transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                  >
                    <Chip
                      :data-filter-chip="field.id"
                      :label="field.label"
                      kind="filled"
                      size="medium"
                      clickable
                      removable
                      @click="enter(field.id)"
                      @remove="clearFilter(field)"
                    >
                      <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                        <span class="truncate text-(--text-muted)">{{ field.label }}</span>
                        <span
                          v-if="avatarsOf(field).length"
                          class="flex shrink-0 items-center -space-x-1"
                        >
                          <Avatar
                            v-for="option in avatarsOf(field)"
                            :key="String(option.value)"
                            :src="option.avatar || undefined"
                            :alt="option.label"
                            :label="option.label"
                            size="small"
                            kind="circle"
                          />
                        </span>
                        <span class="truncate">{{ summarize(field)?.label }}</span>
                        <span
                          v-if="summarize(field)?.extra"
                          class="shrink-0 text-(--text-muted)"
                          >+{{ summarize(field).extra }}</span
                        >
                      </span>
                    </Chip>
                  </span>
                </TransitionGroup>
              </div>
              <Card :padded="false">
                <template #content>
                  <TableRoot
                    ref="tableRef"
                    v-model:pagination="pagination"
                    v-model:globalFilter="search"
                    v-model:columnVisibility="columnVisibility"
                    :data="visibleRows"
                    :columns="columns"
                    row-key="id"
                    enable-sorting
                    paginated
                    :page-size="8"
                    :bordered="false"
                    :loading="loading"
                  >
                    <template #cell-name="{ value }">
                      <span class="min-w-0 truncate">{{ value }}</span>
                    </template>
                    <template #cell-id="{ value }">
                      <Table.CellId
                        :value="value"
                        resource="record"
                      />
                    </template>
                    <template #cell-type="{ value }">
                      <Tag
                        :label="value"
                        severity="secondary"
                        size="medium"
                      />
                    </template>
                    <template #cell-value="{ value }">
                      <Table.CellLink
                        :label="value"
                        copyable
                        @click.stop
                      />
                    </template>
                    <template #cell-policy="{ value }">
                      <span class="min-w-0 truncate">{{ policyLabel(value) }}</span>
                    </template>
                    <template #cell-weight="{ value }">
                      <span class="min-w-0 truncate">{{ value ?? '—' }}</span>
                    </template>
                    <template #cell-description="{ value }">
                      <span class="min-w-0 truncate">{{ value || '—' }}</span>
                    </template>
                    <template #cell-actions="{ row }">
                      <Table.CellActions :name="row.name">
                        <DropdownMenuGroup>
                          <DropdownMenuOption
                            value="edit"
                            label="Edit"
                          >
                            <template #left
                              ><i
                                class="pi pi-pencil"
                                aria-hidden="true"
                            /></template>
                          </DropdownMenuOption>
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                          <DropdownMenuOption
                            value="delete"
                            label="Delete"
                          >
                            <template #left
                              ><i
                                class="pi pi-trash"
                                aria-hidden="true"
                            /></template>
                          </DropdownMenuOption>
                        </DropdownMenuGroup>
                      </Table.CellActions>
                    </template>
                  </TableRoot>
                </template>
              </Card>
            </section>
          </section>
        </div>
      </section>
    </main>
  </div>
</template>
```
