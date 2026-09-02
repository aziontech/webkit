<script setup>
  // Edge DNS — zone detail. The resource-detail view for a single zone, in the
  // persistent console shell (AppLayout: sidebar + GlobalHeader with the module
  // breadcrumb — the /navigation skill). Its body is a full-bleed tab bar with two
  // destinations:
  //
  //   Main Settings — the zone's configuration as Sections over flush cards of FieldRows,
  //                   the same anatomy every settings surface in the console uses, and
  //                   committed as ONE PAGE from the shared bar (ui/SettingsSaveBar.vue).
  //                   It used to give each editable band its own footer Save; see the
  //                   note above `settings` in the script for why that went away. The
  //                   nameservers and the DNSSEC key material are read-only copy-out rows
  //                   — an InputText + a CopyButton as an InputGroup addon — so they have
  //                   nothing to commit.
  //   Records       — a data-driven <Table> of the zone's DNS records with the
  //                   tab's "Record" create action trailing on the tab bar; the
  //                   Create Record drawer appends new rows.
  //
  // The active tab lives in the URL (?tab=) so it survives reload and is linkable.
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputGroup from '@aziontech/webkit/input-group'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FieldRow from '../../components/form/FieldRow.vue'
  import SettingsSaveBar from '../../components/form/SettingsSaveBar.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import IdCell from '../../components/list/IdCell.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import Section from '../../components/page/Section.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { saveGroup, useBaseline } from '../../lib/behavior/forms'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../lib/behavior/table-columns'
  import { NAMESERVERS, POLICY_TYPES, policyLabel, RECORD_TYPES } from '../../lib/data/edge-dns'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import CreateRecordDrawer from './CreateRecordDrawer.vue'

  // Where `Documentation` goes: the zone's own module doc, taken from the registry rather
  // than restated (lib/data/product-empty-states.js).
  const HELP = productFirstUse('edge-dns').learnMore.href

  const route = useRoute()
  const router = useRouter()

  // A tiny stand-in record — in a real app this comes from the route id.
  const zone = {
    id: route.params.id || '6442',
    name: route.query.name || 'test',
    domain: route.query.domain || 'edgeflow.com'
  }

  // Active tab lives in the URL (?tab=) so it survives reload and is linkable.
  const tabs = [
    { value: 'main-settings', label: 'Main Settings' },
    { value: 'records', label: 'Records' }
  ]
  const activeTab = computed({
    get: () =>
      tabs.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'main-settings',
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

  // ── Main Settings — ONE page, ONE commit ──────────────────────────────────
  //
  // The zone's four editable bands used to own four independent saves: a footer Save per
  // card, each with its own submitting flag and its own baseline. That is the shape this
  // console has now dropped everywhere. A zone's name, its domain, its DNSSEC switch and
  // its Active switch are one record, and four footers asked the reader to notice which
  // one belonged to the field they just changed — then to press two of them when they
  // changed something in each, and left the page with no single answer to "is what I see
  // what is stored".
  //
  // So there is ONE editable object, ONE baseline, ONE `saving` flag and ONE bar (the
  // shared ui/SettingsSaveBar.vue, which mounts on the first real edit). The nameservers
  // and the DNSSEC key material stay read-only copy-out bands: they carry no state, and
  // they are not what the bar commits.
  const errors = reactive({ name: '', domain: '' })

  const settings = reactive({
    name: zone.name,
    domain: zone.domain,
    dnssec: true,
    active: true
  })
  const saving = ref(false)
  const { dirty, commit } = useBaseline(settings)

  // `useBaseline` reports dirtiness but does not hand the snapshot back, so the page keeps
  // its own copy — that copy is what Discard restores, and it is the LAST SAVED state
  // rather than the zone's opening values.
  const snapshot = ref(JSON.parse(JSON.stringify(settings)))

  // DNSSEC key material — generated by Edge DNS, copied out to the domain provider. A
  // LIST rather than four hand-written rows: every one of them is the same row (a name, a
  // line of guidance, a read-only value with a copy button), and four copies of it drift.
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
      label: 'Digest Type',
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

  // Validation runs on SUBMIT only, and on every field the page commits — one press has
  // to report everything that would stop the save, not the first thing it hits.
  const validate = () => {
    errors.name = settings.name.trim() ? '' : 'This field is required.'
    errors.domain = settings.domain.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.domain
  }

  const save = () => {
    if (!validate()) return
    saveGroup(saving, 'Zone settings saved.', () => {
      commit()
      snapshot.value = JSON.parse(JSON.stringify(settings))
    })
  }

  // Discard restores the last saved snapshot in one step — the way back a page-level commit
  // owes the reader, who otherwise has to undo each field by hand and hope the bar goes
  // away. It also clears the messages: a required prompt was about a value that no longer
  // exists.
  const discard = () => {
    Object.assign(settings, JSON.parse(JSON.stringify(snapshot.value)))
    errors.name = ''
    errors.domain = ''
  }

  // ── Records tab ───────────────────────────────────────────────────────────
  const records = ref([
    {
      id: '423916',
      name: 'sasas',
      type: 'A',
      value: '192.0.2.1',
      ttl: 3600,
      policy: 'simple',
      weight: 255,
      description: 'Cryptographic digest of this zone’s key, as your provider expects it.'
    }
  ])

  // ── The filter catalog ────────────────────────────────────────────────────
  // Type and Policy are the enumerable columns — a zone's records are read by asking
  // "show me the CNAMEs" far more often than by name — while Name, Value and
  // Description are free text, covered by the search field, and TTL / Weight are
  // magnitudes rather than categories.
  //
  // The Type options are the SAME list the create form offers (src/lib/edge-dns.js),
  // shortened to the bare record type: the form needs "A - IPv4 Address" to teach what
  // to type, and a chip that already says "Type" only needs the "A".
  const filterFields = [
    {
      id: 'type',
      label: 'Type',
      kind: 'options',
      options: RECORD_TYPES.map((type) => ({ value: type.value, label: type.value })),
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

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleRecords,
    loading,
    refresh
  } = useListFilters(filterFields, records)

  // The table the controls row drives. Download CSV calls the DS's own `exportCsv()`
  // through it (../../components/list/ExportButton.vue), so the file honours the
  // visible columns and the filtered rows instead of re-serialising them here.
  const tableRef = ref(null)

  const recordColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'type', header: 'Type', enableSorting: true, minWidth: TAG_COLUMN },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'ttl', header: 'TTL (seconds)', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'policy', header: 'Policy', minWidth: FIT_COLUMN },
    { accessorKey: 'weight', header: 'Weight', minWidth: FIT_COLUMN },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // Which columns are switched off, driven by the Columns button on the controls
  // row (../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever
  // recorded, so this never has to be kept in step with the column model above.
  //
  // ID SHIPS OFF. It is the column an operator wants when they are quoting a resource
  // into a support thread or an API call, and almost never while scanning the list —
  // so it starts hidden and is one switch away. That is the whole point of the panel:
  // a column can be available without being in the way by default.
  const columnVisibility = ref({ id: false })

  const recordDrawerOpen = ref(false)
  const openRecordDrawer = () => {
    recordDrawerOpen.value = true
  }
  const onRecordCreated = (record) => {
    records.value = [record, ...records.value]
  }

  // A record deletion changes where the domain resolves, so it goes through the same
  // confirmation the resource lists use: the record's name typed back.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    records.value = records.value.filter((record) => record.id !== row.id)
    toast.success(`Record "${row.name}" deleted.`)
    pendingDelete.value = null
  }

  const onRecordAction = (event, value, row) => {
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(`Editing ${row.name}`, { description: `Record ID ${row.id}` })
  }
</script>

<template>
  <AppLayout
    active="edge-dns"
    :padded="false"
    :breadcrumb="[
      { label: 'Edge DNS', href: '/edge-dns' },
      { label: 'Zone', href: '/edge-dns' },
      { label: zone.name }
    ]"
  >
    <main class="flex h-full min-h-0 flex-col">
      <!-- Nav pattern (ApplicationDetail): the tabs are the full-bleed bottom of the
           header, and nothing else — only the content below scrolls. The Records tab's
           create action is on the Records HEADING, beside the list it creates into,
           like every second-level list in the console. -->
      <PageTabs
        v-model:value="activeTab"
        :tabs="tabs"
      />

      <!-- Main Settings — Sections over flush cards of FieldRows, committed as one page.
           Only this region scrolls, and it is a flex COLUMN so the save bar below can pin
           itself to the bottom of the visible area (see the bar at the end of the form). -->
      <section
        v-if="activeTab === 'main-settings'"
        class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col overflow-auto"
      >
        <!-- The FORM measure, not the DATA one the Records tab takes: this band is a
             single stacked column of label-plus-control rows, so past ~1200px the extra
             width lands inside the controls and leaves each label a head-turn from the
             field it names. Per layout.css the unit that picks a measure is the BAND,
             not the file — the same split Main Settings and Build make inside
             ApplicationDetail. -->
        <!-- ONE form for the tab. Every band below edits the same zone record, so one
             submit commits all of them and the shared bar at the end of this form is the
             only Save on screen (see the note in the script). The read-only bands sit
             inside it too — they are part of the same page, they just have nothing to
             commit.
             `min-h-full` so the bar lands at the bottom of the screen on a short page
             instead of floating just under the last card. -->
        <form
          class="flex min-h-full min-w-0 flex-col"
          aria-label="Zone settings"
          novalidate
          @submit.prevent="save"
        >
          <!-- The FORM measure, not the DATA one the Records tab takes: this band is a
               single stacked column of label-plus-control rows, so past ~1200px the extra
               width lands inside the controls and leaves each label a head-turn from the
               field it names. Per layout.css the unit that picks a measure is the BAND,
               not the file — the same split Main Settings and Build make inside
               ApplicationDetail. -->
          <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
            <!-- The tab's parent section: it spaces the groups inside it at
                 --layout-section-gap, so no group restates the step (layout.css: the
                 boundary owns the top space, the parent owns the space between). -->
            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
              <!-- One flag locks every editable control while the commit is in flight. -->
              <fieldset
                class="m-0 flex min-w-0 flex-col border-0 p-0"
                :disabled="saving"
              >
                <legend class="sr-only">Zone settings</legend>

                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="General"
                  hint="How this zone is identified across the console."
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <FieldRow
                          title="Name"
                          description="Give a unique and descriptive name to identify your zone."
                          :message="errors.name"
                          message-kind="required"
                        >
                          <template #default="{ messageId }">
                            <InputText
                              v-model="settings.name"
                              size="large"
                              class="w-full"
                              aria-label="Name"
                              autocomplete="off"
                              :required="!!errors.name"
                              :aria-describedby="messageId"
                              :disabled="saving"
                              @update:model-value="errors.name = ''"
                            />
                          </template>
                        </FieldRow>

                        <FieldRow
                          title="Domain Name"
                          description="Provide the domain name you want to host. Example: mydomain.com."
                          :message="errors.domain"
                          message-kind="required"
                        >
                          <template #default="{ messageId }">
                            <InputText
                              v-model="settings.domain"
                              size="large"
                              class="w-full"
                              aria-label="Domain Name"
                              autocomplete="off"
                              :required="!!errors.domain"
                              :aria-describedby="messageId"
                              :disabled="saving"
                              @update:model-value="errors.domain = ''"
                            />
                          </template>
                        </FieldRow>
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>

                <!-- Read-only copy-out. No control the reader can change, so nothing here
                     reaches the bar; each value is an InputText with a copy button as an
                     InputGroup addon. -->
                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="Configure your nameserver"
                  hint="Set Azion Edge DNS as the authoritative DNS server for the domain."
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <FieldRow
                          title="Nameservers"
                          description="Set Azion Edge DNS as the authoritative DNS server for a domain by copying the nameservers values."
                          message="Add the nameservers in your domain provider."
                        >
                          <div class="flex w-full flex-col gap-(--spacing-xs)">
                            <InputGroup
                              v-for="(ns, index) in NAMESERVERS"
                              :key="ns"
                            >
                              <InputText
                                :model-value="ns"
                                size="large"
                                class="flex-1 font-code"
                                :aria-label="`Nameserver ${index + 1}`"
                                readonly
                              />
                              <CopyButton
                                kind="transparent"
                                :value="ns"
                                :aria-label="`Copy nameserver ${index + 1}`"
                              />
                            </InputGroup>
                          </div>
                        </FieldRow>
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>

                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="DNSSEC"
                  hint="Signs the zone so resolvers can detect spoofed answers."
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <FieldRow
                          kind="compact"
                          title="Enable DNSSEC"
                          description="Enable DNSSEC to secure your DNS zone against cache poisoning and spoofing attacks. Configure the Key Tag and Digest values in your domain provider to complete the setup."
                        >
                          <Switch
                            v-model="settings.dnssec"
                            aria-label="Enable DNSSEC"
                            :disabled="saving"
                          />
                        </FieldRow>

                        <!-- The key material appears only once DNSSEC is on: it is what the
                             reader takes to their provider, and it means nothing while the
                             feature is off. Read-only, so it is not what the bar commits —
                             turning the switch on IS the edit. -->
                        <template v-if="settings.dnssec">
                          <FieldRow
                            v-for="key in dnssecKeys"
                            :key="key.label"
                            :title="key.label"
                            :description="key.description"
                          >
                            <InputGroup class="w-full">
                              <InputText
                                :model-value="key.value"
                                size="large"
                                class="flex-1 font-code"
                                :aria-label="key.label"
                                readonly
                              />
                              <CopyButton
                                kind="transparent"
                                :value="key.value"
                                :aria-label="`Copy ${key.label}`"
                              />
                            </InputGroup>
                          </FieldRow>
                        </template>
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>

                <Section
                  stacked
                  anchor
                  :divided="false"
                  title="Status"
                  hint="A zone can be held inactive while its records are being built."
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <FieldRow
                          kind="compact"
                          title="Active"
                          description="When active, the zone answers authoritative DNS queries for the domain."
                        >
                          <Switch
                            v-model="settings.active"
                            aria-label="Active"
                            :disabled="saving"
                          />
                        </FieldRow>
                      </Item.List>
                    </template>
                  </CardBox>
                </Section>
              </fieldset>
            </section>
          </div>

          <!-- ONE bar for the whole tab, from the component every settings surface here
               shares. `sticky` because this form sits inside the tab's own scroll region,
               which is the scrollport the bar pins against. -->
          <SettingsSaveBar
            :dirty="dirty"
            :saving="saving"
            @save="save"
            @discard="discard"
          />
        </form>
      </section>

      <!-- Records — a flush borderless Table under the heading that names it. -->
      <section
        v-else
        class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto"
      >
        <div class="layout-column layout-boundary flex min-w-0 flex-col">
          <!-- The tab HEADS ITSELF, like every other second-level list: the title, the
               module's reference link, and the create action on one row, above the
               controls that narrow the list. This tab had none of it — the zone name in
               the breadcrumb was doing the naming and the create button was parked in
               the tab bar — so the one page in the console whose list had no heading was
               also the one whose action sat furthest from it. -->
          <PageHeading
            title="Records"
            description="The authoritative records this zone answers with."
            size="small"
            :documentation="HELP"
          >
            <template #actions>
              <HeadingAction
                label="Add Record"
                kind="outlined"
                icon="pi pi-plus"
                @click="openRecordDrawer"
              />
            </template>
          </PageHeading>

          <!-- The tab's parent section: it spaces the sections inside it at
               --layout-section-gap. It holds one here — the controls row over the table
               it narrows, joined at the GROUP step. -->
          <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
            <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
              <!-- The band's CONTROLS: narrowing on the left, the band's own action on the
                   right, above the card — the same row every list in the console opens with. -->
              <ControlsHeader>
                <FilterButton
                  v-model="filters"
                  :fields="filterFields"
                />
                <!-- Search drives the table's global filter from outside the card, so the field is
                     a plain InputText (`Table.Search` is context-aware and only works inside
                     `<Table>`). One horizontal band: it grows into the row's slack and compresses
                     rather than wrapping (see ui/ControlsHeader.vue). -->
                <InputText
                  v-model="search"
                  size="medium"
                  placeholder="Search records"
                  aria-label="Search records"
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
                  <!-- THE RIGHT GROUP: the three controls that act on the LISTING rather
                       than narrow it — fetch it again, take it away as a file, choose which
                       columns it shows. All glyphs, all `medium`, so the row shares one
                       32px height with the field and the Filter button opposite. -->
                  <RefreshButton
                    :loading="loading"
                    @refresh="refresh"
                  />
                  <ExportButton
                    :table="tableRef"
                    filename="dns-records.csv"
                  />
                  <ColumnsButton
                    v-model="columnVisibility"
                    :columns="recordColumns"
                  />
                </template>
              </ControlsHeader>

              <FilterChips
                v-model="filters"
                :fields="filterFields"
              />

              <CardBox :padded="false">
                <template #content>
                  <Table
                    ref="tableRef"
                    v-model:pagination="pagination"
                    v-model:globalFilter="search"
                    v-model:columnVisibility="columnVisibility"
                    :data="visibleRecords"
                    :columns="recordColumns"
                    row-key="id"
                    enable-sorting
                    paginated
                    :page-size="8"
                    :border="false"
                    :loading="loading"
                  >
                    <!-- Name, id and value are all data, not code: each keeps the cell's
                         own type and --text-default, so a record row reads at one weight
                         across its columns (Applications.vue's list is the reference).
                         The id goes through the shared cell, which is what adds the copy
                         button (../../components/list/IdCell.vue). -->
                    <template #cell-name="{ value }">
                      <span class="min-w-0 truncate">{{ value }}</span>
                    </template>

                    <template #cell-id="{ value }">
                      <IdCell
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
                      <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                        <span class="min-w-0 truncate">{{ value }}</span>
                        <CopyButton
                          kind="outlined"
                          :value="value"
                          aria-label="Copy record value"
                          class="ml-auto shrink-0"
                          @click.stop
                        />
                      </div>
                    </template>

                    <!-- Policy, weight and description are the record's own facts, so
                         they keep the cell's type and --text-default like the columns
                         above: muting three of the eight columns split each row into two
                         weights and read as "these matter less" rather than as one
                         record. `—` stands in for an empty optional value. -->
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
                      <Dropdown
                        placement="bottom-end"
                        @select="(event, value) => onRecordAction(event, value, row)"
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
                            <template #left
                              ><i
                                class="pi pi-pencil"
                                aria-hidden="true"
                            /></template>
                          </Dropdown.Option>
                        </Dropdown.Group>
                        <Dropdown.Group>
                          <Dropdown.Option
                            value="delete"
                            label="Delete"
                          >
                            <template #left
                              ><i
                                class="pi pi-trash"
                                aria-hidden="true"
                            /></template>
                          </Dropdown.Option>
                        </Dropdown.Group>
                      </Dropdown>
                    </template>
                  </Table>
                </template>
              </CardBox>
            </section>
          </section>
        </div>
      </section>
    </main>

    <!-- Create Record — a right Drawer; on save the record is appended to the list. -->
    <CreateRecordDrawer
      v-model:open="recordDrawerOpen"
      :domain="settings.domain"
      @created="onRecordCreated"
    />

    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Record"
      :name="pendingDelete?.name ?? ''"
      description="The selected Record will be deleted, and resolvers will stop returning it once the change propagates. Check the"
      @confirm="confirmDelete"
    />
  </AppLayout>
</template>
