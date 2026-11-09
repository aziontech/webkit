<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import Spinner from '@aziontech/webkit/spinner'
  import { computed, onScopeDispose, ref } from 'vue'

  import { formatBytes, formatManifest } from '../../lib/format/bytes'

  interface Props {
    files?: { path: string; size?: number }[]
    truncated?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    files: () => [],
    truncated: false
  })

  const STEP_MS = 320

  const summary = computed(() => formatManifest(props.files, props.truncated))
  const overflowing = computed(() => props.files.length > 6)

  const active = ref(0)
  const timer = setInterval(() => {
    if (active.value < props.files.length - 1) active.value += 1
    else clearInterval(timer)
  }, STEP_MS)
  onScopeDispose(() => clearInterval(timer))

  const stepStatus = (index: number) =>
    index < active.value ? 'done' : index === active.value ? 'running' : 'pending'

  const progress = computed(() => `${Math.min(active.value, props.files.length)} of ${props.files.length} files`)
</script>

<template>
  <div
    class="animate-fade-in motion-reduce:animate-none fixed inset-0 z-(--z-input-overlay) flex flex-col items-center justify-center gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xl)"
    role="status"
    aria-live="polite"
  >
    <header class="flex flex-col items-center gap-(--spacing-xxs) text-center">
      <h1 class="text-heading-sm text-(--text-default)">Initializing</h1>
      <p class="text-body-sm text-(--text-muted)">Setting up your deployment. {{ progress }}.</p>
    </header>

    <CardBox
      :padded="false"
      class="w-full max-w-(--container-md)"
    >
      <template #content>
        <ol
          :data-overflowing="overflowing || null"
          class="flex flex-col overflow-hidden data-overflowing:max-h-80 data-overflowing:mask-[linear-gradient(to_bottom,black_80%,transparent)]"
        >
          <li
            v-for="(file, index) in files"
            :key="file.path"
            class="flex min-h-10 items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) last:border-b-0"
          >
            <span class="flex size-5 shrink-0 items-center justify-center">
              <i
                v-if="stepStatus(index) === 'done'"
                class="pi pi-check-circle text-(--success-contrast)"
                aria-hidden="true"
              />
              <Spinner
                v-else-if="stepStatus(index) === 'running'"
                class="size-4 text-(--text-default)"
              />
              <span
                v-else
                class="size-3.5 rounded-full border border-dashed border-(--border-default)"
              />
            </span>

            <span
              :data-state="stepStatus(index)"
              class="min-w-0 truncate text-label-code-md text-(--text-default) data-[state=pending]:text-(--text-muted)"
              :title="file.path"
            >
              {{ file.path }}
            </span>

            <span class="ml-auto shrink-0 text-label-sm tabular-nums text-(--text-muted)">
              {{ formatBytes(file.size) }}
            </span>
          </li>
        </ol>
      </template>
    </CardBox>

    <p
      v-if="files.length > 1 || truncated"
      class="text-body-xs text-(--text-muted)"
    >
      {{ summary }}
    </p>
  </div>
</template>
