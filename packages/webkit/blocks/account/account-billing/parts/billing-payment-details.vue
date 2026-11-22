<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Subheader from '@aziontech/webkit/subheader'

  import type { BillingPaymentInformation } from '../account-billing.vue'

  export interface BillingPaymentDetailsProps {
    /** Where invoices go; left out while loading or after an error. */
    paymentInformation?: BillingPaymentInformation
    /** A request is in flight. */
    loading: boolean
  }

  withDefaults(defineProps<BillingPaymentDetailsProps>(), {
    paymentInformation: undefined
  })
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <Subheader
      title="Payment information"
      description="Where invoices are sent, and whether the plan renews on its own."
      size="small"
    >
      <template #actions>
        <Button
          label="Update"
          variant="outline"
          size="medium"
          href="/account/account-billing/payment-information"
          :disabled="loading"
        />
      </template>
    </Subheader>
    <Card>
      <template #default>
        <KeyValueList
          :columns="4"
          :loading="loading"
          aria-label="Payment information"
        >
          <KeyValueList.Item label="Billing email">
            <span
              v-if="paymentInformation?.email"
              dir="ltr"
              >{{ paymentInformation.email }}</span
            >
          </KeyValueList.Item>
          <KeyValueList.Item label="Auto-renewal">
            <StatusIndicator
              v-if="paymentInformation"
              :severity="paymentInformation.autoRenewal ? 'success' : 'neutral'"
              :label="paymentInformation.autoRenewal ? 'On' : 'Off'"
            />
          </KeyValueList.Item>
          <KeyValueList.Item label="Billing address">
            <template v-if="paymentInformation?.address">{{ paymentInformation.address }}</template>
          </KeyValueList.Item>
          <KeyValueList.Item label="Tax ID">
            <template v-if="paymentInformation?.taxId">{{ paymentInformation.taxId }}</template>
          </KeyValueList.Item>
        </KeyValueList>
      </template>
    </Card>
  </div>
</template>
