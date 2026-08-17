<script setup>
  // A domain, in a table cell: the name as a link out to it, and a copy button.
  //
  // The two halves answer the two things a reader does with a domain — open it, or
  // paste it somewhere else — and their placement is what makes a column of them
  // readable: the link TRUNCATES from the left edge, the copy button is pinned to the
  // cell's right edge (`ml-auto`), so the buttons line up down the column however
  // long each name is. `@click.stop` keeps opening the site from also triggering the
  // row's own click.
  //
  // Extracted because the same cell renders in three places (the Applications list,
  // the Workloads list — which adds a "+N" overflow Popover of its own — and Overview,
  // which lists both), and a domain that copies in one and does not in another is the
  // kind of drift nobody reports.
  import CopyButton from '@aziontech/webkit/copy-button'

  defineProps({
    /** The hostname, without a scheme. */
    value: { type: String, default: '' }
  })
</script>

<template>
  <div class="flex w-full min-w-0 items-center gap-[var(--spacing-xs)]">
    <a
      :href="`https://${value}`"
      target="_blank"
      rel="noopener noreferrer"
      class="flex min-w-0 items-center gap-[var(--spacing-xxs)] hover:underline"
      @click.stop
    >
      <span class="truncate">{{ value }}</span>
      <i
        class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]"
        aria-hidden="true"
      />
    </a>
    <CopyButton
      kind="outlined"
      :value="value"
      aria-label="Copy domain name"
      class="ml-auto shrink-0"
    />
  </div>
</template>
