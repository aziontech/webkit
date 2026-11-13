<script setup>
  import ArtifactCanvas from '@aziontech/webkit/artifact-canvas'
  import Button from '@aziontech/webkit/button'
  import { onBeforeUnmount, ref } from 'vue'

  const rows = [
    { country: 'United States', requests: '1,204,330', hit: '92%' },
    { country: 'United Kingdom', requests: '884,102', hit: '89%' },
    { country: 'Portugal', requests: '120,448', hit: '95%' }
  ]
  const streaming = ref(false)
  let timer = 0

  const regenerate = () => {
    streaming.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      streaming.value = false
    }, 1500)
  }
  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-sm)">
    <div
      class="h-(--container-3xs) overflow-hidden rounded-(--shape-card) border border-(--border-default)"
    >
      <ArtifactCanvas
        title="cache-hits-by-country.csv"
        meta="Last 7 days · 3 rows"
        kind="table"
        :streaming="streaming"
        download-href="data:text/csv;charset=utf-8,country,requests,hit"
      >
        <table class="w-full border-collapse text-body-sm">
          <thead class="bg-(--bg-surface-raised)">
            <tr>
              <th
                scope="col"
                class="px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm"
              >
                Country
              </th>
              <th
                scope="col"
                class="px-(--spacing-sm) py-(--spacing-xs) text-end text-label-sm"
              >
                Requests
              </th>
              <th
                scope="col"
                class="px-(--spacing-sm) py-(--spacing-xs) text-end text-label-sm"
              >
                Hit ratio
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="row.country"
              class="border-t border-(--border-muted)"
            >
              <td class="px-(--spacing-sm) py-(--spacing-xs)">{{ row.country }}</td>
              <td class="px-(--spacing-sm) py-(--spacing-xs) text-end tabular-nums">
                {{ row.requests }}
              </td>
              <td class="px-(--spacing-sm) py-(--spacing-xs) text-end tabular-nums">
                {{ row.hit }}
              </td>
            </tr>
          </tbody>
        </table>
      </ArtifactCanvas>
    </div>
    <Button
      class="self-start"
      label="Regenerate"
      kind="outlined"
      size="small"
      icon="pi pi-refresh"
      :loading="streaming"
      @click="regenerate"
    />
  </div>
</template>
