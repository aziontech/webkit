<script setup>
  // A domain, in a table cell: the name as a link out to it, and a copy button.
  //
  // The two halves answer the two things a reader does with a domain — open it, or
  // paste it somewhere else — and their placement is what makes a column of them
  // readable: the link TRUNCATES from the left edge, the copy button is pinned to the
  // cell's right edge (`ml-auto`), so the buttons line up down the column however
  // long each name is.
  //
  // The link itself is the console's one cross-resource link shape
  // (../resource/ResourceLink.vue): a 12px `pi-external-link` and a tooltip naming
  // where it goes. It also stops the click, so opening the site never also triggers
  // the row's own click.
  //
  // Extracted because the same cell renders in three places (the Applications list,
  // the Workloads list — which adds a "+N" overflow Popover of its own — and Overview,
  // which lists both), and a domain that copies in one and does not in another is the
  // kind of drift nobody reports.
  import CopyButton from '@aziontech/webkit/copy-button'

  import ResourceLink from '../resource/ResourceLink.vue'
  import DomainOverflowPopover from './DomainOverflowPopover.vue'

  defineProps({
    /** The hostname, without a scheme. */
    value: { type: String, default: '' },
    /** Every address on the record, primary first — what the "+N" popover lists. */
    domains: { type: Array, default: () => [] },
    /** The overflow count on the tag: everything after the primary. Zero hides it. */
    count: { type: Number, default: 0 }
  })
</script>

<template>
  <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
    <ResourceLink
      :label="value"
      :href="`https://${value}`"
    />
    <DomainOverflowPopover
      v-if="count"
      :domains="domains"
      :count="count"
    />
    <CopyButton
      kind="outlined"
      :value="value"
      aria-label="Copy domain name"
      class="ml-auto shrink-0"
    />
  </div>
</template>
