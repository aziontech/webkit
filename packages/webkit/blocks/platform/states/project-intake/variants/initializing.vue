<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Spinner from '@aziontech/webkit/spinner'

  const files = [
    { path: 'package.json', size: '1.2 KB', state: 'done' },
    { path: 'app.config.js', size: '640 B', state: 'done' },
    { path: 'src/index.ts', size: '3.4 KB', state: 'running' },
    { path: 'src/routes/api.ts', size: '2.1 KB', state: 'pending' },
    { path: 'public/index.html', size: '860 B', state: 'pending' }
  ]
</script>

<template>
  <div class="relative h-dvh [contain:layout]">
    <div
      class="animate-fade-in motion-reduce:animate-none fixed inset-0 z-(--z-input-overlay) flex flex-col items-center justify-center gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xl)"
      role="status"
      aria-live="polite"
    >
      <header class="flex flex-col items-center gap-(--spacing-xxs) text-center">
        <h1 class="text-heading-sm text-(--text-default)">Initializing</h1>
        <p class="text-body-sm text-(--text-muted)">Setting up your deployment. 2 of 5 files.</p>
      </header>

      <Card
        :padded="false"
        class="w-full max-w-(--container-md)"
      >
        <template #content>
          <ol class="flex flex-col">
            <li
              v-for="file in files"
              :key="file.path"
              class="flex min-h-10 items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) last:border-b-0"
            >
              <span class="flex size-5 shrink-0 items-center justify-center">
                <i
                  v-if="file.state === 'done'"
                  class="pi pi-check-circle text-(--success-contrast)"
                  aria-hidden="true"
                />
                <div
                  v-else-if="file.state === 'running'"
                  class="contents text-(--text-default)"
                >
                  <Spinner />
                </div>
                <span
                  v-else
                  class="size-3.5 rounded-full border border-dashed border-(--border-default)"
                />
              </span>
              <span
                :data-state="file.state"
                class="min-w-0 truncate text-label-code-md text-(--text-default) data-[state=pending]:text-(--text-muted)"
                :title="file.path"
              >
                {{ file.path }}
              </span>
              <span class="ms-auto shrink-0 text-label-sm tabular-nums text-(--text-muted)">{{
                file.size
              }}</span>
            </li>
          </ol>
        </template>
      </Card>

      <p class="text-body-xs text-(--text-muted)">5 files, 8.17 KB</p>
    </div>
  </div>
</template>
