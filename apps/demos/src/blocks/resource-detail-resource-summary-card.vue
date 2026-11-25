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

  import type { ResourceDetailResource } from './resource-detail.vue'
  import SummaryFact from './resource-detail-summary-fact.vue'
  import SummaryFacts from './resource-detail-summary-facts.vue'
  import SummaryStateBand from './resource-detail-summary-state-band.vue'
  import SummarySubjectBand from './resource-detail-summary-subject-band.vue'

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
  const deployed = computed(() => props.resource.deploymentId !== '')

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
        :label="deployed ? resource.domain : ''"
        :href="deployed ? address : ''"
        :visit="deployed ? address : ''"
        actions-label="Resource actions"
        :menu="menu"
        @select="(event, value) => emit('action', event, value)"
      >
        <template
          v-if="!deployed"
          #subject
        >
          <span class="truncate text-body-sm text-(--text-muted)">Not deployed yet</span>
        </template>
      </SummarySubjectBand>

      <SummaryFacts>
        <SummaryFact
          label="Deployment"
          empty="None"
          class="lg:col-span-2"
        >
          <template v-if="deployed">
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
          </template>
        </SummaryFact>

        <SummaryFact
          label="Domains"
          empty="None"
          class="lg:col-span-2"
        >
          <div
            v-if="deployed"
            class="flex min-w-0"
          >
            <TableCellLink
              :label="resource.domain"
              :href="address"
            />
          </div>
        </SummaryFact>

        <SummaryFact
          label="Status"
          empty="Not deployed"
          value-class=""
          class="lg:col-span-2"
        >
          <StatusIndicator
            v-if="deployed"
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
