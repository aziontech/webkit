<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { es } from '@aziontech/webkit/locales/es'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
  import { ref } from 'vue'

  const range = ref({
    type: 'absolute',
    start: '2026-11-10T12:00:00.000Z',
    end: '2026-11-10T18:30:00.000Z'
  })
</script>

<template>
  <WebkitProvider :catalogs="{ 'pt-BR': ptBR, es }">
    <div class="flex flex-col items-start gap-(--spacing-sm)">
      <DateRangePicker
        v-model="range"
        range-selector-mode="absolute-only"
        time-zone="UTC"
        aria-label="Billing window"
      />
      <p class="text-body-sm text-(--text-muted)">
        Sent to the server: {{ range.start }} to {{ range.end }}
      </p>
    </div>
  </WebkitProvider>
</template>
