<script setup lang="ts">
  import TableCellLink from '@aziontech/webkit/table-cell-link'

  import ResourceSummaryCard from '../parts/resource-summary-card.vue'
  import { webAppResource } from '../sample'
</script>

<template>
  <ResourceSummaryCard
    :resource="webAppResource"
    created="4 weeks ago by Riley Carter"
  >
    <template #source>
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <i
          class="az az-github shrink-0 text-(--text-muted)"
          aria-hidden="true"
        />
        <div class="flex min-w-0">
          <TableCellLink
            label="acme/web-app"
            href="https://github.example.com/acme/web-app"
          />
        </div>
      </div>
      <div class="flex min-w-0 items-center gap-(--spacing-2xs)">
        <i
          class="az az-git-branch shrink-0 text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="truncate text-body-sm text-(--text-default)">develop</span>
      </div>
    </template>
    <p class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)">
      Every push to
      <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)">develop</code>
      deploys this resource to Production. To ship from your machine, drop your project anywhere on
      this page or run
      <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)"
        >platform deploy</code
      >
      via the CLI.
    </p>
  </ResourceSummaryCard>
</template>
