<script setup lang="ts">
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'

  import type {
    SecurityCardId,
    SecurityMatchedRequests,
    SecuritySourceIp
  } from '../dashboard-security.vue'
  import { ipColumns, securityCards } from '../security-cards'
  import MatchedChart from './matched-chart.vue'

  export interface SecurityDialogProps {
    /** The card shown expanded. */
    cardId: SecurityCardId
    /** The Matched requests chart. */
    matched: SecurityMatchedRequests
    /** Blocked requests by attack category. */
    categories: BarListItem[]
    /** Blocked requests by country. */
    countries: BarListItem[]
    /** The Top source IPs rows. */
    sourceIps: SecuritySourceIp[]
    /** The Line and Bar options of the toggle. */
    forms: ToggleGroupOption[]
    /** Writes a request count. */
    formatCount: (value: number) => string
  }

  defineProps<SecurityDialogProps>()

  const open = defineModel<boolean>('open', { default: false })
  const form = defineModel<string>('form', { default: 'line' })
</script>

<template>
  <Dialog
    v-model:open="open"
    size="large"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DialogTitle>{{ securityCards[cardId].label }}</DialogTitle>
          <DialogDescription>{{ securityCards[cardId].description }}</DialogDescription>
        </div>
      </PanelHeader>
      <PanelBody>
        <div class="flex min-w-0 flex-col gap-(--spacing-md)">
          <template v-if="cardId === 'matched'">
            <div>
              <ToggleGroup
                v-model="form"
                :options="forms"
                size="small"
                :aria-label="`Chart form for ${securityCards[cardId].label}`"
              />
            </div>
            <MatchedChart
              :matched="matched"
              :format-value="formatCount"
              :bar="form === 'bar'"
              :height="420"
              :aria-label="securityCards[cardId].label"
            />
          </template>
          <BarList
            v-else-if="cardId === 'categories' || cardId === 'countries'"
            :items="cardId === 'categories' ? categories : countries"
            :format-value="formatCount"
            empty-title="No blocked requests in this period"
            :aria-label="securityCards[cardId].label"
          />
          <DataTable
            v-else
            :data="sourceIps"
            :columns="ipColumns"
            row-key="id"
            sortable
            density="compact"
            bordered
          >
            <template #empty>
              <EmptyState
                size="small"
                icon="az az-shield"
                title="No blocked requests in this period"
                description="Nothing was recorded in this period."
              />
            </template>
            <template #cell-requests="{ row }">
              <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
            </template>
            <template #footer>
              <DataTablePagination :page-size="10" />
            </template>
          </DataTable>
        </div>
      </PanelBody>
    </DialogContent>
  </Dialog>
</template>
