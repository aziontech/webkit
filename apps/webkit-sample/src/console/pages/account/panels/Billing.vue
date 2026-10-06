<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Currency from '@aziontech/webkit/currency'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TableRoot from '@aziontech/webkit/table-root'
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

  const SEAT_PRICE = { Business: 40, Starter: 20 }

  const PLAN_START = 'Jan 25, 2023'

  const SUBSCRIPTION = {
    plan: 'Business',
    seats: 8,
    cycle: 'Monthly',
    nextInvoice: '2026-08-01'
  }

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
    billedAt: new Date(invoice.billingDate),
    amount: invoice.seats * SEAT_PRICE[invoice.plan],
    paymentMethod: `${defaultCard.brand} •••• ${defaultCard.last4}`
  }))

  const PAYMENT_SKELETON = [
    { value: '120px', detail: '64px' },
    { value: '80px' },
    { value: '168px' },
    { value: '40px' }
  ]

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

  const formatDate = (iso) => {
    const [year, month, day] = iso.split('-')
    return `${day} ${MONTHS[Number(month) - 1]}, ${year}`
  }

  const formatAmount = (value) => value.toFixed(2)

  const loading = ref(true)
  const error = ref('')
  const subscription = ref(null)
  const paymentMethod = ref(null)
  const invoices = ref([])

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
    { accessorKey: 'paymentMethod', header: 'Payment Method', grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const columnVisibility = ref({})

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

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleInvoices
  } = useListFilters(invoiceFilterFields, invoices)

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

  const BILLING_TABS = [
    { value: 'bills', label: 'Bills' },
    { value: 'payment-methods', label: 'Payment Methods' }
  ]

  const activeTab = computed({
    get: () =>
      BILLING_TABS.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'bills',
    set: (value) => router.replace({ query: { ...route.query, tab: value } })
  })

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

  const upgradePlan = planFor('pro')

  const proPerks = computed(() => upgradePlan.upgrade.features)

  const { setPlan } = useSamplePreset()
  const changePlanOpen = ref(false)
  const upgradeOpen = ref(false)

  const changePlan = () => {
    changePlanOpen.value = true
  }

  const upgrade = () => {
    upgradeOpen.value = true
  }

  const onUpgradeConfirm = ({ planId }) => {
    setPlan(planId)
    toast.success(`You are now on ${planNameFor(planId)}.`, {
      description: 'The next invoice is charged on the new contract.'
    })
  }

  const onPlanChanged = (planId) => {
    toast.success(`You are now on ${planNameFor(planId)}.`, {
      description: 'The next invoice is charged on the new contract.'
    })
  }

  const updatePayment = () => toast.info('Payment method management is disabled in the demo.')
  const downloadInvoice = (event, invoice) => toast.success(`Downloading ${invoice.id}…`)
</script>

<template>
  <div class="flex h-full min-w-0 flex-col">
    <header
      class="layout-column layout-boundary-inline flex min-w-0 shrink-0 flex-col pt-(--layout-boundary-start) pb-(--spacing-md)"
    >
      <PageHeading
        title="Billing"
        size="large"
        description="View and manage invoices, payments, and subscription details."
        :documentation="DOCS"
      >
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

    <PageTabs
      v-model:value="activeTab"
      :tabs="BILLING_TABS"
      column="data"
    />

    <div class="min-h-0 flex-1 overflow-auto">
      <section
        class="@container/bands layout-column layout-boundary flex min-w-0 flex-col gap-(--layout-section-gap)"
      >
        <Message
          v-if="error"
          severity="danger"
          :label="errorMessage"
          action-label="Retry"
          @action="loadBilling"
        />

        <template v-else>
          <template v-if="activeTab === 'bills'">
            <div
              class="flex min-w-0 flex-col items-stretch gap-(--layout-group-gap) @4xl/bands:flex-row"
            >
              <CardBox class="min-w-0 @4xl/bands:w-[45%]">
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
                  <p class="w-full text-body-xs text-(--text-default)">
                    This invoice includes all consumption up to the last day of the month.
                  </p>
                </template>
              </CardBox>

              <CardBox class="@container/plan min-w-0 flex-1">
                <template #header>
                  <span class="text-label-lg text-(--text-default)">
                    Upgrade to {{ upgradePlan.name }}
                  </span>
                </template>
                <template #content>
                  <div class="flex min-w-0 flex-col justify-between gap-(--spacing-lg)">
                    <ul
                      class="grid min-w-0 grid-cols-1 gap-(--spacing-sm) @md/plan:grid-cols-2"
                      role="list"
                    >
                      <li
                        v-for="perk in proPerks"
                        :key="perk.title"
                        class="flex min-w-0 items-center gap-(--spacing-xs)"
                      >
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

            <div class="flex flex-col gap-(--layout-group-gap)">
              <PageHeading
                title="Invoices"
                description="Your complete invoice history, including payment details."
                size="small"
              />
              <ControlsHeader>
                <FilterButton
                  v-model="filters"
                  :fields="invoiceFilterFields"
                />
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
                  <TableRoot
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
                  </TableRoot>
                </template>
              </CardBox>
            </div>
          </template>

          <template v-else>
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
              <CardBox :padded="false">
                <template #content>
                  <TableRoot
                    :data="paymentMethods"
                    :columns="paymentColumns"
                    row-key="id"
                    enable-sorting
                    :border="false"
                    :loading="loading"
                    :row-actions="paymentActions"
                    @row-action="onPaymentAction"
                  >
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
                  </TableRoot>
                </template>
              </CardBox>
            </div>
          </template>
        </template>
      </section>
    </div>

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
