<script setup>
  // WAF Rule → Tuning. What this rule set actually matched in production, grouped by
  // the rule that matched it.
  //
  // THE ONE READ-ONLY TAB. Main Settings and Allowed Rules edit the rule set; this one
  // reports on it. Nothing here has a Save, and no row opens a form — the row's job is
  // to be evidence, and the only thing you DO with evidence is act on it, which is what
  // the create action at the top does (below).
  //
  // COUNTS LEAD, EVIDENCE FOLLOWS. The question this tab exists to answer is "which of
  // my rules fire most, and is that traffic real?" — so Hits sorts descending by default
  // and the three breadth columns (IPs, Countries, Paths) are counts, not lists. The
  // lists themselves are in the Top 10 columns as overflow cells: a column holding ten
  // IP addresses is a column nobody can read, and the top-10 IS the sample you look at
  // before deciding whether a rule is catching an attack or a customer.
  //
  // CREATE FROM TUNING is the whole point of the tab and the reason it sits between the
  // other two. A row here says "rule 1005 fired 18,432 times on /api/v1/search"; if that
  // path is legitimate, the fix is an allowed rule scoped to exactly that — so selecting
  // rows and pressing the button carries them to the Allowed Rules tab pre-filled,
  // rather than making the reader retype a rule id and a path they are looking at.
  //
  // Selection therefore drives BOTH actions in the heading, and both are disabled with
  // nothing selected: an export of "no rows" and an allowed rule for "no rule" are the
  // same kind of nonsense, and a disabled control says why better than an empty result.
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'

  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { wafTuningFor } from '../../../lib/data/waf-rules'

  const props = defineProps({
    /** The rule set whose matches are being reviewed. */
    ruleSet: { type: Object, required: true },
    /** Hands selected rows to the Allowed Rules tab — the "Add Allowed Rule" path. */
    onCreateAllowed: { type: Function, default: null }
  })

  const rows = computed(() => wafTuningFor(props.ruleSet.id))

  const search = ref('')
  const columnVisibility = ref({})

  // TanStack's shape: `{ [rowKey]: true }` for the checked rows, keyed by `row-key`
  // (`ruleId` here). The tab works in ROWS, not ids, so it resolves them back once and
  // both actions read that — an id on its own cannot pre-fill an allowed rule's path.
  const rowSelection = ref({})
  const selected = computed(() => rows.value.filter((row) => rowSelection.value[row.ruleId]))

  // `ruleId` is the principal column and cannot be hidden: every other column on this
  // row is a measurement OF that rule, so without it the row measures nothing.
  const columns = [
    {
      accessorKey: 'ruleId',
      header: 'Rule ID',
      enableSorting: true,
      principal: true,
      hideable: false
    },
    { accessorKey: 'hits', header: 'Hits', enableSorting: true },
    { accessorKey: 'ipCount', header: 'IPs', enableSorting: true },
    { accessorKey: 'countryCount', header: 'Countries', enableSorting: true },
    { accessorKey: 'pathCount', header: 'Paths', enableSorting: true },
    { accessorKey: 'ips', header: 'Top 10 IP Addresses', grow: 3 },
    { accessorKey: 'countries', header: 'Top 10 Countries', grow: 2 },
    { accessorKey: 'paths', header: 'Top 10 Paths', grow: 3 }
  ]

  // Thousands separators, because the number is the column a reader scans and `18432`
  // and `1843` are the same shape at a glance.
  const formatHits = (value) => new Intl.NumberFormat('en-US').format(value)

  const createAllowed = () => {
    props.onCreateAllowed?.(selected.value)
    rowSelection.value = {}
  }

  const exportCsv = () => {
    toast.info(`Exporting ${selected.value.length} tuning rows.`, {
      description: 'The file is prepared and downloaded from the browser.'
    })
  }
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Tuning"
      description="Requests this rule set matched, grouped by rule. Review them, then allow the ones that are legitimate."
      size="small"
    >
      <template #actions>
        <!-- Both act on the SELECTION, so both are inert until there is one. Export is
             `outlined` and Create is `primary`: one takes the evidence away to read
             elsewhere, the other changes the rule set. -->
        <HeadingAction
          label="Export to CSV"
          kind="outlined"
          icon="pi pi-download"
          :disabled="!selected.length"
          @click="exportCsv"
        />
        <HeadingAction
          label="Add Allowed Rule"
          kind="primary"
          icon="pi pi-plus"
          :disabled="!selected.length"
          @click="createAllowed"
        />
      </template>
    </PageHeading>

    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <ControlsHeader v-if="rows.length">
          <InputText
            v-model="search"
            size="medium"
            placeholder="Search by rule, IP, country or path"
            aria-label="Search tuning rows"
            class="min-w-36 grow basis-(--container-2xs)"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
          <ColumnsButton
            v-model="columnVisibility"
            :columns="columns"
          />
        </ControlsHeader>

        <CardBox :padded="false">
          <template #content>
            <!-- A rule set that matched nothing is the GOOD outcome, so the empty state
                 says that rather than offering a way to make rows appear — there is no
                 action here that would, and a "Create" button under "no matches" would
                 be an invitation to the wrong conclusion. -->
            <EmptyState
              v-if="!rows.length"
              icon="ai ai-waf"
              title="No matches yet"
              description="This rule set has not matched any request. Matches appear here as traffic arrives."
            />
            <Table
              v-else
              v-model:globalFilter="search"
              v-model:columnVisibility="columnVisibility"
              v-model:rowSelection="rowSelection"
              :data="rows"
              :columns="columns"
              row-key="ruleId"
              enable-row-selection
              enable-sorting
              :border="false"
            >
              <template #cell-hits="{ value }">
                <span class="tabular-nums">{{ formatHits(value) }}</span>
              </template>

              <!-- The three breadth columns are counts of the lists beside them, so they
                   read as numbers and align with Hits. -->
              <template #cell-ipCount="{ value }">
                <span class="tabular-nums text-(--text-muted)">{{ value }}</span>
              </template>
              <template #cell-countryCount="{ value }">
                <span class="tabular-nums text-(--text-muted)">{{ value }}</span>
              </template>
              <template #cell-pathCount="{ value }">
                <span class="tabular-nums text-(--text-muted)">{{ value }}</span>
              </template>

              <!-- The top-10s: the first two named, the rest counted. A cell that lists
                   every value is a cell that sets the row's height by its longest list. -->
              <template #cell-ips="{ value }">
                <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                  <span class="truncate font-mono text-body-sm">{{
                    value.slice(0, 2).join(', ')
                  }}</span>
                  <Tag
                    v-if="value.length > 2"
                    :label="`+${value.length - 2}`"
                    size="small"
                  />
                </span>
              </template>
              <template #cell-countries="{ value }">
                <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                  <span class="truncate">{{ value.slice(0, 2).join(', ') }}</span>
                  <Tag
                    v-if="value.length > 2"
                    :label="`+${value.length - 2}`"
                    size="small"
                  />
                </span>
              </template>
              <template #cell-paths="{ value }">
                <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                  <span class="truncate font-mono text-body-sm">{{
                    value.slice(0, 2).join(', ')
                  }}</span>
                  <Tag
                    v-if="value.length > 2"
                    :label="`+${value.length - 2}`"
                    size="small"
                  />
                </span>
              </template>
            </Table>
          </template>
        </CardBox>
      </section>
    </section>
  </div>
</template>
