<script setup>
  // Settings → Billing. What the workspace pays, the card it is charged to, and
  // the invoice history behind both.
  //
  // THREE BANDS, TWO SHAPES. The subscription and the payment method are FACT
  // GRIDS — a <dl> of label-over-value cells inside a CardBox — because every
  // value there is a readout with no action of its own; each band's single action
  // lives on its SectionHeading, so the card stays pure data. The invoices are a
  // data-driven Table (`:data` + `:columns`) under the house CONTROLS ROW order
  // (Filter · Search · … · Refresh · Download CSV · Columns — narrowing left, the
  // three that act on the listing right), every control at `medium` so the row
  // shares one 32px height. Nothing is left inside the card's own toolbar.
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
  // fact grids read fine at that width. The view owns its own scroll region because the
  // shell hands each tab a plain flex column (see AccountSettings.vue) — so the page is a
  // COLUMN: heading, then the tab bar, then the one region that scrolls. The heading and
  // the bands sit on the page column; the TAB BAR does not, because it is full bleed (its
  // border is the header's edge and runs the whole width of the content zone).
  //
  // HEADING SCALE — `large` on the page title, and the invoice band takes a `small`
  // PageHeading rather than a SectionHeading: the band is this page's payload, with its
  // own controls, filters and pagination, and a muted section label titles a card, not
  // that. The two Payment-tab bands stay SectionHeadings — they title fact grids, and
  // each one's single action lives on that heading so the card stays pure data.
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
  import { useRoute, useRouter } from 'vue-router'

  import ChangePlanDrawer from '../../../components/billing/ChangePlanDrawer.vue'
  import PlanUpgradeDrawer from '../../../components/billing/PlanUpgradeDrawer.vue'
  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import FilterButton from '../../../components/list/FilterButton.vue'
  import FilterChips from '../../../components/list/FilterChips.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import PageTabs from '../../../components/page/PageTabs.vue'
  import SectionHeading from '../../../components/page/SectionHeading.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../../lib/behavior/filter-bar'
  import { useListFilters } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../../lib/behavior/table-columns'
  import { defaultPaymentMethod, PAYMENT_METHODS } from '../../../lib/data/payment-methods'
  import { planFor, planNameFor } from '../../../lib/data/plans'
  import { useSamplePreset } from '../../../lib/state/sample-preset'

  const DOCS = 'https://www.azion.com/en/documentation/'

  // --- The records the view reads ------------------------------------------
  // Pricing is per seat, so the figures on this page reconcile with each other:
  // seats × the plan's seat price IS the amount, on the subscription card and on
  // every invoice row. Nothing on the screen can quietly disagree.
  const SEAT_PRICE = { Business: 40, Starter: 20 }

  const PLAN_START = 'Jan 25, 2023'

  const SUBSCRIPTION = {
    plan: 'Business',
    seats: 8,
    cycle: 'Monthly',
    nextInvoice: '2026-08-01'
  }

  // The cards on the account. A LIST, because an account routinely has more than one
  // (see ../../lib/data/payment-methods.js) — the band above still shows the DEFAULT,
  // which is the one figure a reader wants without scrolling.
  const paymentMethods = ref([...PAYMENT_METHODS])
  const paymentColumns = [
    {
      accessorKey: 'holder',
      header: 'Card Holder',
      enableSorting: true,
      principal: true,
      hideable: false,
      grow: 2
    },
    { accessorKey: 'cardNumber', header: 'Card Number', grow: 2 },
    {
      accessorKey: 'expires',
      header: 'Expiration Date',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const paymentActions = [
    { label: 'Set as default', value: 'default', icon: 'pi pi-check-circle' },
    { label: 'Remove', value: 'remove', icon: 'pi pi-trash', danger: true }
  ]

  const onPaymentAction = (event, action, card) => {
    if (action === 'default') {
      paymentMethods.value = paymentMethods.value.map((item) => ({
        ...item,
        default: item.id === card.id
      }))
      toast.success(`${card.brand} •••• ${card.last4} is now the default.`)
      return
    }
    // The default card cannot be removed: an account with invoices and no card to
    // charge is a state the console should not be able to reach from this menu.
    if (card.default) {
      toast.error('Set another card as the default before removing this one.')
      return
    }
    paymentMethods.value = paymentMethods.value.filter((item) => item.id !== card.id)
    toast.success(`${card.brand} •••• ${card.last4} removed.`)
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
  const defaultCard = defaultPaymentMethod()

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
    // The real instant beside the ISO string, so the Billing date field can compare
    // it — `withinRange` takes a Date and a string would silently match nothing.
    billedAt: new Date(invoice.billingDate),
    amount: invoice.seats * SEAT_PRICE[invoice.plan],
    // Derived from the account's default card rather than typed per row: an invoice
    // charged to a card the account does not have is the kind of seed drift a reader
    // spots instantly and cannot explain.
    paymentMethod: `${defaultCard.brand} •••• ${defaultCard.last4}`
  }))

  // Each skeleton cell mirrors the fact cell it stands in for — the bar width
  // follows the value it replaces, and a cell with a detail line (the seat price,
  // the masked card number) reserves that second line too. Without this the card
  // grew by the height of one line the moment the data landed.

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
      stampUpdate()
    } catch (requestError) {
      error.value = requestError?.message ?? 'Check your connection and try again.'
      subscription.value = null
      paymentMethod.value = null
      invoices.value = []
    } finally {
      // Released on both paths, so a failure can never leave the view stuck in
      // its skeleton — and the controls row's Refresh (disabled while loading)
      // unlocks.
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

  // --- The invoice table ----------------------------------------------------
  // `id` is the principal (identity) column; `billingDate` and `amount` hold RAW
  // values (ISO date, number) so sorting and the numeric filters compare the
  // value rather than its formatting — the cell slots do the formatting.
  const invoiceColumns = [
    { accessorKey: 'seq', header: '№', label: 'Number', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'id',
      header: 'Invoice ID',
      enableSorting: true,
      principal: true,
      hideable: false,
      grow: 2
    },
    { accessorKey: 'plan', header: 'Plan', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'cycle', header: 'Cycle', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'seats', header: 'Seats', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'billingDate',
      header: 'Billing date',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { accessorKey: 'amount', header: 'Amount', enableSorting: true, minWidth: FIT_COLUMN },
    // Which card was charged. The console carries it on the invoice row because "why
    // did THIS one fail" is answered by the card, not by the amount.
    { accessorKey: 'paymentMethod', header: 'Payment Method', grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // Which columns are switched off, driven by the Columns button on the controls row
  // (../../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever recorded.
  //
  // Nine columns, the widest table on the account side — and the one most likely to be
  // read for a single question ("which of these failed", "what did April cost"), so the
  // ability to put six of them away is worth more here than anywhere else.
  //
  // `Invoice ID` is the PRINCIPAL column here, so it is locked on rather than hidden by
  // default the way a secondary `ID` is elsewhere: it is what an invoice IS called, not
  // a machine key beside a name.
  const columnVisibility = ref({})

  // ── The filter catalog ────────────────────────────────────────────────────
  // The same bar every list in the console carries (the webkit-lists skill), not the
  // table's own field/operator/value builder. Every one of these narrows by
  // MEMBERSHIP — is this invoice's status one of these — so an operator column would
  // have offered `is one of` on every row.
  //
  // Billing date is a real field again. It could not be one under the builder, whose
  // date operators coerce through Number() and never match an ISO string — a filter
  // that silently returns nothing. The bar compares `billedAt`, the instant derived
  // beside the string above, so chronology is one click instead of a sort plus a scan.
  //
  // Seats and Amount are gone, and deliberately: they are magnitudes, not categories.
  // A membership field over them offers one option per distinct value — twelve chips
  // that each match one row — and what people actually ask ("over $500") is a
  // comparison the search field and the sortable column already serve.
  const invoiceFilterFields = [
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Paid', label: 'Paid' },
        { value: 'Refunded', label: 'Refunded' },
        { value: 'Overdue', label: 'Overdue' }
      ],
      match: (invoice, values) => values.includes(invoice.status)
    },
    {
      id: 'plan',
      label: 'Plan',
      kind: 'options',
      options: [
        { value: 'Business', label: 'Business' },
        { value: 'Starter', label: 'Starter' }
      ],
      match: (invoice, values) => values.includes(invoice.plan)
    },
    {
      id: 'cycle',
      label: 'Cycle',
      kind: 'options',
      options: [
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Yearly', label: 'Yearly' }
      ],
      match: (invoice, values) => values.includes(invoice.cycle)
    },
    {
      id: 'billed',
      label: 'Billing date',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (invoice, values) => matchDate(invoice.billedAt, values)
    }
  ]

  // Search and the applied filters are host-owned, so the empty state can tell
  // "nothing matches" from "never invoiced" and clear both in one action.
  const {
    filters,
    search,
    pagination,
    visibleRows: visibleInvoices
  } = useListFilters(invoiceFilterFields, invoices)

  // The invoice table the controls row drives — Download CSV calls its `exportCsv()`
  // (../../../components/list/ExportButton.vue), so the file honours the visible
  // columns and the filtered rows.
  const invoicesTableRef = ref(null)

  const isFiltered = computed(
    () => search.value.length > 0 || Object.values(filters.value).some((values) => values?.length)
  )

  const clearFilters = () => {
    search.value = ''
    filters.value = {}
  }

  const invoiceStatusSeverity = (status) =>
    ({ Paid: 'success', Refunded: 'secondary', Overdue: 'danger' })[status] ?? 'secondary'

  const route = useRoute()
  const router = useRouter()

  // The two questions this page answers, in the console's own order and words.
  const BILLING_TABS = [
    { value: 'bills', label: 'Bills' },
    { value: 'payment-methods', label: 'Payment Methods' }
  ]

  // The active tab lives in `?tab=`, so it survives a reload and is linkable — the same
  // contract every tabbed resource in this console keeps. `replace`, not `push`: moving
  // between two views of one page is not a step the Back button should have to undo.
  const activeTab = computed({
    get: () =>
      BILLING_TABS.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'bills',
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

  // When the figures were last read. A real timestamp, formatted the way the design
  // spells it, so the refresh beside it has something to change.
  const lastUpdate = ref('')
  const stampUpdate = () => {
    lastUpdate.value = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // The four label→value rows of the Subscription Plan card. A list rather than four
  // hand-written rows: they render identically, and the one that differs (an unset
  // charge shows the design's `--`) differs in its VALUE, not in its markup.
  const DASH = '--'
  const planFacts = computed(() => [
    { label: 'Plan Start Date', value: PLAN_START },
    {
      label: 'Next Charge Date',
      value: subscription.value ? formatDate(subscription.value.nextInvoice) : DASH
    },
    { label: 'Next Charge Value', value: subscription.value ? `$ ${totalAmount.value}` : DASH },
    {
      label: 'Payment Method',
      value: defaultCard ? `${defaultCard.brand} •••• ${defaultCard.last4}` : DASH
    }
  ])

  // ── THE UPGRADE PATH IS THE ONBOARDING ONE ──
  //
  // The tier this card offers, its name, and every line of what it buys come from the
  // plan catalog (../../../lib/data/plans.js) — the same record the entrance's plan
  // step renders and the same one the upgrade drawer reads. This card used to carry a
  // typed list of eight perks, which is exactly how a billing page ends up advertising
  // a limit the rest of the console does not sell: the catalog moves, the array does
  // not, and nothing fails.
  const upgradePlan = planFor('pro')

  // `{ title, detail }`, the shape the drawer renders. The card shows the titles —
  // it is a teaser standing next to the plan the account is on, not the contract — and
  // the metered rate after each allowance is read in the drawer behind the button.
  const proPerks = computed(() => upgradePlan.upgrade.features)

  // Both buttons open the surfaces the ENTRANCE already uses, instead of reporting
  // that the demo cannot do this: ChangePlanDrawer answers "which tier", and
  // PlanUpgradeDrawer — the onboarding flow's own payment step — answers "this one,
  // and here is the card". One payment surface for the whole sample; two places a
  // contract can be agreed to is the one thing a billing flow must not have.
  const { setPlan } = useSamplePreset()
  const changePlanOpen = ref(false)
  const upgradeOpen = ref(false)

  const changePlan = () => {
    changePlanOpen.value = true
  }

  const upgrade = () => {
    upgradeOpen.value = true
  }

  // Paid through the tier card. The preset is what the header tag, the organization
  // row and the switcher all read, so writing it here is what keeps the console from
  // saying two different things about the same account.
  const onUpgradeConfirm = ({ planId }) => {
    setPlan(planId)
    toast.success(`You are now on ${planNameFor(planId)}.`, {
      description: 'The next invoice is charged on the new contract.'
    })
  }

  // Paid through the comparison drawer, which has already written the tier itself —
  // all that is left is to say so.
  const onPlanChanged = (planId) => {
    toast.success(`You are now on ${planNameFor(planId)}.`, {
      description: 'The next invoice is charged on the new contract.'
    })
  }

  const updatePayment = () => toast.info('Payment method management is disabled in the demo.')
  const downloadInvoice = (event, invoice) => toast.success(`Downloading ${invoice.id}…`)
</script>

<template>
  <!-- THE PAGE IS A COLUMN, not one scroll box: the heading and the tab bar are the page's
       header and they stay put, and only the region under them scrolls. That is what lets
       the tab bar be FULL BLEED — its bottom border runs the whole width of the content
       zone and reads as the edge of the header, the same shape every tabbed page in the
       console has (../../applications/ApplicationDetail.vue). Inside a capped, inset
       column the same bar drew a rule that stopped short of both edges and scrolled away,
       which is a rule about nothing. -->
  <div class="flex h-full min-w-0 flex-col">
    <!-- The heading keeps the page column: it is CONTENT, and it lines up with the bands
         below. Only the inline half of the boundary plus the boundary's own top step —
         the bottom step belongs to the tab bar, which brings its own. -->
    <header
      class="layout-column layout-boundary-inline flex min-w-0 shrink-0 flex-col pt-(--layout-boundary-start) pb-(--spacing-md)"
    >
      <PageHeading
        title="Billing"
        size="large"
        description="View and manage invoices, payments, and subscription details."
        :documentation="DOCS"
      >
        <!-- The heading's end slot (Figma 314:13901): when the figures were last read,
             and the way to read them again. A timestamp with no way to refresh is a
             number the reader can only distrust. -->
        <template #actions>
          <span class="text-label-md text-(--text-default)">Last Update: {{ lastUpdate }}</span>
          <Tooltip text="Refresh">
            <IconButton
              icon="pi pi-refresh"
              kind="outlined"
              size="medium"
              ariaLabel="Refresh billing data"
              :loading="loading"
              @click="loadBilling"
            />
          </Tooltip>
        </template>
      </PageHeading>
    </header>

    <!-- THE TABS ARE TOP LEVEL and FULL BLEED: directly under the page heading, above
         everything the page shows, and spanning the whole content zone. They name the two
         things this page IS, so nothing may sit between them and the heading — a band
         above the bar reads as page chrome that the tabs then contradict by swapping the
         content under it. Because they sit outside the page column they are also the one
         element here that is NOT capped or inset: the bar is the header's edge, and an
         edge stops at the edge. -->
    <PageTabs
      v-model:value="activeTab"
      :tabs="BILLING_TABS"
    />

    <!-- Only this region scrolls, so the heading and the bar above it stay while the
         bands move under them. -->
    <div class="min-h-0 flex-1 overflow-auto">
      <!-- The page's parent section: back on the page column, and it spaces the bands at
           --layout-section-gap whichever branch renders. `layout-boundary` rather than the
           boundary's start step, because the bar above already closed the header — this is
           the top of a scroll region, not the top of the page. -->
      <section
        class="layout-column layout-boundary flex min-w-0 flex-col gap-(--layout-section-gap)"
      >
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
          <template v-if="activeTab === 'bills'">
            <!-- THE PLAN, TWO CARDS SIDE BY SIDE (Figma 314:13901). The left one states
               what you are on; the right one states what you would get by moving. They
               are a PAIR — the upgrade only means something read against the current
               plan — so they share a row rather than stacking, and the row wraps whole
               below `lg` instead of letting either card become a column of scraps. -->
            <div class="flex min-w-0 flex-col items-stretch gap-(--layout-group-gap) lg:flex-row">
              <!-- Subscription Plan. `lg:w-[45%]` rather than an even split: the facts on
                 the left are short label/value rows, the list on the right is eight
                 items in two columns and needs the width. -->
              <CardBox class="min-w-0 lg:w-[45%]">
                <template #header>
                  <div class="flex min-w-0 items-center justify-between gap-(--spacing-md)">
                    <span class="text-label-lg text-(--text-default)">Subscription Plan</span>
                    <Button
                      label="Change Plan"
                      kind="outlined"
                      size="medium"
                      :disabled="loading"
                      @click="changePlan"
                    />
                  </div>
                </template>
                <template #content>
                  <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <Skeleton
                        v-if="loading"
                        kind="shape"
                        width="120px"
                        height="20px"
                      />
                      <template v-else>
                        <span class="truncate text-label-lg text-(--text-default)">
                          {{ subscription.plan }}
                        </span>
                        <Tag
                          label="Actual Plan"
                          severity="secondary"
                          size="medium"
                        />
                      </template>
                    </div>

                    <!-- A description list, not a grid of facts: each row is one
                       label→value pair and the value is right-aligned, so the four
                       read as a column of answers rather than four separate cards. -->
                    <dl class="flex min-w-0 flex-col gap-(--spacing-sm)">
                      <div
                        v-for="fact in planFacts"
                        :key="fact.label"
                        class="flex min-w-0 items-center justify-between gap-(--spacing-md)"
                      >
                        <dt class="shrink-0 text-label-md text-(--text-muted)">{{ fact.label }}</dt>
                        <dd class="min-w-0 truncate text-label-md text-(--text-default)">
                          <Skeleton
                            v-if="loading"
                            kind="shape"
                            width="80px"
                            height="14px"
                          />
                          <template v-else>{{ fact.value }}</template>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </template>
                <template #footer>
                  <!-- `w-full`: CardBox lays its footer out `justify-center`, so a child
                       that does not fill the width is centred. The sentence is a note on
                       the facts above it, and a note reads from the left edge they do. -->
                  <p class="w-full text-body-xs text-(--text-default)">
                    This invoice includes all consumption up to the last day of the month.
                  </p>
                </template>
              </CardBox>

              <!-- Upgrade to Pro. The limits come from the plan catalog
                 (../../lib/data/plans.js) rather than being typed here, so the card
                 cannot advertise a tier the rest of the console does not sell. -->
              <CardBox class="min-w-0 flex-1">
                <template #header>
                  <span class="text-label-lg text-(--text-default)">
                    Upgrade to {{ upgradePlan.name }}
                  </span>
                </template>
                <template #content>
                  <div class="flex min-w-0 flex-col justify-between gap-(--spacing-lg)">
                    <ul
                      class="grid min-w-0 grid-cols-1 gap-(--spacing-sm) sm:grid-cols-2"
                      role="list"
                    >
                      <li
                        v-for="perk in proPerks"
                        :key="perk.title"
                        class="flex min-w-0 items-center gap-(--spacing-xs)"
                      >
                        <!-- `--success-contrast`, not `--success`: the pair is a FILL and
                             the ink that goes on it, so `text-(--success)` paints the
                             glyph in the swatch colour — #0A2916 on a dark surface, a
                             pale mint on a light one. Invisible in both themes, and
                             nothing catches it: the class compiles, the var resolves. -->
                        <i
                          class="pi pi-check shrink-0 text-body-sm text-(--success-contrast)"
                          aria-hidden="true"
                        />
                        <span class="min-w-0 truncate text-label-sm text-(--text-default)">
                          {{ perk.title }}
                        </span>
                      </li>
                    </ul>
                    <p class="text-body-sm text-(--text-muted)">
                      Upgrade to unlock higher limits and keep your applications running at scale.
                      Explore additional capabilities available with the
                      {{ upgradePlan.name }} plan:
                    </p>
                  </div>
                </template>
                <template #footer>
                  <!-- `w-full` for the same reason: without it this row is only as
                       wide as its own content and `justify-between` has nothing to
                       distribute, so the note and its button sit centred as one clump
                       instead of the note starting at the card's left edge and the
                       action ending at its right. -->
                  <div
                    class="flex w-full min-w-0 flex-wrap items-center justify-between gap-(--spacing-md)"
                  >
                    <p class="text-body-xs text-(--text-default)">
                      Learn more about
                      <a
                        :href="DOCS"
                        target="_blank"
                        rel="noreferrer"
                        class="text-(--text-link) hover:underline"
                        >Pricing and Plans.</a
                      >
                    </p>
                    <Button
                      :label="`Upgrade to ${upgradePlan.name}`"
                      kind="primary"
                      size="medium"
                      :disabled="loading"
                      @click="upgrade"
                    />
                  </div>
                </template>
              </CardBox>
            </div>

            <!-- Invoices. A PAGE HEADING at its small scale, not a section heading: the
                 band is the page's payload — a full list with its own controls, its own
                 filters and its own pagination — and a muted `text-heading-xxs` label
                 titles a card, not that. It is the same treatment every band of this
                 weight takes (../../workloads/WorkloadDetail.vue: Active Deployment,
                 Version History). -->
            <div class="flex flex-col gap-(--layout-group-gap)">
              <PageHeading
                title="Invoices"
                description="Your complete invoice history, including payment details."
                size="small"
              />
              <!-- The band's CONTROLS: narrowing on the left, the band's own action on the
                   right, above the card — the same row every list in the console opens with. -->
              <ControlsHeader>
                <FilterButton
                  v-model="filters"
                  :fields="invoiceFilterFields"
                />
                <!-- Search drives the table's global filter from outside the card, so the field is
                     a plain InputText (`Table.Search` is context-aware and only works inside
                     `<Table>`). One horizontal band: it grows into the row's slack and compresses
                     rather than wrapping (see ui/ControlsHeader.vue). -->
                <InputText
                  v-model="search"
                  size="medium"
                  placeholder="Search invoices"
                  aria-label="Search invoices"
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
                       than narrow it — fetch it again, take it away as a file, choose
                       which columns it shows. These two used to render in the table's
                       own `#toolbar`, as `Table.RefreshButton` / `Table.Export`; they
                       came up to this row so the whole console shows one controls row
                       instead of a second band of controls inside the card on this one
                       page. Refresh here drives the page's real `loadBilling()`, which
                       is what the toolbar's context-aware pair was signalling anyway. -->
                  <RefreshButton
                    :loading="loading"
                    @refresh="loadBilling"
                  />
                  <ExportButton
                    :table="invoicesTableRef"
                    filename="invoices.csv"
                  />
                  <ColumnsButton
                    v-model="columnVisibility"
                    :columns="invoiceColumns"
                  />
                </template>
              </ControlsHeader>

              <FilterChips
                v-model="filters"
                :fields="invoiceFilterFields"
              />

              <CardBox :padded="false">
                <template #content>
                  <!-- NO `#toolbar`. Narrowing, the column picker, Refresh and Download
                       CSV are all on the controls row above the card now, which is the
                       shape every other list in the console has — so the card is a frame
                       around data only, with no second row of controls inside it. -->
                  <Table
                    ref="invoicesTableRef"
                    v-model:pagination="pagination"
                    v-model:globalFilter="search"
                    v-model:columnVisibility="columnVisibility"
                    :data="visibleInvoices"
                    :columns="invoiceColumns"
                    row-key="id"
                    enable-sorting
                    paginated
                    :page-size="8"
                    :border="false"
                    :loading="loading"
                    export-filename="invoices.csv"
                  >
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
                      <span class="tabular-nums text-(--text-muted)">{{ value }}</span>
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

          <template v-else>
            <!-- Payment information -->
            <div class="flex flex-col gap-(--layout-group-gap)">
              <SectionHeading
                title="Payment information"
                description="Where invoices are sent, and whether the plan renews on its own."
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
                    class="grid grid-cols-2 gap-x-(--spacing-lg) gap-y-(--spacing-md) xl:grid-cols-4"
                  >
                    <div
                      v-for="(fact, index) in PAYMENT_SKELETON"
                      :key="index"
                      class="flex flex-col gap-(--spacing-xxs)"
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
                    class="grid grid-cols-2 gap-x-(--spacing-lg) gap-y-(--spacing-md) xl:grid-cols-4"
                  >
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <dt class="text-label-sm text-(--text-muted)">Billing email</dt>
                      <dd class="truncate text-label-lg text-(--text-default)">
                        {{ paymentMethod.email }}
                      </dd>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <dt class="text-label-sm text-(--text-muted)">Auto-renewal</dt>
                      <dd class="min-w-0">
                        <StatusIndicator
                          :severity="paymentMethod.autoRenewal ? 'success' : 'secondary'"
                          :label="paymentMethod.autoRenewal ? 'On' : 'Off'"
                        />
                      </dd>
                    </div>
                  </dl>
                </template>
              </CardBox>
            </div>

            <!-- Payment methods. The band above states the DEFAULT card as a fact; this
                 is the full set, because an account routinely has more than one and only
                 a list can say which of them is the one being charged. Three columns, the
                 console's own (../../lib/data/payment-methods.js). -->
            <div class="flex flex-col gap-(--layout-group-gap)">
              <SectionHeading
                title="Payment methods"
                description="Every card on the account. Invoices are charged to the default one."
                anchor
              >
                <template #actions>
                  <Button
                    label="Add payment method"
                    kind="outlined"
                    size="medium"
                    icon="pi pi-plus"
                    :disabled="loading"
                    @click="updatePayment"
                  />
                </template>
              </SectionHeading>
              <!-- No controls row: three columns and three rows have nothing to narrow,
                   and a band with one lone Columns button reads as a row that lost its
                   search field. -->
              <CardBox :padded="false">
                <template #content>
                  <Table
                    :data="paymentMethods"
                    :columns="paymentColumns"
                    row-key="id"
                    enable-sorting
                    :border="false"
                    :loading="loading"
                    :row-actions="paymentActions"
                    @row-action="onPaymentAction"
                  >
                    <!-- The default is marked on the holder, not in a column of its own:
                         it is a property of ONE row, so a whole column would be empty on
                         every other one. -->
                    <template #cell-holder="{ row, value }">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span class="truncate">{{ value }}</span>
                        <Tag
                          v-if="row.default"
                          label="Default"
                          severity="success"
                          size="small"
                        />
                      </span>
                    </template>

                    <template #cell-cardNumber="{ row, value }">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <i
                          class="pi pi-credit-card shrink-0 text-(--text-muted)"
                          aria-hidden="true"
                        />
                        <span class="truncate">{{ value }}</span>
                        <span class="sr-only">{{ row.brand }} ending in {{ row.last4 }}</span>
                      </span>
                    </template>
                  </Table>
                </template>
              </CardBox>
            </div>
          </template>
        </template>
      </section>
    </div>

    <!-- ── THE ENTRANCE'S TWO PLAN SURFACES, REUSED ──
         Neither is a page: both are drawers, so the reader keeps their place in the
         billing history behind them. `Change Plan` compares the three tiers and is
         handed the question it is answering, the way every other caller hands it one
         (../../../components/shell/TenancySwitcher.vue) — this one is asked from the
         subscription card, so the question is about the contract itself. `Upgrade to
         <tier>` skips the comparison and goes straight to the entrance's payment
         step, because the button already named the tier. -->
    <ChangePlanDrawer
      v-model:open="changePlanOpen"
      title="Change plan"
      reason="Compare what each tier includes before moving the account onto it."
      @upgraded="onPlanChanged"
    />
    <PlanUpgradeDrawer
      v-model:open="upgradeOpen"
      :plan-id="upgradePlan.id"
      @confirm="onUpgradeConfirm"
    />
  </div>
</template>
