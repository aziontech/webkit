<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import { type DropdownMenuItemValue } from '@aziontech/ui/dropdown-menu'
  import IconButton from '@aziontech/ui/icon-button'
  import PageHeader from '@aziontech/ui/page-header'
  import PageTabs from '@aziontech/ui/page-tabs'
  import Tabs from '@aziontech/ui/tabs'
  import { toast } from '@aziontech/ui/toast'
  import Tooltip from '@aziontech/ui/tooltip'
  import { type PropertyFilterQuery } from '@aziontech/ui/use-collection'
  import { useLocale } from '@aziontech/ui/use-locale'
  import { computed, ref, watch } from 'vue'

  import { methodLabel } from './billing-format'
  import BillingInvoices from './parts/billing-invoices.vue'
  import BillingPaymentDetails from './parts/billing-payment-details.vue'
  import BillingPaymentMethods from './parts/billing-payment-methods.vue'
  import BillingPlanCards from './parts/billing-plan-cards.vue'
  import {
    sampleInvoices,
    samplePaymentInformation,
    samplePaymentMethods,
    sampleSubscription,
    sampleUpdatedAt
  } from './sample'

  /** The page's tabs. */
  export type BillingTab = 'bills' | 'payment-methods'

  /** How an invoice was settled. */
  export type BillingInvoiceStatus = 'Paid' | 'Refunded' | 'Overdue'

  /** How often the plan bills. */
  export type BillingCycle = 'Monthly' | 'Yearly'

  /** One row of the invoices table. */
  export interface BillingInvoice {
    /** Invoice ID, the row key and the PDF name. */
    id: string
    /** Sequential invoice number. */
    number: number
    /** Plan billed. */
    plan: string
    /** Billing cycle. */
    cycle: BillingCycle
    /** Seats billed. */
    seats: number
    /** When the invoice was issued. */
    billedAt: Date
    /** Amount charged, in the account currency. */
    amount: number
    /** Brand of the card charged, for its plate. */
    brand: string
    /** The card charged, as brand and last four. */
    paymentMethod: string
    /** How it was settled. */
    status: BillingInvoiceStatus
  }

  /** One card on file. */
  export interface BillingPaymentMethod {
    /** Stable key. */
    id: string
    /** Name on the card. */
    holder: string
    /** Card brand. */
    brand: string
    /** Last four digits. */
    last4: string
    /** Expiration, as month and year. */
    expires: string
    /** Whether invoices are charged to it. */
    default: boolean
  }

  /** The current plan and its next charge. */
  export interface BillingSubscription {
    /** Plan name. */
    plan: string
    /** When the plan started. */
    startedAt: Date
    /** When the next charge runs. */
    nextChargeAt: Date
    /** What the next charge bills. */
    nextChargeAmount: number
  }

  /** Where invoices go and whether the plan renews. */
  export interface BillingPaymentInformation {
    /** Email invoices are sent to. */
    email: string
    /** Whether the plan renews on its own. */
    autoRenewal: boolean
    /** Billing address, on one line. */
    address: string
    /** Tax ID; empty shows the empty-value marker. */
    taxId: string
  }

  export interface BillingProps {
    /** The invoices; filtered, sorted and paged in the browser. Left out, the sample renders. */
    invoices?: BillingInvoice[]
    /** The cards on file. Left out, the sample renders. */
    paymentMethods?: BillingPaymentMethod[]
    /** The current plan. Left out, the sample renders. */
    subscription?: BillingSubscription
    /** Where invoices go. Left out, the sample renders. */
    paymentInformation?: BillingPaymentInformation
    /** When the data was fetched. Left out, the sample time renders. */
    updatedAt?: Date
    /** The filter the invoices open with. */
    defaultQuery?: PropertyFilterQuery
    /** A request is in flight: skeletons and loading rows. */
    loading?: boolean
    /** Why the billing data could not load; a danger alert with Retry replaces the tab. */
    error?: string
  }

  const props = withDefaults(defineProps<BillingProps>(), {
    invoices: undefined,
    paymentMethods: undefined,
    subscription: undefined,
    paymentInformation: undefined,
    updatedAt: undefined,
    defaultQuery: () => ({ tokens: [], operation: 'and' }),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    'set-default': [event: Event, method: BillingPaymentMethod]
    remove: [event: Event, method: BillingPaymentMethod]
  }>()

  const activeTab = defineModel<BillingTab>('tab', { default: 'bills' })

  const { formatDate: formatLocaleDate } = useLocale()

  const updatedFormat = (value: Date | number | string) =>
    formatLocaleDate(value, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short'
    })

  const blocked = computed(() => props.loading || props.error !== '')
  const updatedAt = computed(() => props.updatedAt ?? sampleUpdatedAt)
  const subscription = computed(
    () => props.subscription ?? (blocked.value ? undefined : sampleSubscription)
  )
  const paymentInformation = computed(
    () => props.paymentInformation ?? (blocked.value ? undefined : samplePaymentInformation)
  )
  const invoiceSource = computed<BillingInvoice[]>(
    () => props.invoices ?? (blocked.value ? [] : sampleInvoices)
  )
  const methodSource = computed<BillingPaymentMethod[]>(
    () => props.paymentMethods ?? (blocked.value ? [] : samplePaymentMethods)
  )

  const tabs: { value: BillingTab; label: string }[] = [
    { value: 'bills', label: 'Bills' },
    { value: 'payment-methods', label: 'Payment methods' }
  ]

  const methodRows = ref<BillingPaymentMethod[]>([])
  watch(
    methodSource,
    (next) => {
      methodRows.value = [...next]
    },
    { immediate: true }
  )

  const defaultMethod = computed(() => methodRows.value.find((method) => method.default))

  const pendingRemoval = ref<BillingPaymentMethod | null>(null)
  const removeOpen = ref(false)

  const onMethodAction = (
    event: Event,
    value: DropdownMenuItemValue,
    method: BillingPaymentMethod
  ) => {
    if (value === 'default') {
      methodRows.value = methodRows.value.map((item) => ({
        ...item,
        default: item.id === method.id
      }))
      toast.success(`${methodLabel(method)} is now the default.`, {
        description: 'The next invoice is charged to this card.'
      })
      emit('set-default', event, method)
      return
    }
    if (value === 'remove') {
      pendingRemoval.value = method
      removeOpen.value = true
    }
  }

  const onMethodRemove = (event: KeyboardEvent, method: BillingPaymentMethod) => {
    if (!method.default) onMethodAction(event, 'remove', method)
  }

  const removeMethod = (event: Event) => {
    const method = pendingRemoval.value
    if (!method) return
    methodRows.value = methodRows.value.filter((item) => item.id !== method.id)
    removeOpen.value = false
    toast.success(`${methodLabel(method)} removed.`)
    emit('remove', event, method)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Billing"
        description="Your plan, your invoices and the cards they are charged to."
      >
        <template #actions>
          <span
            v-if="!blocked"
            class="text-body-sm text-(--text-muted)"
            >Updated {{ updatedFormat(updatedAt) }}</span
          >
          <Tooltip
            content="Refresh"
            class="shrink-0"
          >
            <IconButton
              icon="az az-refresh"
              variant="outline"
              size="medium"
              :loading="loading"
              aria-label="Refresh billing data"
              @click="emit('refresh', $event)"
            />
          </Tooltip>
          <Button
            label="Documentation"
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/billing"
            target="_blank"
          />
        </template>
      </PageHeader>

      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>

      <section
        class="@container/bands flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-boundary-end)"
      >
        <Alert
          v-if="error"
          severity="danger"
        >
          {{ error }}
          <template #actions>
            <Button
              label="Retry"
              variant="secondary"
              size="small"
              @click="emit('retry', $event)"
            />
          </template>
        </Alert>

        <template v-else-if="activeTab === 'bills'">
          <BillingPlanCards
            :subscription="subscription"
            :default-method="defaultMethod"
            :loading="loading"
          />
          <BillingInvoices
            :invoices="invoiceSource"
            :default-query="defaultQuery"
            :loading="loading"
            @refresh="(event) => emit('refresh', event)"
          />
        </template>

        <template v-else>
          <BillingPaymentDetails
            :payment-information="paymentInformation"
            :loading="loading"
          />
          <BillingPaymentMethods
            :methods="methodRows"
            :loading="loading"
            @action="onMethodAction"
            @row-remove="onMethodRemove"
          />
        </template>
      </section>
    </div>

    <ConfirmDialog
      v-model:open="removeOpen"
      title="Remove payment method"
      :description="`${pendingRemoval ? methodLabel(pendingRemoval) : ''} is removed from the account. Paid invoices keep showing it.`"
      confirm-label="Remove"
      size="small"
      @confirm="removeMethod"
    />
  </div>
</template>
