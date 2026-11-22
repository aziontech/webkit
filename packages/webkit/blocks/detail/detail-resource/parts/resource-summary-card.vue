<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Card from '@aziontech/webkit/card'
  import { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import type { ResourceDetailResource } from '../detail-resource.vue'
  import SummaryFact from './summary-fact.vue'
  import SummaryFacts from './summary-facts.vue'
  import SummaryStateBand from './summary-state-band.vue'
  import SummarySubjectBand from './summary-subject-band.vue'

  export interface ResourceSummaryCardProps {
    /** The resource the card sums up. */
    resource: ResourceDetailResource
    /** When and by whom it was created, already formatted. */
    created: string
  }

  const props = defineProps<ResourceSummaryCardProps>()

  const emit = defineEmits<{
    action: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  defineSlots<{
    source(): unknown
    default(): unknown
  }>()

  const address = computed(() => `https://${props.resource.domain}`)

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
        :label="resource.domain"
        :href="address"
        :visit="address"
        actions-label="Resource actions"
        :menu="menu"
        @select="(event, value) => emit('action', event, value)"
      />

      <SummaryFacts>
        <SummaryFact
          label="Deployment"
          class="lg:col-span-2"
        >
          <div class="flex min-w-0">
            <Tooltip
              :content="`Open ${resource.deploymentId} in Deployments`"
              class="w-full"
            >
              <Link
                :label="resource.deploymentId"
                :href="`/deployments/${resource.deploymentId}`"
                size="small"
              />
            </Tooltip>
          </div>
          <Tag
            :label="resource.environment"
            severity="neutral"
            size="small"
            class="shrink-0"
          />
        </SummaryFact>

        <SummaryFact
          label="Domains"
          class="lg:col-span-2"
        >
          <div class="flex min-w-0">
            <TableCellLink
              :label="resource.domain"
              :href="address"
            />
          </div>
        </SummaryFact>

        <SummaryFact
          label="Status"
          value-class=""
          class="lg:col-span-2"
        >
          <StatusIndicator
            :severity="resource.statusSeverity"
            :label="resource.status"
          />
        </SummaryFact>

        <SummaryFact
          label="Created"
          class="lg:col-span-2"
        >
          <span class="truncate text-body-sm text-(--text-default)">
            {{ created }}
          </span>
          <Avatar
            :alt="resource.createdBy"
            :label="resource.createdBy"
            size="small"
            variant="square"
            class="shrink-0"
          />
        </SummaryFact>

        <SummaryFact
          label="Source"
          value-class="gap-(--spacing-sm)"
          class="lg:col-span-2"
        >
          <slot name="source" />
        </SummaryFact>

        <SummaryFact
          label="Framework"
          class="lg:col-span-2"
        >
          <i
            :class="resource.frameworkIcon"
            class="shrink-0 text-body-lg"
            aria-hidden="true"
          />
          <span class="truncate text-body-sm text-(--text-default)">
            {{ resource.framework }}
          </span>
        </SummaryFact>
      </SummaryFacts>

      <SummaryStateBand docs="https://example.com/docs/cli">
        <slot />
      </SummaryStateBand>
    </template>
  </Card>
</template>
