import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import CardPricing from '@aziontech/webkit/card-pricing'
import CopyButton from '@aziontech/webkit/copy-button'
import Currency from '@aziontech/webkit/currency'
import Divider from '@aziontech/webkit/divider'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerDescription from '@aziontech/webkit/drawer-description'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import EmptyState from '@aziontech/webkit/empty-state'
import FieldCheckbox from '@aziontech/webkit/field-checkbox'
import FieldSelect from '@aziontech/webkit/field-select'
import FieldText from '@aziontech/webkit/field-text'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Link from '@aziontech/webkit/link'
import Message from '@aziontech/webkit/message'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import Popover from '@aziontech/webkit/popover'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import StatusIndicator from '@aziontech/webkit/status-indicator'
import Switch from '@aziontech/webkit/switch'
import TabView from '@aziontech/webkit/tab-view'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  COLUMNS_SCRIPT,
  compound,
  controlsHeader,
  declare,
  LIST_IMPORTS,
  LIST_SCRIPT,
  pageHeading,
  pageMain,
  tableCard,
  useColumns,
  useList,
  VUE_IMPORT,
  webkitImport,
  webkitImports
} from './_account-markup'
import {
  CHANGE_PLAN_DRAWER,
  CHANGE_PLAN_IMPORTS,
  CHANGE_PLAN_SCRIPT,
  PLAN_UPGRADE_DRAWER,
  UPGRADE_IMPORTS,
  upgradeScript,
  useChangePlanFlow
} from './_billing-markup'

const DOCS = 'https://www.azion.com/en/documentation/'

const BILLING_TABS = [
  { value: 'bills', label: 'Bills' },
  { value: 'payment-methods', label: 'Payment Methods' }
]

const PLAN_FACTS = [
  { label: 'Plan Start Date', value: 'Jan 25, 2023' },
  { label: 'Next Charge Date', value: '01 Aug, 2026' },
  { label: 'Next Charge Value', value: '$ 320.00' },
  { label: 'Payment Method', value: 'Mastercard •••• 1702' }
]

const invoice = (seq, plan, seats, billingDate, status = 'Paid') => ({
  seq,
  id: `INV-A${12269 + seq}`,
  plan,
  cycle: 'Monthly',
  seats,
  billingDate,
  amount: seats * (plan === 'Business' ? 40 : 20),
  paymentMethod: 'Mastercard •••• 1702',
  status
})

const INVOICES = [
  invoice(132, 'Business', 8, '2026-07-01'),
  invoice(131, 'Business', 8, '2026-06-01'),
  invoice(130, 'Business', 7, '2026-05-01'),
  invoice(129, 'Business', 7, '2026-04-01', 'Refunded'),
  invoice(128, 'Business', 7, '2026-03-01')
]

const COLUMNS = [
  { accessorKey: 'seq', header: '№', label: 'Number', enableSorting: true, minWidth: 80 },
  {
    accessorKey: 'id',
    header: 'Invoice ID',
    enableSorting: true,
    principal: true,
    hideable: false,
    grow: 2
  },
  { accessorKey: 'plan', header: 'Plan', enableSorting: true, minWidth: 80 },
  { accessorKey: 'cycle', header: 'Cycle', enableSorting: true, minWidth: 80 },
  { accessorKey: 'seats', header: 'Seats', enableSorting: true, minWidth: 80 },
  { accessorKey: 'billingDate', header: 'Billing date', enableSorting: true, minWidth: 80 },
  { accessorKey: 'amount', header: 'Amount', enableSorting: true, minWidth: 80 },
  { accessorKey: 'paymentMethod', header: 'Payment Method', grow: 2 },
  { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
  { id: 'actions', kind: 'action', hideable: false }
]

const INVOICE_STATUS_SEVERITY = { Paid: 'success', Refunded: 'secondary', Overdue: 'danger' }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatDate = (iso) => {
  const [year, month, day] = iso.split('-')
  return `${day} ${MONTHS[Number(month) - 1]}, ${year}`
}

const PAYMENT_METHODS = [
  {
    id: 'pm-001',
    brand: 'Mastercard',
    last4: '1702',
    holder: 'Maria Silva',
    cardNumber: '•••• •••• •••• 1702',
    expires: '02 / 2027',
    default: true
  },
  {
    id: 'pm-002',
    brand: 'Visa',
    last4: '4431',
    holder: 'Azion Technologies',
    cardNumber: '•••• •••• •••• 4431',
    expires: '11 / 2026',
    default: false
  },
  {
    id: 'pm-003',
    brand: 'American Express',
    last4: '9008',
    holder: 'Robson Junior',
    cardNumber: '•••• •••• •••• 9008',
    expires: '05 / 2028',
    default: false
  }
]

const PAYMENT_COLUMNS = [
  {
    accessorKey: 'holder',
    header: 'Card Holder',
    enableSorting: true,
    principal: true,
    hideable: false,
    grow: 2
  },
  { accessorKey: 'cardNumber', header: 'Card Number', grow: 2 },
  { accessorKey: 'expires', header: 'Expiration Date', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const sectionHeading = ({
  title,
  id,
  description,
  action
}) => `<header class="group/heading flex flex-col">
  <div class="flex flex-col gap-(--spacing-md) px-(--spacing-xs) md:flex-row md:items-start md:justify-between">
    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
      <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
        <h2
          id="${id}"
          data-size="medium"
          class="scroll-mt-(--spacing-xl) text-balance data-[size=medium]:text-heading-xs data-[size=medium]:text-(--text-default) data-[size=small]:text-label-md data-[size=small]:text-(--text-muted)"
        >
          ${title}
        </h2>
        <span class="shrink-0 opacity-0 transition-opacity duration-150 ease-out group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none">
          <CopyButton
            value="#${id}"
            kind="transparent"
            size="small"
            aria-label="Copy link to the ${title} section"
            copied-label="Link copied"
          />
        </span>
      </div>
      <p class="text-pretty text-body-sm text-(--text-muted)">${description}</p>
    </div>
    <div class="flex w-full flex-wrap items-center gap-(--spacing-xs) md:w-auto md:shrink-0 md:flex-nowrap">
${indent(action, 3)}
    </div>
  </div>
</header>`

const PLAN_CARDS_ROW = `<div class="flex min-w-0 flex-col items-stretch gap-(--layout-group-gap) @4xl/bands:flex-row">
  <CardBox class="min-w-0 @4xl/bands:w-[45%]">
    <template #header>
      <div class="flex min-w-0 items-center justify-between gap-(--spacing-md)">
        <span class="text-label-lg text-(--text-default)">Subscription Plan</span>
        <Button label="Change Plan" kind="outlined" size="medium" @click="changePlanOpen = true" />
      </div>
    </template>
    <template #content>
      <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <span class="truncate text-label-lg text-(--text-default)">Business</span>
          <Tag label="Actual Plan" severity="secondary" size="medium" />
        </div>
        <dl class="flex min-w-0 flex-col gap-(--spacing-sm)">
          <div v-for="fact in planFacts" :key="fact.label" class="flex min-w-0 items-center justify-between gap-(--spacing-md)">
            <dt class="shrink-0 text-label-md text-(--text-muted)">{{ fact.label }}</dt>
            <dd class="min-w-0 truncate text-label-md text-(--text-default)">{{ fact.value }}</dd>
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
      <span class="text-label-lg text-(--text-default)">Upgrade to Pro</span>
    </template>
    <template #content>
      <div class="flex min-w-0 flex-col justify-between gap-(--spacing-lg)">
        <ul class="grid min-w-0 grid-cols-1 gap-(--spacing-sm) @md/plan:grid-cols-2" role="list">
          <li v-for="perk in upgradeFeatures" :key="perk.title" class="flex min-w-0 items-center gap-(--spacing-xs)">
            <i class="pi pi-check shrink-0 text-body-sm text-(--success-contrast)" aria-hidden="true" />
            <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{ perk.title }}</span>
          </li>
        </ul>
        <p class="text-body-sm text-(--text-muted)">
          Upgrade to unlock higher limits and keep your applications running at scale. Explore additional capabilities available with the Pro plan:
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full min-w-0 flex-wrap items-center justify-between gap-(--spacing-md)">
        <p class="text-body-xs text-(--text-default)">
          Learn more about
          <a href="${DOCS}" target="_blank" rel="noreferrer" class="text-(--text-link) hover:underline">Pricing and Plans.</a>
        </p>
        <Button label="Upgrade to Pro" kind="primary" size="medium" @click="upgradeOpen = true" />
      </div>
    </template>
  </CardBox>
</div>`

const INVOICE_CELLS = [
  `<template #empty>
  <EmptyState
    v-if="search"
    size="small"
    icon="pi pi-filter-slash"
    title="No invoices match these filters"
    description="Widen the search or clear the filters to see the rest of your history."
  >
    <template #actions>
      <Button label="Clear filters" kind="outlined" size="medium" @click="search = ''" />
    </template>
  </EmptyState>
  <EmptyState
    v-else
    size="small"
    icon="pi pi-file"
    title="No invoices yet"
    description="Your first invoice appears here once the first billing cycle closes."
  >
    <template #actions>
      <Button label="Billing documentation" kind="outlined" size="medium" icon="pi pi-external-link" href="${DOCS}" />
    </template>
  </EmptyState>
</template>`,
  `<template #cell-seq="{ value }">
  <span class="tabular-nums text-(--text-muted)">{{ value }}</span>
</template>`,
  `<template #cell-seats="{ value }">
  <span class="tabular-nums">{{ value }}</span>
</template>`,
  `<template #cell-billingDate="{ value }">
  <span class="tabular-nums">{{ formatDate(value) }}</span>
</template>`,
  `<template #cell-amount="{ value }">
  <Currency :value="value.toFixed(2)" size="small" class="tabular-nums" />
</template>`,
  `<template #cell-status="{ value }">
  <Tag :label="value" :severity="invoiceStatusSeverity[value] ?? 'secondary'" size="medium" />
</template>`,
  `<template #cell-actions="{ row }">
  <Tooltip text="Download invoice">
    <IconButton icon="pi pi-download" kind="outlined" size="small" :aria-label="'Download invoice ' + row.id" />
  </Tooltip>
</template>`
]

const BILLS_TAB = `<template v-if="activeTab === 'bills'">
${indent(PLAN_CARDS_ROW)}
  <div class="flex flex-col gap-(--layout-group-gap)">
${indent(
  pageHeading({
    title: 'Invoices',
    description: 'Your complete invoice history, including payment details.'
  }),
  2
)}
${indent(
  controlsHeader({
    placeholder: 'Search invoices',
    ariaLabel: 'Search invoices',
    filename: 'invoices.csv'
  }),
  2
)}

${indent(
  tableCard({
    rows: 'invoices',
    extra: '\n      paginated\n      :page-size="8"\n      export-filename="invoices.csv"',
    cells: INVOICE_CELLS
  }),
  2
)}
  </div>
</template>`

const PAYMENT_TAB = `<template v-else>
  <div class="flex flex-col gap-(--layout-group-gap)">
${indent(
  sectionHeading({
    title: 'Payment information',
    id: 'payment-information',
    description: 'Where invoices are sent, and whether the plan renews on its own.',
    action: '<Button label="Update" kind="outlined" size="medium" />'
  }),
  2
)}
    <CardBox>
      <template #content>
        <dl class="grid grid-cols-2 gap-x-(--spacing-lg) gap-y-(--spacing-md) xl:grid-cols-4">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <dt class="text-label-sm text-(--text-muted)">Billing email</dt>
            <dd class="truncate text-label-lg text-(--text-default)">maria.silva@azion.com</dd>
          </div>
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <dt class="text-label-sm text-(--text-muted)">Auto-renewal</dt>
            <dd class="min-w-0">
              <StatusIndicator severity="success" label="On" />
            </dd>
          </div>
        </dl>
      </template>
    </CardBox>
  </div>
  <div class="flex flex-col gap-(--layout-group-gap)">
${indent(
  sectionHeading({
    title: 'Payment methods',
    id: 'payment-methods',
    description: 'Every card on the account. Invoices are charged to the default one.',
    action: '<Button label="Add payment method" kind="outlined" size="medium" icon="pi pi-plus" />'
  }),
  2
)}
    <CardBox :padded="false">
      <template #content>
        <TableRoot :data="paymentMethods" :columns="paymentColumns" row-key="id" enable-sorting :border="false">
          <template #cell-holder="{ row, value }">
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate">{{ value }}</span>
              <Tag v-if="row.default" label="Default" severity="success" size="small" />
            </span>
          </template>
          <template #cell-cardNumber="{ row, value }">
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <i class="pi pi-credit-card shrink-0 text-(--text-muted)" aria-hidden="true" />
              <span class="truncate">{{ value }}</span>
              <span class="sr-only">{{ row.brand }} ending in {{ row.last4 }}</span>
            </span>
          </template>
        </TableRoot>
      </template>
    </CardBox>
  </div>
</template>`

const TEMPLATE = pageMain(`<div class="flex h-full min-w-0 flex-col">
  <header class="layout-column layout-boundary-inline flex min-w-0 shrink-0 flex-col pt-(--layout-boundary-start) pb-(--spacing-md)">
${indent(
  pageHeading({
    title: 'Billing',
    size: 'large',
    description: 'View and manage invoices, payments, and subscription details.',
    documentation: DOCS,
    actions: `<span class="text-label-md text-(--text-default)">Last Update: Oct 4, 2026, 09:37:40 AM</span>
<Tooltip text="Refresh">
  <IconButton icon="pi pi-refresh" kind="outlined" size="medium" ariaLabel="Refresh billing data" />
</Tooltip>`
  }),
  2
)}
  </header>
  <div class="border-b border-(--border-default)">
    <div class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm) layout-column">
      <TabView v-model:value="activeTab" class="-ml-(--spacing-xs) min-w-0 flex-1">
        <TabView.List>
          <TabView.Item v-for="tab in billingTabs" :key="tab.value" :value="tab.value" :label="tab.label" />
        </TabView.List>
      </TabView>
    </div>
  </div>
  <div class="min-h-0 flex-1 overflow-auto">
    <section class="@container/bands layout-column layout-boundary flex min-w-0 flex-col gap-(--layout-section-gap)">
${indent(BILLS_TAB, 3)}
${indent(PAYMENT_TAB, 3)}
    </section>
  </div>
${indent(CHANGE_PLAN_DRAWER)}
${indent(PLAN_UPGRADE_DRAWER)}
</div>`)

const IMPORTS = [
  ...webkitImports([
    ...LIST_IMPORTS,
    ...UPGRADE_IMPORTS,
    ...CHANGE_PLAN_IMPORTS,
    webkitImport('CopyButton', 'copy-button'),
    webkitImport('Currency', 'currency'),
    webkitImport('EmptyState', 'empty-state'),
    webkitImport('StatusIndicator', 'status-indicator'),
    webkitImport('TabView', 'tab-view'),
    webkitImport('Tag', 'tag')
  ]),
  VUE_IMPORT(['computed', 'reactive', 'ref', 'watch']),
  '',
  "const activeTab = ref('bills')",
  declare('billingTabs', BILLING_TABS),
  declare('planFacts', PLAN_FACTS),
  '',
  declare('invoices', INVOICES),
  declare('columns', COLUMNS),
  declare('invoiceStatusSeverity', INVOICE_STATUS_SEVERITY),
  declare('months', MONTHS),
  'const formatDate = (iso) => {',
  "  const [year, month, day] = iso.split('-')",
  '  return `${day} ${months[Number(month) - 1]}, ${year}`',
  '}',
  ...LIST_SCRIPT,
  ...COLUMNS_SCRIPT(),
  '',
  declare('paymentMethods', PAYMENT_METHODS),
  declare('paymentColumns', PAYMENT_COLUMNS),
  '',
  ...CHANGE_PLAN_SCRIPT,
  '',
  ...upgradeScript(['upgradeOpen.value = false', 'changePlanOpen.value = false'])
]

const components = {
  Button,
  CardBox,
  CardPricing,
  CopyButton,
  Currency,
  Divider,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  EmptyState,
  FieldCheckbox,
  FieldSelect,
  FieldText,
  IconButton,
  InputText,
  Link,
  Message,
  PanelContent,
  PanelFooter,
  PanelHeader,
  ...compound('Popover', Popover, ['Trigger', 'Content']),
  SegmentedButton,
  StatusIndicator,
  Switch,
  TableRoot,
  ...compound('TabView', TabView, ['List', 'Item']),
  Tag,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Account/AccountSettings/Billing',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Billing and plan panel of Account Settings (`/account/billing`): a large page heading with the last update stamp and a refresh action, Bills and Payment Methods tabs, then on Bills the Subscription Plan and Upgrade to Pro cards over the invoice table, and on Payment Methods the payment information and the card table. Change Plan and Upgrade to Pro open their drawers, which start closed. The panels are switched from the Settings drill-down of the console sidebar, which the Shell templates own. Built from `TabView`, `CardBox`, `Tag`, `TableRoot`, `Currency`, `EmptyState`, `StatusIndicator`, `CopyButton`, `Drawer`, `CardPricing`, `SegmentedButton` and the field components.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Billing = {
  render: () => ({
    components,
    setup: () => ({
      activeTab: ref('bills'),
      billingTabs: BILLING_TABS,
      planFacts: PLAN_FACTS,
      invoices: INVOICES,
      columns: COLUMNS,
      invoiceStatusSeverity: INVOICE_STATUS_SEVERITY,
      formatDate,
      ...useList(),
      ...useColumns(COLUMNS),
      paymentMethods: PAYMENT_METHODS,
      paymentColumns: PAYMENT_COLUMNS,
      ...useChangePlanFlow()
    }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Bills tab on the Business plan with five invoices; switch to Payment Methods for the billing email, auto-renewal and three cards.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
