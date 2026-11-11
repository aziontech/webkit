<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ErrorBoundary from '@aziontech/webkit/error-boundary'
  import { ref } from 'vue'

  const items = [
    { id: 'web-app-prod', name: 'web-app-prod', value: 11420000 },
    { id: 'payments-api', name: 'payments-api', value: 6240000 },
    { id: 'storefront-checkout', name: 'storefront-checkout', value: 4910000 }
  ]

  const broken = ref(false)
  const reported = ref('')

  const format = (value) =>
    new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)

  const failingFormat = () => {
    throw new Error('The response held a value the list could not read.')
  }

  const report = ({ error }) => {
    reported.value = error instanceof Error ? error.message : String(error)
  }

  const recover = () => {
    broken.value = false
    reported.value = ''
  }
</script>

<template>
  <div class="flex w-full max-w-[512px] flex-col gap-(--spacing-sm)">
    <Card title="Top services">
      <template #content>
        <ErrorBoundary
          @error="report"
          @retry="recover"
        >
          <BarList
            :items="items"
            :format-value="broken ? failingFormat : format"
            aria-label="Top services by requests"
          />
        </ErrorBoundary>
      </template>
    </Card>
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Button
        label="Simulate a failure"
        kind="outlined"
        size="medium"
        :disabled="broken"
        @click="broken = true"
      />
      <p
        v-if="reported"
        class="m-0 text-body-sm text-(--text-muted)"
      >
        Reported: {{ reported }}
      </p>
    </div>
  </div>
</template>
