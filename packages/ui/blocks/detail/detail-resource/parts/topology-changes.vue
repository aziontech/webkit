<script setup lang="ts">
  import type { TopologyStagedChange } from '../use-topology-staging'

  export interface TopologyChangesProps {
    /** The id of the heading that names the list. */
    headingId: string
    /** The staged changes. */
    changes: TopologyStagedChange[]
    /** What the list says when nothing is staged. */
    emptyText: string
  }

  defineProps<TopologyChangesProps>()
</script>

<template>
  <section
    :aria-labelledby="headingId"
    class="flex flex-col gap-(--spacing-xs)"
  >
    <h3
      :id="headingId"
      class="m-0 text-label-md text-(--text-default)"
    >
      Topology changes
    </h3>
    <ul
      v-if="changes.length"
      class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
    >
      <li
        v-for="change in changes"
        :key="change.key"
        class="flex flex-wrap items-center justify-between gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
      >
        <span class="text-body-sm text-(--text-default)">{{ change.kind }}</span>
        <span class="text-body-sm text-(--text-muted)">{{ change.from }} to {{ change.to }}</span>
      </li>
    </ul>
    <p
      v-else
      class="m-0 text-body-sm text-(--text-muted)"
    >
      {{ emptyText }}
    </p>
  </section>
</template>
