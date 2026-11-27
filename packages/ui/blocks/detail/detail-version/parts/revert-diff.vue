<script setup lang="ts">
  import type { VersionDetailRevertDiff } from '../detail-version.vue'

  export interface RevertDiffProps {
    /** What the revert changes. */
    revertDiff: VersionDetailRevertDiff
    /** Name of the deployed version the diff is against. */
    deployedName: string
  }

  defineProps<RevertDiffProps>()
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-md) pt-(--spacing-md)">
    <section
      aria-labelledby="revert-settings-title"
      class="flex min-w-0 flex-col gap-(--spacing-xs)"
    >
      <h3
        id="revert-settings-title"
        class="text-label-md text-(--text-default)"
      >
        What changes against {{ deployedName }}
      </h3>
      <ul
        class="flex min-w-0 flex-col divide-y divide-(--border-muted) rounded-(--shape-control) border border-(--border-default)"
      >
        <li
          v-for="change in revertDiff.settings"
          :key="change.setting"
          class="flex min-w-0 items-center justify-between gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-xs)"
        >
          <span class="truncate text-body-sm text-(--text-default)">{{ change.setting }}</span>
          <span class="sr-only">{{ `changes from ${change.from} to ${change.to}` }}</span>
          <span
            class="flex shrink-0 items-center gap-(--spacing-xs) text-body-sm"
            aria-hidden="true"
          >
            <span class="text-(--text-muted) line-through">{{ change.from }}</span>
            <i class="az az-arrow-right text-body-xs text-(--text-muted)" />
            <span class="text-(--text-default)">{{ change.to }}</span>
          </span>
        </li>
      </ul>
    </section>
    <p class="text-body-sm text-(--text-default)">
      Rules: {{ revertDiff.rulesAdded }} added, {{ revertDiff.rulesRemoved }} removed.
      {{ revertDiff.rulesNote }}
    </p>
  </div>
</template>
