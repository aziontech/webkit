<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <CardBox
    :padded="false"
    class="w-full"
  >
    <template #header>
      <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
      <StatusIndicator
        loading
        severity="info"
        label="Building"
      />
    </template>

    <template #content>
      <div
        class="flex min-h-(--size-96) flex-col items-center justify-center gap-(--spacing-xl) p-(--spacing-lg)"
      >
        <div
          class="w-(--size-64) overflow-hidden rounded-(--shape-card) border border-(--primary) bg-(--bg-surface)"
        >
          <div class="flex items-center gap-(--spacing-xxs) border-b border-(--border-default)">
            <span class="size-2 rounded-full bg-(--danger)" />
            <span class="size-2 rounded-full bg-(--warning)" />
            <span class="size-2 rounded-full bg-(--success)" />
          </div>
          <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)">
            <div class="h-3 w-3/4 rounded-(--shape-flat) bg-(--bg-surface-raised)" />
            <div class="flex items-center justify-center gap-(--spacing-lg) py-(--spacing-sm)">
              <span
                class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-canvas) text-(--text-default)"
              >
                <i
                  class="ai ai-github text-body-lg"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-selected) bg-(--bg-canvas) text-(--primary)"
              >
                <i
                  class="pi pi-server text-body-lg"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div class="h-3 w-3/4 rounded-(--shape-flat) bg-(--bg-surface-raised)" />
          </div>
        </div>

        <div
          class="flex max-w-(--container-lg) flex-wrap items-center justify-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
        >
          <span>Cloning</span>
          <span
            class="inline-flex items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-xs) py-(--spacing-xxs)"
          >
            <i
              class="ai ai-github text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            acme/web-app
          </span>
          <span class="text-(--text-muted)">to</span>
          <span
            class="inline-flex items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-xs) py-(--spacing-xxs)"
          >
            <i
              class="ai ai-github text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            acme
          </span>
        </div>
      </div>
    </template>
  </CardBox>
</template>
