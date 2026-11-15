<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import ErrorBoundary from '@aziontech/webkit/error-boundary'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { ref } from 'vue'

  const items = [
    { id: 'south-america', name: 'South America', value: 9820000 },
    { id: 'north-america', name: 'North America', value: 7410000 },
    { id: 'europe', name: 'Europe', value: 4960000 }
  ]

  const broken = ref(false)

  const { formatNumber } = useLocale()

  const format = (value) => formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const failingFormat = () => {
    throw new Error('Unreadable value.')
  }
</script>

<template>
  <div class="flex w-full max-w-[512px] flex-col gap-(--spacing-sm)">
    <Card title="Requests by region">
      <template #default>
        <ErrorBoundary @retry="broken = false">
          <BarList
            :items="items"
            :format-value="broken ? failingFormat : format"
            aria-label="Requests by region"
          />
          <template #fallback="{ retry }">
            <EmptyState
              title="This chart failed to load"
              description="The rest of the dashboard still works."
              icon="ai ai-triangle-alert"
              size="small"
            >
              <template #actions>
                <Button
                  label="Try again"
                  variant="outline"
                  size="medium"
                  icon="ai ai-refresh"
                  @click="retry"
                />
              </template>
            </EmptyState>
          </template>
        </ErrorBoundary>
      </template>
    </Card>
    <Button
      label="Simulate a failure"
      variant="outline"
      size="medium"
      class="self-start"
      :disabled="broken"
      @click="broken = true"
    />
  </div>
</template>
