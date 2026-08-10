<script setup>
  // The claim chips of the Network argument — a wrapping row of soft-accent pills,
  // one per claim.
  //
  // Soft-accent is composed from the primary token rather than taken from a Tag
  // severity: no severity ships this treatment (accent is a solid blue fill, primary
  // a solid orange), which is a DS gap worth a `subtle` severity on Tag. Composed
  // ONCE here so the site band and the auth panel cannot drift into two different
  // pills — before this it was a 6-utility class string living inline in the page.
  //
  // A `<ul>` because it is a list and reads as one to a screen reader. Alignment is
  // the caller's: the site band hangs them from the left of its copy column, the auth
  // panel centres them under its headline, so `justify-*` arrives as a class through
  // the normal attribute fallthrough.
  //
  // The fill mixes the accent into `--bg-surface` rather than into `transparent`,
  // which is the one thing that changed when this moved out of the page. Both forms
  // composite to the same colour over a plain surface — the site band, where it came
  // from — but a chip is a label, and a translucent label over the pixel map's dense
  // half puts map dots inside the letterforms. Opaque at the same hue reads
  // identically on the site and stays legible wherever the panel puts it.
  defineProps({
    // The claims, as plain strings.
    claims: {
      type: Array,
      required: true
    }
  })
</script>

<template>
  <ul class="flex flex-wrap gap-[var(--spacing-xs)]">
    <li
      v-for="claim in claims"
      :key="claim"
      class="inline-flex h-8 items-center rounded-[var(--shape-elements)] border border-[color-mix(in_srgb,var(--primary)_45%,var(--bg-surface))] bg-[color-mix(in_srgb,var(--primary)_16%,var(--bg-surface))] px-[var(--spacing-xs)] text-label-md text-[var(--text-default)]"
    >
      {{ claim }}
    </li>
  </ul>
</template>
