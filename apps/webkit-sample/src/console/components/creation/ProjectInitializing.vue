<script setup lang="ts">
  import Spinner from '@aziontech/webkit/spinner'
  import { computed } from 'vue'

  import { formatBytes, formatManifest } from '../../lib/format/bytes'

  interface Props {
    files?: unknown[]
    truncated?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    files: () => [],
    truncated: false
  })

  const summary = computed(() => formatManifest(props.files, props.truncated))

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

    <p
      v-if="files.length > 1 || truncated"
      class="text-body-xs text-(--text-muted)"
    >
      {{ summary }}
    </p>
  </div>
</template>
