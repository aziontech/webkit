<script setup>
  import ArtifactPreview from '@aziontech/webkit/artifact-preview'

  const rows = [
    { country: 'Brazil', requests: '1,204,330', hit: '92%' },
    { country: 'United States', requests: '884,102', hit: '89%' },
    { country: 'Portugal', requests: '120,448', hit: '95%' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ArtifactPreview
      title="cache-hits-by-country.csv"
      description="Last 7 days"
      meta="48 KB · 212 rows"
      icon="pi pi-table"
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
            <td class="px-(--spacing-sm) py-(--spacing-xs) text-end tabular-nums">{{ row.hit }}</td>
          </tr>
        </tbody>
      </table>
    </ArtifactPreview>
  </div>
</template>
