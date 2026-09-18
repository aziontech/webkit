<script setup>
  // THE BEAT BETWEEN DROPPING A PROJECT AND CONFIGURING IT.
  //
  // The drop resolves in milliseconds — we read a directory, we do not upload anything —
  // so nothing here is waiting on work. What it is waiting on is the READER: a file
  // released over a page used to swap the whole screen for a different one on the next
  // frame, with no moment in which the project they just handed over was acknowledged.
  // The most common thing to drop is the wrong folder, and that mistake was invisible
  // until the deploy form was already asking for a name.
  //
  // So the drop is answered where it happened, with the one thing that confirms it landed
  // and that it is the right one: the files, by path, counted and weighed. A reader who
  // dropped `~/Downloads` instead of `~/code/site` sees it here, before the flow moves.
  //
  // Everything is queued and nothing is running, which is why every row reads `Waiting`
  // and none of them progresses. A per-file progression would be theater — the bytes
  // never move — and a fake one is worse than none: it teaches the reader to trust a
  // signal that is not measuring anything.
  import Spinner from '@aziontech/webkit/spinner'
  import { computed } from 'vue'

  import { formatBytes, formatManifest } from '../../lib/format/bytes'

  const props = defineProps({
    /** Files read off the drop: `{ path, name, size }`. */
    files: { type: Array, default: () => [] },
    /** Whether the walk stopped before the project did. */
    truncated: { type: Boolean, default: false }
  })

  const summary = computed(() => formatManifest(props.files, props.truncated))

  // The fade says the list runs past the box, so it is only worn by a list that does —
  // on one that fits it would dim the last row of a complete listing and claim there is
  // more. Hence a state on the element rather than a class the box always carries.
  //
  // BOTTOM ONLY. The list is never scrolled — the screen holds for a beat and hands off —
  // so its first row is always the project's first file. Fading the top of it, as the
  // reference does, would say there are files above the one you can see, which is the one
  // thing this screen exists to be trusted about.
  const overflowing = computed(() => props.files.length > 6)
</script>

<template>
  <div
    class="animate-fade-in motion-reduce:animate-none fixed inset-0 z-(--z-input-overlay) flex flex-col items-center justify-center gap-(--spacing-xl) bg-(--bg-canvas) p-(--spacing-xl)"
    role="status"
    aria-live="polite"
  >
    <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
      <Spinner class="size-6 text-(--primary)" />
      <h1 class="text-heading-lg text-(--text-default)">Initializing…</h1>
      <p class="text-body-sm text-(--text-muted)">Setting up your deployment…</p>
    </header>

    <div
      :data-overflowing="overflowing || null"
      class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-xxs) overflow-hidden data-[overflowing]:max-h-80 data-[overflowing]:[mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
    >
      <div
        v-for="file in files"
        :key="file.path"
        class="flex items-center gap-(--spacing-sm) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
      >
        <span
          class="min-w-0 truncate font-(family-name:--font-code) text-body-xs text-(--text-default)"
          :title="file.path"
        >
          {{ file.path }}
        </span>
        <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
          {{ formatBytes(file.size) }}
        </span>
        <span class="ml-auto shrink-0 text-body-xs text-(--text-muted)">Waiting</span>
      </div>
    </div>

    <!-- The total, for a listing the reader cannot count by eye. One file states its own
         size in its own row, so the line would just say it again. -->
    <p
      v-if="files.length > 1 || truncated"
      class="text-body-xs text-(--text-muted)"
    >
      {{ summary }}
    </p>
  </div>
</template>
