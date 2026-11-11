<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import ErrorBoundary from '@aziontech/webkit/error-boundary'
  import { ref } from 'vue'

  const items = [
    { id: 'south-america', name: 'South America', value: 9820000 },
    { id: 'north-america', name: 'North America', value: 7410000 },
    { id: 'europe', name: 'Europe', value: 4960000 }
  ]

  const broken = ref(false)

  const format = (value) =>
    new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)

  const failingFormat = () => {
    throw new Error('Unreadable value.')
  }
</script>

<template>
  <div class="flex w-full max-w-[512px] flex-col gap-(--spacing-sm)">
    <Card title="Requests by region">
      <template #content>
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
              icon="pi pi-exclamation-triangle"
              size="small"
            >
              <template #actions>
                <Button
                  label="Try again"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-refresh"
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
      kind="outlined"
      size="medium"
      class="self-start"
      :disabled="broken"
      @click="broken = true"
    />
  </div>
</template>
