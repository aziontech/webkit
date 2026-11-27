<script setup>
  import Button from '@aziontech/ui/button'
  import ConfigProvider from '@aziontech/ui/config-provider'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import Field from '@aziontech/ui/field'
  import LanguageSelect from '@aziontech/ui/language-select'
  import { es } from '@aziontech/ui/locales/es'
  import { ptBR } from '@aziontech/ui/locales/pt-BR'
  import PaginationRoot from '@aziontech/ui/pagination-root'
  import Select from '@aziontech/ui/select'
  import Timestamp from '@aziontech/ui/timestamp'
  import ToggleGroup from '@aziontech/ui/toggle-group'
  import { ref } from 'vue'

  const NOW = Date.UTC(2026, 10, 14, 12, 10)
  const DEPLOYED_AT = '2026-11-14T12:04:31Z'
  const catalogs = { 'pt-BR': ptBR, es }

  const locale = ref('pt-BR')
  const dir = ref('auto')
  const timeZone = ref('America/Sao_Paulo')
  const page = ref(1)
  const open = ref(false)

  const directions = [
    { label: 'Auto', value: 'auto' },
    { label: 'LTR', value: 'ltr' },
    { label: 'RTL', value: 'rtl' }
  ]

  const zones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/Sao_Paulo', label: 'São Paulo' },
    { value: 'America/New_York', label: 'New York' },
    { value: 'Asia/Tokyo', label: 'Tokyo' }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div class="flex flex-wrap items-end gap-(--spacing-sm)">
      <div class="w-48 max-w-full">
        <Field>
          <Field.Label>Language</Field.Label>
          <LanguageSelect
            v-model="locale"
            size="medium"
          />
        </Field>
      </div>
      <div class="w-44 max-w-full">
        <Field>
          <Field.Label>Time zone</Field.Label>
          <Select
            v-model="timeZone"
            size="medium"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item
                v-for="zone in zones"
                :key="zone.value"
                :value="zone.value"
                >{{ zone.label }}</Select.Item
              >
            </Select.Content>
          </Select>
        </Field>
      </div>
      <div class="flex flex-col gap-(--spacing-2xs)">
        <span class="text-label-md text-(--text-default)">Direction</span>
        <ToggleGroup
          v-model="dir"
          :options="directions"
          aria-label="Direction"
          size="medium"
        />
      </div>
    </div>

    <ConfigProvider
      :locale="locale"
      :catalogs="catalogs"
      :dir="dir"
      :now="NOW"
      :time-zone="timeZone"
    >
      <div
        class="flex flex-col gap-(--spacing-md) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
      >
        <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
          <div class="flex flex-wrap items-baseline gap-(--spacing-xs) text-body-sm">
            <span class="text-(--text-muted)">Last deploy</span>
            <Timestamp :value="DEPLOYED_AT" />
          </div>
          <ConfirmDialog
            v-model:open="open"
            title="Delete domain"
            description="edge.example.com will stop serving traffic for this resource."
            size="small"
            @confirm="open = false"
          >
            <template #trigger>
              <Button
                label="Delete domain"
                variant="outline"
                size="medium"
              />
            </template>
          </ConfirmDialog>
        </div>
        <PaginationRoot
          v-model:page="page"
          :total="120"
        />
      </div>
    </ConfigProvider>
  </div>
</template>
