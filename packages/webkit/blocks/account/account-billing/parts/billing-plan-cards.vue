<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CurrencyAmount from '@aziontech/webkit/currency-amount'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import Link from '@aziontech/webkit/link'
  import PaymentBrand from '@aziontech/webkit/payment-brand'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import type { BillingPaymentMethod, BillingSubscription } from '../account-billing.vue'
  import { formatAmount, methodLabel } from '../billing-format'

  export interface BillingPlanCardsProps {
    /** The current plan; left out while loading or after an error. */
    subscription?: BillingSubscription
    /** The card invoices are charged to. */
    defaultMethod?: BillingPaymentMethod
    /** A request is in flight. */
    loading: boolean
  }

  withDefaults(defineProps<BillingPlanCardsProps>(), {
    subscription: undefined,
    defaultMethod: undefined
  })

  const { formatDate: formatLocaleDate } = useLocale()
  const formatDate = (value: Date): string =>
    formatLocaleDate(value, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

  const enterprisePerks = [
    { icon: 'az az-chart-line', label: 'On-demand pricing' },
    { icon: 'az az-arrow-down', label: 'Cut costs with commitments' },
    { icon: 'az az-calendar', label: 'Savings Plan available' },
    { icon: 'az az-headphones', label: 'Advanced support available' }
  ]
</script>

<template>
  <div class="flex min-w-0 flex-col items-stretch gap-(--layout-group-gap) @4xl/bands:flex-row">
    <div class="flex min-w-0 @4xl/bands:w-[45%]">
      <Card class="w-full">
        <template #header>
          <div class="flex w-full min-w-0 items-center justify-between gap-(--spacing-md)">
            <h2 class="text-heading-xs text-(--text-default)">Subscription plan</h2>
            <Button
              label="Change plan"
              variant="outline"
              size="medium"
              href="/account/account-billing/plans"
              :disabled="loading"
            />
          </div>
        </template>
        <template #default>
          <div class="flex min-w-0 flex-col gap-(--spacing-md)">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <Skeleton
                v-if="loading"
                width="8rem"
                height="1.25rem"
              />
              <template v-else>
                <span class="truncate text-label-lg text-(--text-default)">{{
                  subscription?.plan
                }}</span>
                <Tag
                  label="Current plan"
                  severity="neutral"
                  size="small"
                />
              </template>
            </div>
            <KeyValueList
              variant="split"
              :loading="loading"
              aria-label="Subscription details"
            >
              <KeyValueList.Item label="Plan start date">
                <template v-if="subscription">{{ formatDate(subscription.startedAt) }}</template>
              </KeyValueList.Item>
              <KeyValueList.Item label="Next charge date">
                <template v-if="subscription">{{ formatDate(subscription.nextChargeAt) }}</template>
              </KeyValueList.Item>
              <KeyValueList.Item label="Next charge value">
                <CurrencyAmount
                  v-if="subscription"
                  :value="formatAmount(subscription.nextChargeAmount)"
                  size="small"
                />
              </KeyValueList.Item>
              <KeyValueList.Item label="Payment method">
                <template v-if="defaultMethod">
                  <PaymentBrand
                    :brand="defaultMethod.brand"
                    size="small"
                    decorative
                  />
                  <span>{{ methodLabel(defaultMethod) }}</span>
                </template>
              </KeyValueList.Item>
            </KeyValueList>
          </div>
        </template>
        <template #footer>
          <p class="text-body-xs text-(--text-muted)">
            Each invoice includes all usage up to the last day of the month.
          </p>
        </template>
      </Card>
    </div>

    <div class="@container/plan flex min-w-0 flex-1">
      <Card class="w-full">
        <template #header>
          <h2 class="text-heading-xs text-(--text-default)">Upgrade to Enterprise</h2>
        </template>
        <template #default>
          <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
            <p class="text-body-sm text-(--text-muted)">
              Higher limits, commitments that lower the price and a support team for workloads that
              run at scale.
            </p>
            <ul class="grid min-w-0 grid-cols-1 gap-(--spacing-sm) @md/plan:grid-cols-2">
              <li
                v-for="perk in enterprisePerks"
                :key="perk.label"
                class="flex min-w-0 items-center gap-(--spacing-xs)"
              >
                <i
                  :class="perk.icon"
                  class="shrink-0 text-body-sm text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="min-w-0 text-body-sm text-(--text-default)">{{ perk.label }}</span>
              </li>
            </ul>
          </div>
        </template>
        <template #footer>
          <div
            class="flex w-full min-w-0 flex-wrap items-center justify-between gap-(--spacing-md)"
          >
            <Link
              href="https://example.com/pricing"
              target="_blank"
              size="small"
              label="Pricing and plans"
            />
            <Button
              label="Contact sales"
              variant="primary"
              size="medium"
              href="https://example.com/contact-sales"
              target="_blank"
              :disabled="loading"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
