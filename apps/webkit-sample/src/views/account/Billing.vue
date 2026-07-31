<script setup>
  // Settings → Billing. What the workspace pays, the card it is charged to, and
  // the invoice history behind both.
  //
  // THREE BANDS, TWO SHAPES. The subscription and the payment method are FACT
  // GRIDS — a <dl> of label-over-value cells inside a CardBox — because every
  // value there is a readout with no action of its own; each band's single action
  // lives on its SectionHeading, so the card stays pure data. The invoices are a
  // data-driven Table (`:data` + `:columns`) under the house toolbar order
  // (Filter · Search · Refresh · Export · ColumnSelector), every control at
  // `medium` so the row shares one 32px height.
  //
  // STATES — the view fetches, so it owns the whole surface: Skeletons reserve
  // each fact grid while the data arrives, the Table renders its own skeleton
  // rows off `:loading`, a failed load replaces the bands with one Message
  // carrying Retry (a single request backs all three, so it is reported once),
  // and an over-filtered list gets a "clear filters" EmptyState whose copy is
  // distinct from the never-invoiced one. `fetchBilling()` stands in for the
  // app's data layer — swap it for the real request and every state above is
  // already wired.
  //
  // MONEY — amount READOUTS render through webkit's Currency, so the console
  // spells money the same way here as in Manage Resources. The reference design
  // mutes the cents; that flourish is not in Currency, and hand-rolling it here
  // would leave this one screen reading differently from every other amount in
  // the product. The seat price is a Tag LABEL, not a readout, so it stays a
  // formatted string.
  //
  // LAYOUT — the invoice table earns the DATA measure (`.layout-column`), and the
  // fact grids read fine at that width. The view owns its own scroll region
  // because the shell hands each tab a plain flex column (see AccountSettings.vue).
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Currency from '@aziontech/webkit/currency'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onMounted, ref } from 'vue'

  import ControlsHeader from '../../components/ui/ControlsHeader.vue'
  import PageHeading from '../../components/ui/PageHeading.vue'
  import SectionHeading from '../../components/ui/SectionHeading.vue'

  const DOCS = 'https://www.azion.com/en/documentation/'

  // --- The records the view reads ------------------------------------------
  // Pricing is per seat, so the figures on this page reconcile with each other:
  // seats × the plan's seat price IS the amount, on the subscription card and on
  // every invoice row. Nothing on the screen can quietly disagree.
  const SEAT_PRICE = { Business: 40, Starter: 20 }

  const SUBSCRIPTION = {
    plan: 'Business',
    seats: 8,
    cycle: 'Monthly',
    nextInvoice: '2026-08-01'
  }

  const PAYMENT_METHOD = {
    brand: 'Mastercard',
    last4: '1702',
    expires: '02 / 2027',
    email: 'maria.silva@azion.com',
    autoRenewal: true
  }

  // Twelve months of history: the plan moved from Starter to Business in
  // February and the team grew through the year, so the Plan column and the
  // amounts both move for a reason. The amount is derived rather than typed —
  // a hand-written total is the one number that can drift from its own row.
  const INVOICES = [
    {
      seq: 132,
      id: 'INV-A12401',
      plan: 'Business',
      seats: 8,
      billingDate: '2026-07-01',
      status: 'Paid'
    },
    {
      seq: 131,
      id: 'INV-A12400',
      plan: 'Business',
      seats: 8,
      billingDate: '2026-06-01',
      status: 'Paid'
    },
    {
      seq: 130,
      id: 'INV-A12399',
      plan: 'Business',
      seats: 7,
      billingDate: '2026-05-01',
      status: 'Paid'
    },
    {
      seq: 129,
      id: 'INV-A12398',
      plan: 'Business',
      seats: 7,
      billingDate: '2026-04-01',
      status: 'Refunded'
    },
    {
      seq: 128,
      id: 'INV-A12397',
      plan: 'Business',
      seats: 7,
      billingDate: '2026-03-01',
      status: 'Paid'
    },
    {
      seq: 127,
      id: 'INV-A12396',
      plan: 'Business',
      seats: 6,
      billingDate: '2026-02-01',
      status: 'Paid'
    },
    {
      seq: 126,
      id: 'INV-A12395',
      plan: 'Starter',
      seats: 6,
      billingDate: '2026-01-01',
      status: 'Paid'
    },
    {
      seq: 125,
      id: 'INV-A12394',
      plan: 'Starter',
      seats: 6,
      billingDate: '2025-12-01',
      status: 'Paid'
    },
    {
      seq: 124,
      id: 'INV-A12393',
      plan: 'Starter',
      seats: 5,
      billingDate: '2025-11-01',
      status: 'Paid'
    },
    {
      seq: 123,
      id: 'INV-A12392',
      plan: 'Starter',
      seats: 5,
      billingDate: '2025-10-01',
      status: 'Paid'
    },
    {
      seq: 122,
      id: 'INV-A12391',
      plan: 'Starter',
      seats: 4,
      billingDate: '2025-09-01',
      status: 'Paid'
    },
    {
      seq: 121,
      id: 'INV-A12390',
      plan: 'Starter',
      seats: 4,
      billingDate: '2025-08-01',
      status: 'Paid'
    }
  ].map((invoice) => ({
    ...invoice,
    cycle: 'Monthly',
    amount: invoice.seats * SEAT_PRICE[invoice.plan]
  }))

  // Each skeleton cell mirrors the fact cell it stands in for — the bar width
  // follows the value it replaces, and a cell with a detail line (the seat price,
  // the masked card number) reserves that second line too. Without this the card
  // grew by the height of one line the moment the data landed.
  const SUBSCRIPTION_SKELETON = [
    { value: '116px' },
    { value: '104px', detail: '96px' },
    { value: '24px' },
    { value: '140px' },
    { value: '96px' }
  ]

  const PAYMENT_SKELETON = [
    { value: '120px', detail: '64px' },
    { value: '80px' },
    { value: '168px' },
    { value: '40px' }
  ]

  // --- Formatters (app logic, not design-system concerns) -------------------
  const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  // Built from the ISO parts rather than through `new Date`, which parses a bare
  // `YYYY-MM-DD` as UTC midnight and prints the previous day west of Greenwich.
  const formatDate = (iso) => {
    const [year, month, day] = iso.split('-')
    return `${day} ${MONTHS[Number(month) - 1]}, ${year}`
  }

  // Currency owns the `$` prefix; this only fixes the cents.
  const formatAmount = (value) => value.toFixed(2)

  // --- Load: the state surface all three bands hang off ---------------------
  const loading = ref(true)
  const error = ref('')
  const subscription = ref(null)
  const paymentMethod = ref(null)
  const invoices = ref([])

  // Stands in for the app's data layer (a query, a store, a fetch). Everything
  // downstream reads its outcome, never the constants above.
  const fetchBilling = () =>
    new Promise((resolve) => {
      globalThis.setTimeout(
        () =>
          resolve({
            subscription: SUBSCRIPTION,
            paymentMethod: PAYMENT_METHOD,
            invoices: INVOICES
          }),
        420
      )
    })

  const loadBilling = async () => {
    loading.value = true
    error.value = ''
    try {
      const billing = await fetchBilling()
      subscription.value = billing.subscription
      paymentMethod.value = billing.paymentMethod
      invoices.value = billing.invoices
    } catch (requestError) {
      error.value = requestError?.message ?? 'Check your connection and try again.'
      subscription.value = null
      paymentMethod.value = null
      invoices.value = []
    } finally {
      // Released on both paths, so a failure can never leave the view stuck in
      // its skeleton — and Table.RefreshButton (disabled while loading) unlocks.
      loading.value = false
    }
  }

  onMounted(loadBilling)

  const errorMessage = computed(() => `Could not load your billing data. ${error.value}`)

  const totalAmount = computed(() =>
    subscription.value
      ? formatAmount(subscription.value.seats * SEAT_PRICE[subscription.value.plan])
      : ''
  )

  const seatPrice = computed(() =>
    subscription.value ? formatAmount(SEAT_PRICE[subscription.value.plan]) : ''
  )

  // --- The invoice table ----------------------------------------------------
  // `id` is the principal (identity) column; `billingDate` and `amount` hold RAW
  // values (ISO date, number) so sorting and the numeric filters compare the
  // value rather than its formatting — the cell slots do the formatting.
  const invoiceColumns = [
    { accessorKey: 'seq', header: '№', label: 'Number', enableSorting: true },
    { accessorKey: 'id', header: 'Invoice ID', enableSorting: true, principal: true, grow: 2 },
    { accessorKey: 'plan', header: 'Plan', enableSorting: true },
    { accessorKey: 'cycle', header: 'Cycle', enableSorting: true },
    { accessorKey: 'seats', header: 'Seats', enableSorting: true },
    { accessorKey: 'billingDate', header: 'Billing date', enableSorting: true, grow: 2 },
    { accessorKey: 'amount', header: 'Amount', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // The filter set the design asks for, minus a Billing date field: the builder
  // coerces its date operators through Number(), which never matches an ISO
  // string — a filter that silently returns nothing is worse than no filter.
  // Chronology is served by the sortable column and by free-text search instead.
  const invoiceFilterFields = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Refunded', value: 'Refunded' },
        { label: 'Overdue', value: 'Overdue' }
      ]
    },
    {
      id: 'plan',
      label: 'Plan',
      type: 'select',
      options: [
        { label: 'Business', value: 'Business' },
        { label: 'Starter', value: 'Starter' }
      ]
    },
    {
      id: 'cycle',
      label: 'Cycle',
      type: 'select',
      options: [
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Yearly', value: 'Yearly' }
      ]
    },
    { id: 'seats', label: 'Seats', type: 'number' },
    { id: 'amount', label: 'Amount', type: 'number' }
  ]

  // Search and the applied conditions are host-owned, so the empty state can tell
  // "nothing matches" from "never invoiced" and clear both in one action.
  const search = ref('')
  const appliedFilters = ref([])
  const isFiltered = computed(() => search.value.length > 0 || appliedFilters.value.length > 0)

  const clearFilters = () => {
    search.value = ''
    appliedFilters.value = []
  }

  const invoiceStatusSeverity = (status) =>
    ({ Paid: 'success', Refunded: 'secondary', Overdue: 'danger' })[status] ?? 'secondary'

  const changePlan = () => toast.info('Plan management is disabled in the demo.')
  const updatePayment = () => toast.info('Payment method management is disabled in the demo.')
  const downloadInvoice = (event, invoice) => toast.success(`Downloading ${invoice.id}…`)
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto">
    <section
      class="layout-column layout-boundary flex min-w-0 flex-col"
    >
      <PageHeading
        title="Billing"
        description="Your plan, the card we charge, and every invoice we have issued."
      />
      <!-- The page's parent section: it spaces the bands below at
           --layout-section-gap, whichever branch renders. -->
      <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
        <!-- One request backs all three bands, so its failure is reported once, at
             view level, with the recovery attached to the message itself. -->
        <Message
          v-if="error"
          severity="danger"
          :label="errorMessage"
          action-label="Retry"
          @action="loadBilling"
        />

        <template v-else>
          <!-- Subscription details -->
          <div class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading
              title="Subscription details"
              description="An overview of your plan, seats, and next billing date."
              anchor
              :documentation="DOCS"
            >
              <template #actions>
                <Button
                  label="Change plan"
                  kind="primary"
                  size="medium"
                  icon="pi pi-arrow-up-right"
                  :disabled="loading"
                  @click="changePlan"
                />
              </template>
            </SectionHeading>
            <CardBox>
              <template #content>
                <!-- Skeletons in the grid's own shape, so the values land without
                     reflowing the card. -->
                <div
                  v-if="loading"
                  class="grid grid-cols-2 gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-md)] sm:grid-cols-3 xl:grid-cols-5"
                >
                  <div
                    v-for="(fact, index) in SUBSCRIPTION_SKELETON"
                    :key="index"
                    class="flex flex-col gap-[var(--spacing-xxs)]"
                  >
                    <Skeleton
                      kind="shape"
                      width="72px"
                      height="18px"
                    />
                    <Skeleton
                      kind="shape"
                      :width="fact.value"
                      height="30px"
                    />
                    <Skeleton
                      v-if="fact.detail"
                      kind="shape"
                      :width="fact.detail"
                      height="24px"
                    />
                  </div>
                </div>
                <!-- A description list, because every cell is a term and its value:
                     the label/value pairing is carried by the markup, not only by
                     the type scale. -->
                <dl
                  v-else
                  class="grid grid-cols-2 gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-md)] sm:grid-cols-3 xl:grid-cols-5"
                >
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <dt class="text-label-sm text-[var(--text-muted)]">Total amount</dt>
                    <dd class="min-w-0">
                      <Currency
                        :value="totalAmount"
                        size="large"
                        class="tabular-nums"
                      />
                    </dd>
                  </div>

                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <dt class="text-label-sm text-[var(--text-muted)]">Your plan</dt>
                    <!-- The seat price is stacked, not inline-with-wrap: at this
                         column width it wrapped on some viewports and sat beside the
                         name on others, so the cell changed height with the window.
                         Stacked, it is the same two lines everywhere. -->
                    <dd class="flex min-w-0 flex-col items-start gap-[var(--spacing-xxs)]">
                      <span class="max-w-full truncate text-heading-md text-[var(--text-default)]">
                        {{ subscription.plan }}
                      </span>
                      <Tag
                        :label="`$${seatPrice} / seat`"
                        severity="secondary"
                        size="medium"
                        rounded
                      />
                    </dd>
                  </div>

                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <dt class="text-label-sm text-[var(--text-muted)]">Seats</dt>
                    <dd class="text-heading-md tabular-nums text-[var(--text-default)]">
                      {{ subscription.seats }}
                    </dd>
                  </div>

                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <dt class="text-label-sm text-[var(--text-muted)]">Next invoice on</dt>
                    <dd class="text-heading-md tabular-nums text-[var(--text-default)]">
                      {{ formatDate(subscription.nextInvoice) }}
                    </dd>
                  </div>

                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <dt class="text-label-sm text-[var(--text-muted)]">Cycle</dt>
                    <dd class="text-heading-md text-[var(--text-default)]">
                      {{ subscription.cycle }}
                    </dd>
                  </div>
                </dl>
              </template>
            </CardBox>
          </div>

          <!-- Payment information -->
          <div class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading
              title="Payment information"
              description="The card we charge and the address invoices are sent to."
              anchor
            >
              <template #actions>
                <Button
                  label="Update"
                  kind="outlined"
                  size="medium"
                  :disabled="loading"
                  @click="updatePayment"
                />
              </template>
            </SectionHeading>
            <CardBox>
              <template #content>
                <div
                  v-if="loading"
                  class="grid grid-cols-2 gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-md)] xl:grid-cols-4"
                >
                  <div
                    v-for="(fact, index) in PAYMENT_SKELETON"
                    :key="index"
                    class="flex flex-col gap-[var(--spacing-xxs)]"
                  >
                    <Skeleton
                      kind="shape"
                      width="72px"
                      height="18px"
                    />
                    <Skeleton
                      kind="shape"
                      :width="fact.value"
                      height="24px"
                    />
                    <Skeleton
                      v-if="fact.detail"
                      kind="shape"
                      :width="fact.detail"
                      height="14px"
                    />
                  </div>
                </div>
                <!-- One step down the scale from the subscription grid: these are
                     settings the user confirms, not figures they read at a glance. -->
                <dl
                  v-else
                  class="grid grid-cols-2 gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-md)] xl:grid-cols-4"
                >
                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <dt class="text-label-sm text-[var(--text-muted)]">Card</dt>
                    <dd class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                      <span
                        class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[var(--shape-elements)] border-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                      >
                        <i
                          class="pi pi-credit-card text-body-lg leading-none text-[var(--text-default)]"
                          aria-hidden="true"
                        />
                      </span>
                      <span class="flex min-w-0 flex-col">
                        <span class="truncate text-label-lg text-[var(--text-default)]">
                          {{ paymentMethod.brand }}
                        </span>
                        <span class="text-body-xs tabular-nums text-[var(--text-muted)]">
                          <span class="sr-only">Card ending in {{ paymentMethod.last4 }}</span>
                          <span aria-hidden="true">•••• {{ paymentMethod.last4 }}</span>
                        </span>
                      </span>
                    </dd>
                  </div>

                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <dt class="text-label-sm text-[var(--text-muted)]">Expiry date</dt>
                    <dd class="text-label-lg tabular-nums text-[var(--text-default)]">
                      {{ paymentMethod.expires }}
                    </dd>
                  </div>

                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <dt class="text-label-sm text-[var(--text-muted)]">Billing email</dt>
                    <dd class="truncate text-label-lg text-[var(--text-default)]">
                      {{ paymentMethod.email }}
                    </dd>
                  </div>

                  <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                    <dt class="text-label-sm text-[var(--text-muted)]">Auto-renewal</dt>
                    <dd class="min-w-0">
                      <StatusIndicator
                        :severity="paymentMethod.autoRenewal ? 'success' : 'neutral'"
                        :label="paymentMethod.autoRenewal ? 'On' : 'Off'"
                      />
                    </dd>
                  </div>
                </dl>
              </template>
            </CardBox>
          </div>

          <!-- Invoices -->
          <div class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading
              title="Invoices"
              description="Your complete invoice history, including payment details."
              anchor
            />
            <!-- The band's CONTROLS: narrowing on the left, the band's own action on the
                 right, above the card — the same row every list in the console opens with. -->
            <ControlsHeader>
              <!-- Search drives the table's global filter from outside the card, so the field is
                   a plain InputText (`Table.Search` is context-aware and only works inside
                   `<Table>`). One horizontal band: it grows into the row's slack and compresses
                   rather than wrapping (see ui/ControlsHeader.vue). -->
              <InputText
                v-model="search"
                size="large"
                placeholder="Search invoices..."
                aria-label="Search invoices"
                class="min-w-36 grow basis-[var(--container-2xs)]"
              >
                <template #iconLeft>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </InputText>
            </ControlsHeader>

            <CardBox :padded="false">
              <template #content>
                <Table
                  v-model:globalFilter="search"
                  v-model:filters="appliedFilters"
                  :data="invoices"
                  :columns="invoiceColumns"
                  :filter-fields="invoiceFilterFields"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="loading"
                  export-filename="invoices.csv"
                  @refresh="loadBilling"
                >
                  <!-- House order, one size: Filter · Search · Refresh · Export ·
                       ColumnSelector, all `medium` so the row shares one height. -->
                  <template #toolbar>
                    <div class="flex w-full items-center gap-[var(--spacing-xs)]">
                      <Table.Filter :fields="invoiceFilterFields" />
                      <Table.RefreshButton />
                      <Table.Export />
                      <Table.ColumnSelector />
                    </div>
                  </template>

                  <template #filters>
                    <Table.AppliedFilters />
                  </template>

                  <!-- Two empties, two copies: a filter that matches nothing is
                       recoverable in one click; a history that has not started yet
                       is not the same problem. -->
                  <template #empty>
                    <EmptyState
                      key="empty-state-1"
                      v-if="isFiltered"
                      size="small"
                      icon="pi pi-filter-slash"
                      title="No invoices match these filters"
                      description="Widen the search or clear the filters to see the rest of your history."
                    >
                      <template #actions>
                        <Button
                          label="Clear filters"
                          kind="outlined"
                          size="medium"
                          @click="clearFilters"
                        />
                      </template>
                    </EmptyState>
                    <EmptyState
                      key="empty-state-2"
                      v-else
                      size="small"
                      icon="pi pi-file"
                      title="No invoices yet"
                      description="Your first invoice appears here once the first billing cycle closes."
                    >
                      <template #actions>
                        <Button
                          label="Billing documentation"
                          kind="outlined"
                          size="medium"
                          icon="pi pi-external-link"
                          :href="DOCS"
                        />
                      </template>
                    </EmptyState>
                  </template>

                  <!-- The sequence number orders the history; the Invoice ID
                       identifies it, so only one of the two is emphasized. -->
                  <template #cell-seq="{ value }">
                    <span class="tabular-nums text-[var(--text-muted)]">{{ value }}</span>
                  </template>

                  <template #cell-seats="{ value }">
                    <span class="tabular-nums">{{ value }}</span>
                  </template>

                  <template #cell-billingDate="{ value }">
                    <span class="tabular-nums">{{ formatDate(value) }}</span>
                  </template>

                  <template #cell-amount="{ value }">
                    <Currency
                      :value="formatAmount(value)"
                      size="small"
                      class="tabular-nums"
                    />
                  </template>

                  <template #cell-status="{ value }">
                    <Tag
                      :label="value"
                      :severity="invoiceStatusSeverity(value)"
                      size="medium"
                    />
                  </template>

                  <template #cell-actions="{ row }">
                    <Tooltip text="Download invoice">
                      <IconButton
                        icon="pi pi-download"
                        kind="outlined"
                        size="small"
                        :aria-label="`Download invoice ${row.id}`"
                        @click="(event) => downloadInvoice(event, row)"
                      />
                    </Tooltip>
                  </template>
                </Table>
              </template>
            </CardBox>
          </div>
        </template>
      </section>
    </section>
  </div>
</template>
