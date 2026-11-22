<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { computed } from 'vue'

  import type { FirstDeployService } from '../sample'
  import SummaryFact from './summary-fact.vue'
  import SummaryFacts from './summary-facts.vue'
  import SummarySubjectBand from './summary-subject-band.vue'

  export interface FirstDeployServiceCardProps {
    /** The service the card sums up. */
    service: FirstDeployService
  }

  const props = defineProps<FirstDeployServiceCardProps>()

  const address = computed(() => `https://${props.service.domain}`)
  const statusLabel = computed(() => {
    if (props.service.deployStep) return `Deploying · ${props.service.deployStep}`
    return props.service.live ? 'Live' : 'Inactive'
  })
  const statusSeverity = computed(() => {
    if (props.service.deployStep) return 'info'
    return props.service.live ? 'success' : 'neutral'
  })

  const menu = [
    [{ value: 'copy-url', label: 'Copy URL', icon: 'az az-copy' }],
    [{ value: 'settings', label: 'Settings', icon: 'az az-settings' }]
  ]
</script>

<template>
  <Card :padded="false">
    <template #default>
      <SummarySubjectBand
        icon="az az-globe"
        :label="service.domain"
        :href="address"
        :visit="address"
        actions-label="Service actions"
        :menu="menu"
      />

      <SummaryFacts columns="sm:grid-cols-4">
        <SummaryFact
          label="Custom domains"
          value-class=""
          empty="None"
        />

        <SummaryFact
          label="Status"
          value-class=""
        >
          <StatusIndicator
            :severity="statusSeverity"
            :loading="Boolean(service.deployStep)"
            :label="statusLabel"
          />
        </SummaryFact>

        <SummaryFact label="Service ID">
          <span class="truncate text-body-sm tabular-nums text-(--text-default)">{{
            service.id
          }}</span>
          <CopyButton
            variant="outline"
            :value="service.id"
            aria-label="Copy service ID"
            class="shrink-0"
            size="small"
          />
        </SummaryFact>

        <SummaryFact label="Created">
          <span class="truncate text-body-sm text-(--text-default)">
            {{ service.createdAt }} by {{ service.createdBy }}
          </span>
          <Avatar
            :alt="service.createdBy"
            :label="service.createdBy"
            size="small"
            variant="square"
            class="shrink-0"
          />
        </SummaryFact>
      </SummaryFacts>
    </template>
  </Card>
</template>
