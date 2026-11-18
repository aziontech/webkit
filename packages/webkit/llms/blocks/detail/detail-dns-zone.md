# DetailDnsZone (`detail/detail-dns-zone`)

> A DNS zone detail page, opened from its index: a full-bleed tab bar with Main settings and Records over a scrolling tab panel. Main settings is a settings form in the form column: four stacked sections (General, Configure your nameserver, DNSSEC, Status), each an anchored heading with a hint glyph over a flush `Card` of `ItemList` rows. Name and Domain Name are required `Input`s that show a required `FieldError` only after a failed save; the three nameservers and, while DNSSEC is on, the key tag, algorithm, digest type and digest are read-only code `Input`s in an `InputGroupRoot` with a transparent `CopyButton`; DNSSEC and Active are `Switch`es; editing anything raises the save bar at the bottom. Records is a small-heading list inside the tab (Documentation and Add Record actions) with the TableView controls row (`PropertyFilter` over Name, Type, Policy and Value, Refresh, Download CSV and `CollectionPreferences`, all driven by `useCollection`) and a records table paginated at 10: the value cell pins a copy button, Weight and Description stay blank when they do not apply, the row menu carries Edit and Delete, and the empty slot separates no records (Add Record, Import zone file) from no match (Clear filters). Built from `PageHeader`, `PageTabs`, `SettingsGroup`, `SettingsRow`, `SaveBar`, `Tabs`, `Card`, `ItemList`, `Input`, `InputGroupRoot`, `CopyButton`, `Switch`, `FieldError`, `Button`, `PropertyFilter`, `CollectionPreferences`, `DataTable` and `EmptyState`. A page body for ConsoleLayout.

- Surface: app
- Source: `blocks/detail/detail-dns-zone/detail-dns-zone.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/detail-dns-zone")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [CollectionPreferences](../../components/collection-preferences.md), [CopyButton](../../components/copy-button.md), [DataTable](../../components/data-table.md), `DrawerContent`, `DrawerDescription`, [Drawer](../../components/drawer.md), `DrawerTitle`, `DropdownMenuGroup`, `DropdownMenuItem`, [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), `FieldDescription`, `FieldError`, [FileDropzone](../../components/file-dropzone.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), `InputGroupRoot`, `ItemList`, [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PropertyFilter](../../components/property-filter.md), [SaveBar](../../components/save-bar.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [Switch](../../components/switch.md), `TableCellActions`, `TableCellId`, `TableCellLink`, [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-collection`
- Skills: `webkit-tables`, `webkit-form`, `webkit-navigation`

## Asked as

dns zone; dns records; record table; zone detail; nameservers; dnssec; records list; zona dns; registros dns; tabela de registros; import zone file; zone file; bind import; import dns records; importar arquivo de zona; importar registros dns

The detail page of a resource that owns a long list of records, here a DNS zone. The user arrives from the zones index to do one of two jobs: adjust the zone itself (name, nameservers, DNSSEC, status) and save, or find, add, edit and delete the records the zone answers with. A tab bar splits the two jobs so the settings form and the records table never share a scroll. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header, the ⌘K palette and the `main`.

## When to use

- A resource has its own settings and also owns many child records that need search, filters, sorting and paging (DNS records, firewall entries, list items).
- Users copy values out of the resource into another system (nameservers, DNSSEC digests) and need a copy control next to each value.
- Child records are added from inside the resource, so the action reads `Add <Module>`.

## When not to use

- The child list is short and needs no search or filters: use `detail/detail-domains-card` inside a settings section.
- A first-level list reached from the sidebar: use `view/view-table`.
- A resource whose detail page is an overview with several tabs and no dominant record list: use `detail/detail-resource`.
- Settings only, with no child records: use `edit/edit-resource`.

## Building blocks

### A. Tab bar — `PageTabs`, `Tabs` (required)

A full-bleed `PageTabs` with one `Tabs.Trigger` per tab, Main settings first and Records second, in a `sticky top-0` wrapper on the canvas fill: each tab panel scrolls in the layout's content region under the bar, and only the open tab is mounted. See `skills/webkit-navigation`.

### B. Settings sections — `SettingsGroup`, `Card`, `ItemList`, `SettingsRow`, `Input`, `FieldDescription`, `FieldError` (required)

Main settings is a form in the form column with four `SettingsGroup` bands: General, Configure your nameserver, DNSSEC and Status. Each band wraps a flush `Card :padded="false"` around an `ItemList` of `SettingsRow`s, each with a title and a one-sentence description. Name and Domain Name are large `Input`s; their required `FieldError` appears only after Save is pressed with them empty and clears as soon as the user types. See `skills/webkit-form`.

### C. Copyable values — `InputGroupRoot`, `Input`, `CopyButton` (required)

Values the user copies elsewhere (the three nameservers, and the key tag, algorithm, digest type and digest) are read-only large `monospace` `Input`s inside an `InputGroupRoot` that ends with a transparent `CopyButton`. Their rows set `stackable`, so on a phone a long digest moves under its copy at full width instead of sharing the row. A helper line under the nameservers says where to paste them.

### D. Toggles — `Switch` (required)

Enable DNSSEC and Active are compact `SettingsRow`s whose control is a `Switch`. The DNSSEC key rows appear only while DNSSEC is on.

### E. Save bar — `SaveBar`, `Button` (required)

A docked `SaveBar` slides up at the bottom of the form on the first edit, with the unsaved-changes label, an outlined Discard and a primary Save, both medium. While saving, the fieldset is disabled, Save shows its loading state and Discard is disabled. The bar leaves when Save lands or Discard restores the record.

### F. Records heading — `PageHeader`, `Button` (required)

The Records tab opens with a small `PageHeader` titled Records with a one-sentence description, and two outlined medium actions: Documentation and Add Record. Inside a resource no action is primary and the create verb is Add.

### G. Controls row — `PropertyFilter`, `Tooltip`, `IconButton`, `CollectionPreferences` (required)

One row above the table: a `PropertyFilter` ("Filter records") that takes free text or a property token (Name, Type, Policy, Value), then outlined `IconButton`s for Refresh and Download CSV, each named by a `Tooltip`, and `CollectionPreferences` for page size and visible columns. `useCollection` owns the filter, sort, page and column state: the filter rewinds to the first page, ID is hidden by default and Name cannot be hidden. It is the same recipe as `view/view-table`.

### H. Records table — `Card`, `DataTable`, `TableCellId`, `TableCellLink`, `TableCellActions`, `Tag` (required)

`Card :padded="false"` around `DataTable :bordered="false"` bound to `useCollection`'s `tableProps` (row key, sorting, pages of 10 and the column visibility) and `:loading`. Name is `principal`. Type is a secondary `Tag`. ID is `TableCellId` ("Copy record ID") and Value is `TableCellLink` with `copyable`, so their copy buttons stay pinned at the cell end while the text truncates; row actions are `TableCellActions` named after the record. Weight and Description stay blank when they do not apply; no dash, no "None".

### I. Empty and no-match — `EmptyState`, `Button` (required)

The table's `#empty` slot tells the two cases apart through `useCollection`'s `status`. A filter that matches nothing shows "No matching records" with Clear filters; a zone with no records shows "No records yet" with Add Record and Import zone file.

### J. Row actions — `TableCellActions`, `DropdownMenuGroup`, `DropdownMenuItem` (required)

`TableCellActions`, named after the record ("Actions for www"), opens a menu placed `bottom-end` with Edit in the first group and Delete alone in the last.

### K. Load failure — `Alert` (optional)

When `error` is set, a danger `Alert` with Retry takes the records table's place; the heading and the controls row stay, the controls disabled.

## Data

The page takes the zone, its records and both requests' state through props and emits every action; it fetches nothing and fakes no save or refresh. `DnsZoneDetailZone`, `DnsZoneDetailRecord`, `DnsZoneDetailSettings` and `DnsZoneDetailProps` are exported from `detail-dns-zone.vue`, and `sample.ts` holds the sample zone and record the page renders when `zone` or `records` is left out (the records never while `loading` or `error` is set). The settings form keeps its own draft; `zone` is the baseline Discard returns to, and a new `zone` resets the form to it.

| Prop          | Type                           | What it does                                                                                                      |
| ------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `zone`        | `DnsZoneDetailZone`            | Name, domain, DNSSEC and Active for the form, plus the nameservers and the DNSSEC key values to copy.             |
| `records`     | `DnsZoneDetailRecord[]`        | The records table; the filter, the sort and the pages run on them in the browser. Pass `[]` for a zone with none. |
| `loading`     | `boolean`                      | The records request is in flight: Refresh spins and the table shows its loading state.                            |
| `error`       | `string`                       | Why the records failed to load, shown in a danger `Alert` with Retry in place of the table.                       |
| `saving`      | `boolean`                      | The save is in flight: the form locks and Save spins.                                                             |
| `importable`  | `boolean`                      | Shows Import zone file beside Add Record in the Records heading.                                                  |
| `v-model:tab` | `'main-settings' \| 'records'` | The open tab.                                                                                                     |

| Event        | Payload                      | When                                                                  |
| ------------ | ---------------------------- | --------------------------------------------------------------------- |
| `submit`     | `(event, values)`            | Save with a valid draft; `values` is name, domain, DNSSEC and Active. |
| `discard`    | `(event)`                    | Discard; the draft is already back to `zone`.                         |
| `create`     | `(event)`                    | Add Record, in the heading or the empty state.                        |
| `import`     | `(event)`                    | Import zone file, in the heading or the empty state.                  |
| `refresh`    | `(event)`                    | Refresh.                                                              |
| `retry`      | `(event)`                    | Retry in the error alert.                                             |
| `row-action` | `(event, { value, record })` | Edit or Delete in a row menu.                                         |

To go live, render the page from a route that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import DetailDnsZone, { type DnsZoneDetailSettings } from './detail-dns-zone.vue'

  const { zone, update } = useZone()
  const { data: records, pending, error, refresh } = useZoneRecords()
  const loadError = "Couldn't load the records. Check your connection and retry."
  const saving = ref(false)

  const save = async (_event: Event, values: DnsZoneDetailSettings) => {
    saving.value = true
    try {
      await update(values)
    } finally {
      saving.value = false
    }
  }
</script>

<template>
  <DetailDnsZone
    v-if="zone"
    :zone="zone"
    :records="records ?? []"
    :loading="pending"
    :error="error ? loadError : ''"
    :saving="saving"
    @submit="save"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep settings and records on separate tabs, each with its own scroll.
- Show required errors only after a failed save, and clear each one when its field changes.
- Make every copyable value read-only and pair it with a `CopyButton` whose label names the value.
- Raise the save bar only when something changed, and keep it until Save lands or Discard restores the record.
- Reuse the table view controls row and table recipe in the Records tab so filters, search and columns behave the same as on index pages.
- Rewind pagination to the first page when the filter changes.
- Tell an empty zone (Add Record, Import zone file) apart from a filter that matches nothing (Clear filters).
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so this page body never renders a `Toaster`.

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
- Each `Input` has an `aria-label` matching its row title; an `Input` with an error points to its `FieldError` through `aria-describedby`.
- Every icon-only control has an `aria-label` and a `Tooltip` with the same words; decorative icons carry `aria-hidden="true"`.
- The property filter has an `aria-label` that matches its placeholder, "Filter records".
- Focus order follows reading order: tabs, form fields, save bar; or heading actions, the property filter, toolbar, table, pagination.
- Tab panel entrances respect reduced motion.

## States

- MainSettings: the default `tab`, the Main settings tab with General, nameservers, DNSSEC and Status from `zone`; the save bar appears on the first edit and Save spins while `saving`.
- Records: `tab="records"`, the Records tab with the zone's one A record from `records`, the ID column hidden by default; `loading` spins Refresh and loads the table, `error` swaps the table for a danger `Alert` with Retry, and `[]` shows No records yet.
- ImportZoneFile: `importable` puts Import zone file beside Add Record; the page listens to `import` and opens a large `Drawer`. The file comes from a `FileDropzone` (one `.zone`, `.txt` or `.db` file; a rejected or empty file shows an invalid `FieldError` under it) or is pasted into a `Textarea`. Every line is previewed in a `DataTable` paginated at ten lines: line number, name relative to the origin, type, value and a Ready, Skipped or Error `Tag`, with the reason under the value. The counts sit in a polite status line, errors add a danger `Alert` above the preview, and Import N records (disabled at zero) adds only the ready lines, then a toast says how many were imported and how many lines were left out.

## Importing a zone file

- Parse on the client shortly after the text stops changing (a 250 ms pause; a dropped file parses at once) and preview every line, ten per page, before anything is written; never import on drop.
- Name the line number on every row, so the user can fix the file.
- Skip with a reason what the zone manages itself (SOA, apex NS) and types it does not support; mark as errors only values that are wrong.
- Import what is ready even when some lines fail, and say in the toast how many were left out.

## Related

- `view/view-table` — the index this page is opened from, and the source of the controls row recipe.
- `edit/edit-resource` — the settings form and save bar pattern used by Main settings.
- `detail/detail-domains-card` — a short related list inside a settings section.
- `edit/edit-delete-dialog` — the dialog behind the row menu's Delete.
- `SaveBar` — the unsaved-changes band; see `skills/webkit-form`.

## Variants

- `MainSettings` — primary (the code below)
- `Records` — The Records tab with the zone’s one A record, the ID column hidden by default.
- `ImportZoneFile` — The Records tab with Import zone file open: a large `Drawer` that takes one BIND zone file from a `FileDropzone` (or Browse files) or pasted into a `Textarea`, parses it once typing pauses ($ORIGIN, $TTL with units, inherited names, quoted TXT) and previews every line in a `DataTable` paginated at 10 with its line number, name, type, value and a Ready, Skipped or Error `Tag`, the reason under the value. A polite status line counts ready, skipped and errors; errors raise a danger `Alert` saying the ready records still import. The SOA, the apex NS and unsupported types are skipped with their reason; a bad address or a missing value is an error. Import N records adds the ready ones to the table and reports through a toast that counts what was left out.

Each variant is the same screen in another state: `get_block("detail/detail-dns-zone", { variant })`, or the file under `blocks/detail/detail-dns-zone/variants/`.

## Code (`MainSettings`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import CopyButton from '@aziontech/webkit/copy-button'
  import type {
    DropdownMenuItemValue,
    TableColumn,
    TableExposed
  } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import ItemList from '@aziontech/webkit/item-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, reactive, ref, useId, watch } from 'vue'

  import { sampleRecords, sampleZone } from './sample'

  /** A tab of the zone page. */
  export type DnsZoneDetailTab = 'main-settings' | 'records'

  /** The DNSSEC values the user copies into the domain provider. */
  export interface DnsZoneDetailDnssecKey {
    /** Identifier of the key that signs the zone. */
    keyTag: string
    /** The signing algorithm, with its number. */
    algorithm: string
    /** The digest hash function, with its number. */
    digestType: string
    /** The digest of the public key. */
    digest: string
  }

  /** The editable zone settings, and the values a save sends. */
  export interface DnsZoneDetailSettings {
    /** The zone name. */
    name: string
    /** The domain the zone hosts. */
    domain: string
    /** Whether DNSSEC signs the zone. */
    dnssec: boolean
    /** Whether the zone answers authoritative queries. */
    active: boolean
  }

  /** The zone the page shows. */
  export interface DnsZoneDetailZone extends DnsZoneDetailSettings {
    /** The nameservers the user sets in the domain provider. */
    nameservers: string[]
    /** The DNSSEC key values, shown while DNSSEC is on. */
    dnssecKey: DnsZoneDetailDnssecKey
  }

  /** A record of the zone. */
  export interface DnsZoneDetailRecord {
    /** The record ID. */
    id: string
    /** The record name, relative to the zone. */
    name: string
    /** The record type, such as A or CNAME. */
    type: string
    /** What the record answers with. */
    value: string
    /** Time to live, in seconds. */
    ttl: number
    /** The policy option value, simple or weighted. */
    policy: string
    /** The weight, blank when it does not apply. */
    weight: number | null
    /** What the record is for. */
    description: string
  }

  export interface DnsZoneDetailProps {
    /** The zone; the settings form opens on it and Discard returns to it. Left out, the sample renders. */
    zone?: DnsZoneDetailZone
    /** The zone records. Pass an empty array for a zone with none. Left out, the sample renders. */
    records?: DnsZoneDetailRecord[]
    /** The records request is in flight: Refresh spins and the table shows its loading state. */
    loading?: boolean
    /** Why the records failed to load, shown in a danger alert with Retry in place of the table. */
    error?: string
    /** The save is in flight: the form locks and Save spins. */
    saving?: boolean
    /** Shows Import zone file in the Records heading. */
    importable?: boolean
  }

  const props = withDefaults(defineProps<DnsZoneDetailProps>(), {
    zone: undefined,
    records: undefined,
    loading: false,
    error: '',
    saving: false,
    importable: false
  })

  const emit = defineEmits<{
    submit: [event: Event, values: DnsZoneDetailSettings]
    discard: [event: MouseEvent]
    create: [event: MouseEvent]
    import: [event: MouseEvent]
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'row-action': [
      event: Event,
      payload: { value: DropdownMenuItemValue; record: DnsZoneDetailRecord }
    ]
  }>()

  const activeTab = defineModel<DnsZoneDetailTab>('tab', { default: 'main-settings' })

  const zone = computed<DnsZoneDetailZone>(() => props.zone ?? sampleZone)
  const records = computed<DnsZoneDetailRecord[]>(
    () => props.records ?? (props.loading || props.error ? [] : sampleRecords)
  )

  const tabs: { value: DnsZoneDetailTab; label: string }[] = [
    { value: 'main-settings', label: 'Main settings' },
    { value: 'records', label: 'Records' }
  ]

  const dnssecKeys = computed(() => [
    {
      label: 'Key tag',
      value: zone.value.dnssecKey.keyTag,
      description:
        'Unique identifier for the DNSSEC key used to sign your zone. Use this value with your domain provider.'
    },
    {
      label: 'Algorithm',
      value: zone.value.dnssecKey.algorithm,
      description: 'Specifies the algorithm used to generate the DNSSEC key.'
    },
    {
      label: 'Digest type',
      value: zone.value.dnssecKey.digestType,
      description: 'Indicates the hash function used for the DNSSEC digest.'
    },
    {
      label: 'Digest',
      value: zone.value.dnssecKey.digest,
      description:
        'Cryptographic hash of the public key for DNSSEC validation. Provide this to your provider.'
    }
  ])

  const settingsOf = (source: DnsZoneDetailZone): DnsZoneDetailSettings => ({
    name: source.name,
    domain: source.domain,
    dnssec: source.dnssec,
    active: source.active
  })

  const errors = reactive({ name: '', domain: '' })
  const settings = reactive<DnsZoneDetailSettings>(settingsOf(zone.value))
  const saving = computed(() => props.saving)
  const baseline = ref(JSON.stringify(settings))
  const dirty = computed(() => JSON.stringify(settings) !== baseline.value)
  const nameMessageId = useId()
  const domainMessageId = useId()
  const nameserverMessageId = useId()

  watch(
    () => JSON.stringify(settingsOf(zone.value)),
    (next) => {
      Object.assign(settings, JSON.parse(next) as DnsZoneDetailSettings)
      baseline.value = next
    }
  )

  const validate = () => {
    errors.name = settings.name.trim() ? '' : 'This field is required.'
    errors.domain = settings.domain.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.domain
  }

  const save = (event: Event) => {
    if (saving.value || !validate()) return
    emit('submit', event, { ...settings })
  }

  const discard = (event: MouseEvent) => {
    Object.assign(settings, JSON.parse(baseline.value) as DnsZoneDetailSettings)
    errors.name = ''
    errors.domain = ''
    emit('discard', event)
  }

  const POLICY_TYPES = [
    { value: 'simple', label: 'Simple' },
    { value: 'weighted', label: 'Weighted' }
  ]

  const policyLabel = (value: string) =>
    POLICY_TYPES.find((policy) => policy.value === value)?.label ?? ''

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', sortable: true, minWidth: 80 },
    { accessorKey: 'type', header: 'Type', sortable: true, minWidth: 104 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'ttl', header: 'TTL (seconds)', sortable: true, minWidth: 80 },
    { accessorKey: 'policy', header: 'Policy', minWidth: 80 },
    { accessorKey: 'weight', header: 'Weight', minWidth: 80 },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'type',
      label: 'Type',
      options: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'].map((value) => ({ value }))
    },
    { key: 'policy', label: 'Policy', options: POLICY_TYPES },
    { key: 'value', label: 'Value' }
  ]

  const {
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = useCollection({
    items: records,
    columns,
    filtering: { fields: ['name', 'id', 'type', 'value', 'description'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'dns-records-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    }
  })

  const blocked = computed(() => (props.loading && !records.value.length) || props.error !== '')

  const onRowAction = (event: Event, value: DropdownMenuItemValue, record: DnsZoneDetailRecord) =>
    emit('row-action', event, { value, record })

  const tableEl = ref<TableExposed<DnsZoneDetailRecord> | null>(null)
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <section
      v-if="activeTab === 'main-settings'"
      class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col"
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
              <SettingsGroup
                label="General"
                hint="How this zone is identified across the platform."
                anchor="general"
              >
                <Card :padded="false">
                  <template #default>
                    <ItemList>
                      <SettingsRow
                        title="Name"
                        description="Give a unique and descriptive name to identify your zone."
                      >
                        <Input
                          v-model="settings.name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                          autocomplete="off"
                          required
                          :invalid="!!errors.name"
                          :aria-describedby="errors.name ? nameMessageId : undefined"
                          :disabled="saving"
                          @update:model-value="errors.name = ''"
                        />
                        <FieldError
                          v-if="errors.name"
                          :id="nameMessageId"
                          >{{ errors.name }}</FieldError
                        >
                      </SettingsRow>

                      <SettingsRow
                        title="Domain name"
                        description="Provide the domain name you want to host. Example: example.com."
                      >
                        <Input
                          v-model="settings.domain"
                          size="large"
                          class="w-full"
                          aria-label="Domain name"
                          autocomplete="off"
                          required
                          :invalid="!!errors.domain"
                          :aria-describedby="errors.domain ? domainMessageId : undefined"
                          :disabled="saving"
                          @update:model-value="errors.domain = ''"
                        />
                        <FieldError
                          v-if="errors.domain"
                          :id="domainMessageId"
                          >{{ errors.domain }}</FieldError
                        >
                      </SettingsRow>
                    </ItemList>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="Configure your nameserver"
                hint="Make this zone the authoritative DNS for the domain."
                anchor="configure-your-nameserver"
              >
                <Card :padded="false">
                  <template #default>
                    <ItemList>
                      <SettingsRow
                        title="Nameservers"
                        description="Make this zone the authoritative DNS for the domain by copying the nameserver values."
                        stackable
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <InputGroupRoot
                            v-for="(ns, index) in zone.nameservers"
                            :key="ns"
                          >
                            <div class="flex flex-1">
                              <Input
                                :model-value="ns"
                                size="large"
                                class="w-full"
                                :aria-label="'Nameserver ' + (index + 1)"
                                monospace
                                readonly
                              />
                            </div>
                            <CopyButton
                              variant="ghost"
                              :value="ns"
                              :aria-label="'Copy nameserver ' + (index + 1)"
                              size="small"
                            />
                          </InputGroupRoot>
                        </div>
                        <FieldDescription :id="nameserverMessageId"
                          >Add the nameservers in your domain provider.</FieldDescription
                        >
                      </SettingsRow>
                    </ItemList>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="DNSSEC"
                hint="Signs the zone so resolvers can detect spoofed answers."
                anchor="dnssec"
              >
                <Card :padded="false">
                  <template #default>
                    <ItemList>
                      <SettingsRow
                        title="Enable DNSSEC"
                        description="Enable DNSSEC to secure your DNS zone against cache poisoning and spoofing attacks. Configure the key tag and digest values in your domain provider to complete the setup."
                        variant="compact"
                      >
                        <Switch
                          v-model="settings.dnssec"
                          aria-label="Enable DNSSEC"
                          :disabled="saving"
                        />
                      </SettingsRow>

                      <template v-if="settings.dnssec">
                        <SettingsRow
                          v-for="key in dnssecKeys"
                          :key="key.label"
                          :title="key.label"
                          :description="key.description"
                          stackable
                        >
                          <InputGroupRoot class="w-full">
                            <div class="flex flex-1">
                              <Input
                                :model-value="key.value"
                                size="large"
                                class="w-full"
                                :aria-label="key.label"
                                monospace
                                readonly
                              />
                            </div>
                            <CopyButton
                              variant="ghost"
                              :value="key.value"
                              :aria-label="'Copy ' + key.label"
                              size="small"
                            />
                          </InputGroupRoot>
                        </SettingsRow>
                      </template>
                    </ItemList>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="Status"
                hint="A zone can be held inactive while its records are being built."
                anchor="status"
              >
                <Card :padded="false">
                  <template #default>
                    <ItemList>
                      <SettingsRow
                        title="Active"
                        description="When active, the zone answers authoritative DNS queries for the domain."
                        variant="compact"
                      >
                        <Switch
                          v-model="settings.active"
                          aria-label="Active"
                          :disabled="saving"
                        />
                      </SettingsRow>
                    </ItemList>
                  </template>
                </Card>
              </SettingsGroup>
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
            variant="docked"
          >
            You have unsaved changes.

            <template #actions>
              <Button
                type="button"
                label="Discard"
                variant="outline"
                size="medium"
                :disabled="saving"
                @click="discard"
              />
              <Button
                type="submit"
                label="Save"
                variant="primary"
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
      class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1"
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
              icon="az az-book"
              variant="outline"
              size="medium"
              href="https://example.com/docs/records"
              target="_blank"
            />
            <Button
              v-if="importable"
              label="Import zone file"
              icon="az az-file-import"
              variant="outline"
              size="medium"
              @click="(event: MouseEvent) => emit('import', event)"
            />
            <Button
              label="Add Record"
              icon="az az-plus"
              variant="outline"
              size="medium"
              @click="(event: MouseEvent) => emit('create', event)"
            />
          </template>
        </PageHeader>
        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
          <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
            <header class="flex items-start gap-(--layout-group-gap)">
              <div class="flex min-w-0 grow">
                <PropertyFilter
                  v-bind="propertyFilterProps"
                  placeholder="Filter records"
                  aria-label="Filter records"
                  :disabled="blocked"
                />
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
                    :loading="loading"
                    aria-label="Refresh"
                    @click="(event: MouseEvent) => emit('refresh', event)"
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
                    :disabled="blocked || !matchingItems.length"
                    aria-label="Download CSV"
                    @click="tableEl?.exportCsv({ filename: 'records.csv' })"
                  />
                </Tooltip>
                <CollectionPreferences
                  v-bind="preferencesProps"
                  title="Table preferences"
                  :disabled="blocked"
                />
              </div>
            </header>
            <Alert
              v-if="error"
              severity="danger"
              :label="error"
              action-label="Retry"
              @action="(event: MouseEvent) => emit('retry', event)"
            />
            <Card
              v-else
              :padded="false"
            >
              <template #default>
                <DataTable
                  ref="tableEl"
                  v-bind="tableProps"
                  :loading="loading || fetching"
                  sortable
                  :bordered="false"
                >
                  <template #cell-name="{ value }">
                    <span class="min-w-0 truncate">{{ value }}</span>
                  </template>
                  <template #cell-id="{ value }">
                    <TableCellId
                      :value="value"
                      resource="record"
                    />
                  </template>
                  <template #cell-type="{ value }">
                    <Tag
                      :label="value"
                      severity="neutral"
                      size="medium"
                    />
                  </template>
                  <template #cell-value="{ value }">
                    <TableCellLink
                      :label="value"
                      copyable
                      @click.stop
                    />
                  </template>
                  <template #cell-policy="{ value }">
                    <span class="min-w-0 truncate">{{ policyLabel(value) }}</span>
                  </template>
                  <template #cell-weight="{ value }">
                    <span class="min-w-0 truncate">{{ value ?? '' }}</span>
                  </template>
                  <template #cell-description="{ value }">
                    <span class="min-w-0 truncate">{{ value }}</span>
                  </template>
                  <template #cell-actions="{ row }">
                    <TableCellActions
                      :name="row.name"
                      @select="(event, value) => onRowAction(event, value, row)"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="edit"
                          label="Edit"
                        >
                          <template #leading
                            ><i
                              class="az az-pencil"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          value="delete"
                          label="Delete"
                        >
                          <template #leading
                            ><i
                              class="az az-trash"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </TableCellActions>
                  </template>
                  <template #empty>
                    <EmptyState
                      key="empty-state-1"
                      v-if="status === 'no-match'"
                      size="medium"
                      icon="az az-filter-off"
                      title="No matching records"
                      description="No record matches these filters."
                    >
                      <template #actions>
                        <Button
                          label="Clear filters"
                          variant="outline"
                          size="small"
                          @click="clearFilters"
                        />
                      </template>
                    </EmptyState>
                    <EmptyState
                      key="empty-state-2"
                      v-else
                      size="medium"
                      icon="az az-list"
                      title="No records yet"
                      :description="`Add a record, or import a zone file, so this zone starts answering for ${zone.domain}.`"
                    >
                      <template #actions>
                        <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                          <Button
                            label="Add Record"
                            icon="az az-plus"
                            variant="secondary"
                            size="small"
                            @click="(event: MouseEvent) => emit('create', event)"
                          />
                          <Button
                            label="Import zone file"
                            icon="az az-upload"
                            variant="outline"
                            size="small"
                            @click="(event: MouseEvent) => emit('import', event)"
                          />
                        </div>
                      </template>
                    </EmptyState>
                  </template>
                </DataTable>
              </template>
            </Card>
          </section>
        </section>
      </div>
    </section>
  </div>
</template>
```

## `sample.ts`

```ts
import type { DnsZoneDetailRecord, DnsZoneDetailZone } from './detail-dns-zone.vue'

export const sampleZone: DnsZoneDetailZone = {
  name: 'main-zone',
  domain: 'example.com',
  dnssec: true,
  active: true,
  nameservers: ['ns1.example.net', 'ns2.example.com', 'ns3.example.org'],
  dnssecKey: {
    keyTag: '34505',
    algorithm: '13 (ECDSA Curve P-256 with SHA-256)',
    digestType: '2 (SHA-256)',
    digest: '8A9E1F2C3B4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F'
  }
}

export const sampleRecords: DnsZoneDetailRecord[] = [
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
```
